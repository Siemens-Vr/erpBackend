const express = require('express');
const router = express.Router();
const {
  createDocument,
  updateDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument
} = require('../controllers/documents');
const upload = require('../middleware/uploadMiddleware');

// Create document
router.post('/:projectUuid', upload.single('file'), createDocument);
router.post('/:projectUuid/folders/:folderUuid', upload.single('file'), createDocument);
router.post('/:projectUuid/folders/:folderUuid/subfolders/:subFolderUuid', upload.single('file'), createDocument);
router.put('/:projectUuid/:documentUuid', upload.single('file'), updateDocument);
router.get('/:projectUuid', getAllDocuments);
router.get('/:projectUuid/folders/:folderUuid', getAllDocuments);
router.get('/:projectUuid/folders/:folderUuid/subfolders/:subFolderUuid', getAllDocuments);
router.get('/:projectUuid/:documentUuid', getDocumentById);
router.delete('/:projectUuid/:documentUuid', deleteDocument);

module.exports = router;