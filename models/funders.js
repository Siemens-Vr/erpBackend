// models/funder.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Funder extends Model {
    static associate(models) {
      this.hasMany(models.ProjectFunding, { foreignKey: 'funderId' });
    }
  }
  Funder.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactInformation: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Funder',
  });
  return Funder;
};