const { Folder, SubFolder } = require('../models');

module.exports.createFolder = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { folderName, description } = req.body;

    const folder = await Folder.create({
      projectId,
      folderName,
      description
    });

    if (!folder) {
      return res.status(400).json({ error: 'Error creating the folder' });
    }

    res.status(201).json(folder);
  } catch (error) {
    console.log('Error in the folder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.getFolders = async (req, res) => {
  try {
    const projectId = req.params.id;
    const folders = await Folder.findAll({ where: { projectId } });

    if (!folders) {
      return res.status(404).json({ error: "Error fetching folders" });
    }

    res.status(200).json(folders);
  } catch (error) {
    console.log('Error in the folder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.getFolderData = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await Folder.findByPk(folderId, {
      include: [{ model: SubFolder, as: 'subFolders' }]
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.status(200).json(folder);
  } catch (error) {
    console.log('Error in the folder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.updateFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const { folderName, description } = req.body;

    const folder = await Folder.findByPk(folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    await folder.update({
      folderName,
      description
    });

    res.status(200).json(folder);
  } catch (error) {
    console.log('Error in the folder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await Folder.findByPk(folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Delete all subfolders associated with this folder
    await SubFolder.destroy({ where: { folderId } });

    // Delete the folder itself
    await folder.destroy();

    res.status(200).json({ message: "Folder and associated subfolders deleted successfully" });
  } catch (error) {
    console.log('Error in the folder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};