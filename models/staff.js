'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Staff.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    uuid: {
    defaultValue:DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull:false,
    unique:true
  },
  gender:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  project:{
    type:DataTypes.STRING,
    allowNull:true
  },
  idNo: {
    type: DataTypes.INTEGER,
    allowNull:false,
    unique:true
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull:true,
  },
  // employeeNumber:{
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  leaveDays:{
    type:DataTypes.INTEGER,
    allowNull:true
  }
  
  }, {
    sequelize,
    modelName: 'Staff',
  });
  return Staff;
};
