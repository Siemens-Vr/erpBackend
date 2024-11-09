
const {Folder} = require('../models')
const { error } = require('../validation/documentValidation')
module.exports.createFolder =async (req, res)=>{
    try{
        const projectId = req.params.id
        const {name, description}= req.body

        const folder = await Folder.create({
            projectId,
            folderName: name,
            description
        })
        if(!folder){
            return res.status(400).json({error: 'Error creating the folder'})
        }
        res.status(201).json(folder)

    }catch(error){
        console.log('Error in the folder controller',  error.message)
        res.status(500).json({error: 'Internal server error'})
    }
}

module.exports.getFolders =async (req, res)=>{
    try{
        const projectId = req.params.id
        const folders = await Folder.findAll({where : {projectId}})

        if(!folders){
            return res.status(404).json({error : "Error fetching folders"})
        }

        res.status(200).json(folders)

        // console.log('things')

    }catch(error){
        console.log('Error in the folder controller',  error.message)
        res.status(500).json({error: 'Internal server error'})
    }
}

module.exports.getFolderData =async (req, res)=>{
    try{

    }catch(error){
        console.log('Error in the folder controller',  error.message)
        res.status(500).json({error: 'Internal server error'})
    }
}

module.exports.updateFolder =async (req, res)=>{
    try{

    }catch(error){
        console.log('Error in the folder controller',  error.message)
        res.status(500).json({error: 'Internal server error'})
    }
}

module.exports.deleteFolder =async (req, res)=>{
    try{

    }catch(error){
        console.log('Error in the folder controller',  error.message)
        res.status(500).json({error: 'Internal server error'})
    }
}