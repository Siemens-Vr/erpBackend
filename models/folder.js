'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Folder extends Model {
    static associate({ Project }) {
      this.belongsTo(Project, {
        foreignKey: {
          name: 'projectId',
          allowNull: false
        },
        as: 'project',
        onDelete: 'CASCADE', // Changed from SET NULL to CASCADE to match the requirement
      });
    }
  }

  Folder.init(
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
      modelName: 'Folder',
      schema: 'projects',
      tableName: 'Folders',
      timestamps: true,
    }
  );

  return Folder;
};
