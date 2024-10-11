// migrations/YYYYMMDDHHMMSS-create-funding-disbursements.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FundingDisbursements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectFundingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProjectFunding',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      disbursementDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      phaseId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Phases',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FundingDisbursements');
  }
};
