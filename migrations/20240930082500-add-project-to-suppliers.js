'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Suppliers', 'project', {
      type: Sequelize.STRING, // or the data type you want
      allowNull: true, // set to false if this field should be required
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Suppliers', 'project');
  }
};
