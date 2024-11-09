'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StaffDocument extends Model {
    static associate({ Staff }) {
      this.belongsTo(Staff, {
        foreignKey: 'staffId',
        as: 'staffDocument',
      });
    }
  }

  StaffDocument.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    // staffId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'Staff',
    //     key: 'uuid',
    //   },
    // },
    documentPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'StaffDocument',
    schema: 'students',
  });

  return StaffDocument;
};
