// migrations/YYYYMMDDHHMMSS-create-budget-items.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BudgetItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      phaseBudgetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PhaseBudgets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      estimatedAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      actualAmount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      supplierName: {
        type: Sequelize.STRING
      },
      purchaseDate: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('BudgetItems');
  }
};