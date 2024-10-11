// models/phaseBudget.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PhaseBudget extends Model {
    static associate(models) {
      this.belongsTo(models.Phase, { foreignKey: 'phaseId' });
      this.hasMany(models.BudgetItem, { foreignKey: 'phaseBudgetId' });
    }
  }
  PhaseBudget.init({
    phaseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    comments: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'PhaseBudget',
  });
  return PhaseBudget;
};
