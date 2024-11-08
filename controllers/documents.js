const { Document, Project, sequelize } = require('../models');
const documentValidation = require('../validation/documentValidation');
const path = require('path');
const fs = require('fs').promises;

// Create a new document with file upload
exports.createDocument = async (req, res) => {
  console.log(req.file);
  console.log(req.params);  

  const uuid = req.params.projectUuid;
  const file = req.file;  

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const project = await Project.findOne({ where: { uuid } });
    
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Create the document for the single file uploaded
    const document = await Document.create({
      projectId: project.uuid,
      documentPath: file.path,
      documentName: file.filename,
    });

    console.log("Document Created:", document);

    res.status(201).json({ message: 'Document created successfully', data: document });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
};


// Update a document by its UUID and project UUID
exports.updateDocument = async (req, res) => {
  const { error } = documentValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const project = await Project.findOne({ where: { uuid: req.params.projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const document = await Document.findOne({
      where: { uuid: req.params.documentUuid, projectId: project.uuid },
    });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    if (req.file) {
      if (document.documentPath) {
        try {
          await fs.unlink(document.documentPath);
        } catch (err) {
          console.error('Error deleting old file:', err);
        }
      }
      document.documentPath = req.file.path;
      document.fileName = req.file.filename;
    }

    await document.update(req.body);
    res.status(200).json({ message: 'Document updated successfully', data: document });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
};

// Fetch all documents for a project
exports.getAllDocuments = async (req, res) => {
  try {
    const project = await Project.findOne({ where: { uuid: req.params.projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const documents = await Document.findAll({ where: { projectId: project.uuid } });
    res.status(200).json({ status: "ok", data: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Get a specific document by its UUID and project UUID
exports.getDocumentById = async (req, res) => {
  try {
    const project = await Project.findOne({ where: { uuid: req.params.projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const document = await Document.findOne({
      where: { uuid: req.params.documentUuid, projectId: project.uuid },
    });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    res.status(200).json({ status: "ok", data: document });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
};

// Delete a document by its UUID and project UUID
exports.deleteDocument = async (req, res) => {
  try {
    const project = await Project.findOne({ where: { uuid: req.params.projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const document = await Document.findOne({
      where: { uuid: req.params.documentUuid, projectId: project.uuid },
    });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    if (document.documentPath) {
      try {
        await fs.unlink(document.documentPath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await document.destroy();
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};