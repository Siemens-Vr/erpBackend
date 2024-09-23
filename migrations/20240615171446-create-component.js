'use strict';
/** @type {import('sequelize-cli').Migration} */

const {Sequelize, DataTypes}  =  require('sequelize')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryInterface.createTable('Components', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique:true,
        type: Sequelize.INTEGER
      },
      uuid: {
        allowNull: true,
        type: DataTypes.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,

      },
      componentName: {
        type: Sequelize.STRING,
        allowNull:false,

      },
      componentType: {
        type: Sequelize.STRING,
        allowNull:false,

      },
      partNumber: {
        type: Sequelize.STRING,
        allowNull:true,
        unique:true

      },
      borrowedQuantity: {
        type: Sequelize.INTEGER,
        allowNull:true,

      },
      totalQuantity: {
        type: Sequelize.INTEGER,
        allowNull:true,

      },
      remainingQuantity: {
        type: Sequelize.INTEGER,
        allowNull:true,

      },
      status:{
        type:Sequelize.BOOLEAN,
        allowNull:false
        
      },
      condition:{
        type:Sequelize.BOOLEAN,
        allowNull:false
  
      },
      conditionDetails:{
        type:Sequelize.TEXT,
        allowNull:true
  
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
    await queryInterface.dropTable('Components');
  }
};