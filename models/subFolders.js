'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SubFolder extends Model {
    static associate({ Project, Folder,Document }) {
      // Define association to Project model
      this.belongsTo(Project, {
        foreignKey: {
          name: 'projectId',
          allowNull: false
        },
        as: 'project',
        onDelete: 'CASCADE'
      });
      this.belongsTo(Folder, {
        foreignKey: {
          name: 'folderId',
          allowNull: false
        },
        as: 'parentFolder',
        onDelete: 'CASCADE'
      });
      this.hasMany(Document, {
        foreignKey: 'subFolderId',
        as: 'documents',
        onDelete: 'CASCADE',
      });

    }
  }

  SubFolder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      folderName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      folderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Folders'
          },
          key: 'uuid'
        }
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Projects'
          },
          key: 'uuid'
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SubFolder',
      schema: 'projects',
      tableName: 'subFolders',
      timestamps: true,
    }
  );

  return SubFolder;
};