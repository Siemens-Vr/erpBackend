// models/fundingDisbursement.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FundingDisbursement extends Model {
    static associate(models) {
      this.belongsTo(models.ProjectFunding, { foreignKey: 'projectFundingId' });
      this.belongsTo(models.Phase, { foreignKey: 'phaseId' });
    }
  }
  FundingDisbursement.init({
    projectFundingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    disbursementDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    phaseId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'FundingDisbursement',
  });
  return FundingDisbursement;
};