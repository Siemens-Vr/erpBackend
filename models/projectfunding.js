// models/projectFunding.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectFunding extends Model {
    static associate(models) {
      this.belongsTo(models.Project, { foreignKey: 'projectId' });
      this.belongsTo(models.Funder, { foreignKey: 'funderId' });
      this.hasMany(models.FundingDisbursement, { foreignKey: 'projectFundingId' });
    }
  }
  ProjectFunding.init({
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    funderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalAmountCommitted: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    amountDisbursedToDate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    remainingAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ProjectFunding',
    tableName: 'ProjectFunding'
  });
  return ProjectFunding;
};