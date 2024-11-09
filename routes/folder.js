const express = require('express')
const { getFolders, getFolderData, createFolder } = require('../controllers/folder')

const router = express.Router()

router.get('/:id', getFolders)
router.get('/:id/folder', getFolderData)
router.post('/:id', createFolder)



module.exports = router