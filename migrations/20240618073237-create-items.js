'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      suppliers: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      itemDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      amountClaimed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      claimAnt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateClaimed: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pvNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('Items');
  }
};
