const { Document, Project, Folder, SubFolder, sequelize } = require('../models');
const documentValidation = require('../validation/documentValidation');
const path = require('path');
const fs = require('fs').promises;

// Create a new document with file upload
exports.createDocument = async (req, res) => {
  console.log(req.file);
  console.log(req.params);  

  const { projectUuid, folderUuid, subFolderUuid } = req.params;
  const file = req.file;  

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const project = await Project.findOne({ where: { uuid: projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    let folderId = null;
    let subFolderId = null;

    if (folderUuid) {
      const folder = await Folder.findOne({ where: { uuid: folderUuid, projectId: projectUuid } });
      if (!folder) return res.status(404).json({ error: 'Folder not found' });
      folderId = folder.uuid;

      if (subFolderUuid) {
        const subFolder = await SubFolder.findOne({ where: { uuid: subFolderUuid, folderId: folderUuid } });
        if (!subFolder) return res.status(404).json({ error: 'SubFolder not found' });
        subFolderId = subFolder.uuid;
      }
    }

    // Create the document for the single file uploaded
    const document = await Document.create({
      projectId: project.uuid,
      folderId,
      subFolderId,
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
    const { projectUuid, documentUuid, folderUuid, subFolderUuid } = req.params;

    const project = await Project.findOne({ where: { uuid: projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const document = await Document.findOne({
      where: { uuid: documentUuid, projectId: projectUuid },
    });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    if (folderUuid) {
      const folder = await Folder.findOne({ where: { uuid: folderUuid, projectId: projectUuid } });
      if (!folder) return res.status(404).json({ error: 'Folder not found' });
      document.folderId = folder.uuid;

      if (subFolderUuid) {
        const subFolder = await SubFolder.findOne({ where: { uuid: subFolderUuid, folderId: folderUuid } });
        if (!subFolder) return res.status(404).json({ error: 'SubFolder not found' });
        document.subFolderId = subFolder.uuid;
      } else {
        document.subFolderId = null;
      }
    } else {
      document.folderId = null;
      document.subFolderId = null;
    }

    if (req.file) {
      if (document.documentPath) {
        try {
          await fs.unlink(document.documentPath);
        } catch (err) {
          console.error('Error deleting old file:', err);
        }
      }
      document.documentPath = req.file.path;
      document.documentName = req.file.filename;
    }

    await document.save();
    res.status(200).json({ message: 'Document updated successfully', data: document });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
};

// Fetch all documents for a project, folder, or subfolder
exports.getAllDocuments = async (req, res) => {
  try {
    const { projectUuid, folderUuid, subFolderUuid } = req.params;

    const project = await Project.findOne({ where: { uuid: projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    let whereClause = { projectId: projectUuid };

    if (folderUuid) {
      const folder = await Folder.findOne({ where: { uuid: folderUuid, projectId: projectUuid } });
      if (!folder) return res.status(404).json({ error: 'Folder not found' });
      whereClause.folderId = folderUuid;

      if (subFolderUuid) {
        const subFolder = await SubFolder.findOne({ where: { uuid: subFolderUuid, folderId: folderUuid } });
        if (!subFolder) return res.status(404).json({ error: 'SubFolder not found' });
        whereClause.subFolderId = subFolderUuid;
      }
    }

    const documents = await Document.findAll({ where: whereClause });
    res.status(200).json({ status: "ok", data: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Get a specific document by its UUID and project UUID
exports.getDocumentById = async (req, res) => {
  try {
    const { projectUuid, documentUuid } = req.params;

    const project = await Project.findOne({ where: { uuid: projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const document = await Document.findOne({
      where: { uuid: documentUuid, projectId: projectUuid },
      include: [
        { model: Folder, as: 'folder' },
        { model: SubFolder, as: 'subFolder' }
      ]
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
    const { projectUuid, documentUuid } = req.params;

    const project = await Project.findOne({ where: { uuid: projectUuid } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const document = await Document.findOne({
      where: { uuid: documentUuid, projectId: projectUuid },
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