'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Sequelize, DataTypes}  =  require('sequelize')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryInterface.createTable({schema: 'equipments', tableName: 'Notifications' }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        // primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        allowNull: true,
        type: DataTypes.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      message: {
        type: Sequelize.TEXT
      },
      isRead: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({schema: 'equipments', tableName: 'Notifications' });
  }
};