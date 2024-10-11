// models/projectMember.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectMember extends Model {
    static associate(models) {
      // This model represents the junction table, so no additional associations are needed
    }
  }
  ProjectMember.init({
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ProjectMember',
  });
  return ProjectMember;
};