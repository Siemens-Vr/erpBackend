const { SubFolder, Folder } = require('../models');

module.exports.createSubFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const { name, description } = req.body;

    // Check if parent folder exists
    const parentFolder = await Folder.findByPk(folderId);
    if (!parentFolder) {
      return res.status(404).json({ error: 'Parent folder not found' });
    }

    // Check if the subfolder with the same name already exists within the folder
    const existingSubFolder = await SubFolder.findOne({
      where: { folderId }
    });

    if (existingSubFolder) {
      return res.status(400).json({ error: 'Subfolder with this name already exists' });
    }

    // Create new subfolder
    const subFolder = await SubFolder.create({
      folderId,
      projectId: parentFolder.projectId, 
      folderName: name,
      description
    });

    res.status(201).json(subFolder);
  } catch (error) {
    console.log('Error in the subfolder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports.getSubFolders = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const subFolders = await SubFolder.findAll({ where: { folderId } });

    if (!subFolders) {
      return res.status(404).json({ error: "Error fetching subfolders" });
    }

    res.status(200).json(subFolders);
  } catch (error) {
    console.log('Error in the subfolder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.getSubFolderData = async (req, res) => {
  try {
    const subFolderId = req.params.subFolderId;
    const subFolder = await SubFolder.findByPk(subFolderId);

    if (!subFolder) {
      return res.status(404).json({ error: "Subfolder not found" });
    }

    res.status(200).json(subFolder);
  } catch (error) {
    console.log('Error in the subfolder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.updateSubFolder = async (req, res) => {
  try {
    const subFolderId = req.params.subFolderId;
    const { name, description } = req.body;

    const subFolder = await SubFolder.findByPk(subFolderId);

    if (!subFolder) {
      return res.status(404).json({ error: "Subfolder not found" });
    }

    await subFolder.update({
      folderName: name,
      description
    });

    res.status(200).json(subFolder);
  } catch (error) {
    console.log('Error in the subfolder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.deleteSubFolder = async (req, res) => {
  try {
    const subFolderId = req.params.subFolderId;
    const subFolder = await SubFolder.findByPk(subFolderId);

    if (!subFolder) {
      return res.status(404).json({ error: "Subfolder not found" });
    }

    await subFolder.destroy();

    module.exports.createSubFolder = async (req, res) => {
      try {
        const folderId = req.params.folderId;
        const { name, description } = req.body;
    
        const parentFolder = await Folder.findByPk(folderId);
        if (!parentFolder) {
          return res.status(404).json({ error: 'Parent folder not found' });
        }
    
        const subFolder = await SubFolder.create({
          folderId,
          projectId: parentFolder.projectId,
          folderName: name,
          description
        });
    
        if (!subFolder) {
          return res.status(400).json({ error: 'Error creating the subfolder' });
        }
    
        res.status(201).json(subFolder);
      } catch (error) {
        console.log('Error in the subfolder controller', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    
    module.exports.getSubFolders = async (req, res) => {
      try {
        const folderId = req.params.folderId;
        const subFolders = await SubFolder.findAll({ where: { folderId } });
    
        if (!subFolders) {
          return res.status(404).json({ error: "Error fetching subfolders" });
        }
    
        res.status(200).json(subFolders);
      } catch (error) {
        console.log('Error in the subfolder controller', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    
    module.exports.getSubFolderData = async (req, res) => {
      try {
        const subFolderId = req.params.subFolderId;
        const subFolder = await SubFolder.findByPk(subFolderId);
    
        if (!subFolder) {
          return res.status(404).json({ error: "Subfolder not found" });
        }
    
        res.status(200).json(subFolder);
      } catch (error) {
        console.log('Error in the subfolder controller', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    
    module.exports.updateSubFolder = async (req, res) => {
      try {
        const subFolderId = req.params.subFolderId;
        const { name, description } = req.body;
    
        const subFolder = await SubFolder.findByPk(subFolderId);
    
        if (!subFolder) {
          return res.status(404).json({ error: "Subfolder not found" });
        }
    
        await subFolder.update({
          folderName: name,
          description
        });
    
        res.status(200).json(subFolder);
      } catch (error) {
        console.log('Error in the subfolder controller', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    
    module.exports.deleteSubFolder = async (req, res) => {
      try {
        const subFolderId = req.params.subFolderId;
        const subFolder = await SubFolder.findByPk(subFolderId);
    
        if (!subFolder) {
          return res.status(404).json({ error: "Subfolder not found" });
        }
    
        await subFolder.destroy();
    
        res.status(200).json({ message: "Subfolder deleted successfully" });
      } catch (error) {
        console.log('Error in the subfolder controller', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

    res.status(200).json({ message: "Subfolder deleted successfully" });
  } catch (error) {
    console.log('Error in the subfolder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};