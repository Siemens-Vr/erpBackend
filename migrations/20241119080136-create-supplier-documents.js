'use strict';
const { Sequelize, DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable(
      { schema: 'projects', tableName: 'SupplierDocuments' },
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        uuid: {
          primaryKey: true,
          allowNull: false,
          type: DataTypes.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        supplierId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: { schema: 'projects', tableName: 'Suppliers' },
            key: 'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        voucherPath: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        voucherName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        invoicePath: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        invoiceName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        approvalPath: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        approvalName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ schema: 'projects', tableName: 'SupplierDocuments' });
  },
};
