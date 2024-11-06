const { Document, Project, sequelize } = require('../models');
const documentValidation = require('../validation/documentValidation');
const fs = require('fs');
const path = require('path');
const fs = require('fs').promises;


// Create a new document with file upload
exports.createDocument = async (req, res) => {
    const { error } = documentValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    const transaction = await sequelize.transaction();
  
    try {
      const project = await Project.findOne({ where: { uuid: req.params.projectUuid }, transaction });
      if (!project) return res.status(404).json({ error: 'Project not found' });
  
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
      const document = await Document.create({
        projectId: project.uuid,
        documentPath: req.file.path,
      }, { transaction });
  
      await transaction.commit();
      res.status(200).json({ message: 'Document created successfully' });
    } catch (err) {
      await transaction.rollback();
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
      res.status(200).json({ message: 'Document updated successfully' });
    } catch (err) {
      await transaction.rollback();
      res.status(500).json({ error: err.message });
    }
  };
  
 
  
  exports.getAllDocuments = async (req, res) => {
    try {
      const project = await Project.findOne({ where: { uuid: req.params.projectUuid } });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      const documents = await Document.findAll({ where: { projectId: project.uuid } });
  
      const processedDocuments = await Promise.all(documents.map(async (document) => {
        if (!document.documentPath) {
          return res.status(400).json({ 
            error: 'Invalid document path',
            documentId: document.uuid 
          });
        }
  
        // Get the full filename including timestamp from documentPath
        const fullFileName = document.documentPath.split('/').pop(); // Gets "1730894356421-911488836-CITY TYRES - DRAW PROFESSIONALS 2024.pdf"
        const fullPath = path.join('/opt/render/project/src/uploads', fullFileName);
        
        try {
          await fs.access(fullPath);
          const buffer = await fs.readFile(fullPath);
          
          return {
            ...document.toJSON(),
            documentName: fullFileName,  // Include the full filename with timestamp
            originalName: fullFileName.split('-').slice(2).join('-'), // Gets original filename without timestamps
            existsInUploads: true,
            fileData: buffer.toString('base64'),
            mimeType: document.mimeType || 'application/octet-stream'
          };
        } catch (error) {
          return res.status(404).json({ 
            error: 'Document file not found in uploads folder',
            documentPath: document.documentPath,
            documentId: document.uuid
          });
        }
      }));
  
      res.status(200).json(processedDocuments);
    } catch (err) {
      console.error('Error in getAllDocuments:', err);
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.getDocumentById = async (req, res) => {
    try {
      const project = await Project.findOne({ where: { uuid: req.params.projectUuid } });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      const document = await Document.findOne({
        where: { uuid: req.params.documentUuid, projectId: project.uuid },
      });
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
  
      if (!document.documentPath) {
        return res.status(400).json({ 
          error: 'Invalid document path',
          documentId: document.uuid 
        });
      }
  
      // Get the full filename including timestamp from documentPath
      const fullFileName = document.documentPath.split('/').pop();
      const fullPath = path.join('/home/victor/Documents/Siemens/erpBackend/uploads', fullFileName);
  
      try {
        await fs.access(fullPath);
        const buffer = await fs.readFile(fullPath);
        
        return res.status(200).json({
          ...document.toJSON(),
          documentName: fullFileName, // Include the full filename with timestamp
          originalName: fullFileName.split('-').slice(2).join('-'), // Gets original filename without timestamps
          existsInUploads: true,
          fileData: buffer.toString('base64'),
          mimeType: document.mimeType || 'application/octet-stream'
        });
      } catch (error) {
        return res.status(404).json({ 
          error: 'Document file not found in uploads folder',
          documentPath: document.documentPath,
          documentId: document.uuid
        });
      }
    } catch (err) {
      console.error('Error in getDocumentById:', err);
      return res.status(500).json({ error: err.message });
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
