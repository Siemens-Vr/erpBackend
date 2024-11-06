const express = require('express');
const router = express.Router();
const {createDocument,updateDocument,getAllDocuments,getDocumentById,deleteDocument} = require('../controllers/documents');
const upload = require('../middleware/uploadMiddleware');


router.post('/:projectUuid', upload.single('file'), createDocument);
router.put('/:projectUuid/:documentUuid', upload.single('file'), updateDocument);
router.get('/:projectUuid', getAllDocuments);
router.get('/:projectUuid/:documentUuid',getDocumentById);
router.delete('/:projectUuid/:documentUuid', deleteDocument);

module.exports = router;
