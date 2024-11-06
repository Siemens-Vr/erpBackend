const { Document, Project, sequelize } = require('../models');
const documentValidation = require('../validation/documentValidation');
const fs = require('fs');
const path = require('path');

// Create a new document with file upload
exports.createDocument = async (req, res) => {
    const { error } = documentValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    const transaction = await sequelize.transaction();
  
    try {
      // Use req.params.projectUuid to get the project UUID from the route parameter
      const project = await Project.findOne({ where: { uuid: req.params.projectUuid }, transaction });
      if (!project) return res.status(404).json({ error: 'Project not found' });
  
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
      const document = await Document.create({ 
        projectId: project.uuid, 
        documentPath: req.file.path, 
      }, { transaction });
  
      await transaction.commit();
      res.status(200).json({ message: 'Document created successfully' },document);
    } catch (err) {
      await transaction.rollback();
      res.status(500).json({ error: err.message });
    }
  };
  

// Get all documents for a project by project UUID
exports.getAllDocuments = async (req, res) => {
  try {
    const project = await Project.findOne({ where: { uuid: req.params.projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const documents = await Document.findAll({ where: { projectId: project.uuid } });

    // Process documents to include document filename and check existence in upload folder
    const processedDocuments = documents.map((document) => {
      const documentName = document.documentPath ? path.basename(document.documentPath) : null;
      const fullPath = document.documentPath ? path.join('/opt/render/project/src/uploads', documentName) : null;

      return {
        ...document.toJSON(),
        documentName,
        existsInUploads: fullPath ? fs.existsSync(fullPath) : false,
      };
    });

    res.status(200).json(processedDocuments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific document by its UUID and project UUID, and send the actual document if it exists
exports.getDocumentById = async (req, res) => {
  try {
    const project = await Project.findOne({ where: { uuid: req.params.projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const document = await Document.findOne({
      where: { uuid: req.params.documentUuid, projectId: project.uuid },
    });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    const documentName = path.basename(document.documentPath);
    const fullPath = path.join('/home/victor/Documents/Siemens/erpBackend/uploads', documentName);

    // Check if the document file exists, and if so, send it
    if (fs.existsSync(fullPath)) {
      res.sendFile(fullPath);
    } else {
      res.status(404).json({ error: 'Document file not found in uploads folder' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update a document by its UUID and project UUID
exports.updateDocument = async (req, res) => {
  const { error } = documentValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const transaction = await sequelize.transaction();

  try {
    const project = await Project.findOne({ where: { uuid: req.params.projectUuid }, transaction });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const document = await Document.findOne({
      where: { uuid: req.params.documentUuid, projectId: project.uuid },
      transaction,
    });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    if (req.file) {
      if (document.documentPath) {
        fs.unlink(document.documentPath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      document.documentPath = req.file.path;
    }

    await document.update(req.body, { transaction });
    await transaction.commit();
    res.status(200).json({ message: 'Document updated successfully' },document);
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
};

// Delete a document by its UUID and project UUID
exports.deleteDocument = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const project = await Project.findOne({ where: { uuid: req.params.projectUuid }, transaction });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const document = await Document.findOne({
      where: { uuid: req.params.documentUuid, projectId: project.uuid },
      transaction,
    });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    await document.destroy({ transaction });
    await transaction.commit();
    res.status(200).send({ message: 'Document deleted successfully' });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
};
