// models/project.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      this.hasMany(models.Phase, { foreignKey: 'projectId' });
      this.belongsToMany(models.Member, { through: 'ProjectMembers', foreignKey: 'projectId' });
      this.hasMany(models.ProjectFunding, { foreignKey: 'projectId' });
    }
  }
  Project.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expectedCompletionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    totalBudget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};