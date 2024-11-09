'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryInterface.createTable(
      { schema: 'projects', tableName: 'subFolders' },
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          type: Sequelize.INTEGER
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
          allowNull: false
        },
        folderName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        folderId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: {
              schema: 'projects',
              tableName: 'Folders'
            },
            key: 'uuid'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'  // Changed from SET NULL to CASCADE
        },
        projectId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: {
              schema: 'projects',
              tableName: 'Projects'
            },
            key: 'uuid'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'  // Changed from SET NULL to CASCADE
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ schema: 'projects', tableName: 'subFolders' });
  }
};