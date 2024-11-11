const express = require('express');
const router = express.Router();
const { createSubFolder,getSubFolders,getSubFolderData,updateSubFolder,deleteSubFolder} = require('../controllers/subFolder');


router.post('/:folderId', createSubFolder);
router.get('/:folderId', getSubFolders);
router.get('/:subFolderId', getSubFolderData);
router.put('/:subFolderId', updateSubFolder);
router.delete('/:subFolderId', deleteSubFolder);

module.exports = router;
