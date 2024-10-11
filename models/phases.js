// models/phase.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Phase extends Model {
    static associate(models) {
      this.belongsTo(models.Project, { foreignKey: 'projectId' });
      this.hasMany(models.Deliverable, { foreignKey: 'phaseId' });
      this.hasOne(models.PhaseBudget, { foreignKey: 'phaseId' });
      this.hasMany(models.FundingDisbursement, { foreignKey: 'phaseId' });
    }
  }
  Phase.init({
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: DataTypes.STRING,
    comments: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Phase',
  });
  return Phase;
};