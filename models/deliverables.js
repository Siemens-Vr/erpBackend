// models/deliverable.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Deliverable extends Model {
    static associate(models) {
      Deliverable.belongsTo(models.Phase, { foreignKey: 'phaseId' });
    }
  }
  Deliverable.init({
    phaseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comments: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Deliverable',
  });
  return Deliverable;
};