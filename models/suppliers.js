'use strict';
const { Sequelize, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      // define association here, for example:
      // Supplier.hasMany(models.Order, { foreignKey: 'supplierId' });
    }
  }

  Supplier.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        unique: true, 
      },
      uuid: {
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      suppliers: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemDescription: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amountClaimed: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        //unique: true, 
        validate: {
          isFloat: true, 
        },
      },
      approver: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateTakenToApprover: {
        type: DataTypes.DATE, 
        allowNull: false,
      },
      dateTakenToFinance: { 
        type: DataTypes.DATE, 
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PvNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      claimNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accounted: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateAccounted: {
        type: DataTypes.DATE, 
        allowNull: true,
      },
      project:{
        type:DataTypes.STRING,
        allowNull:true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, 
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Supplier',
    }
  );

  return Supplier;
};
