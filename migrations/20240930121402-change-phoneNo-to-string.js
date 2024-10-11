'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Facilitators', 'phoneNo', {
      type: Sequelize.STRING, // Changing phoneNo to STRING
      allowNull: false // Adjust this based on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Facilitators', 'phoneNo', {
      type: Sequelize.INTEGER, // Reverting back to INTEGER in case of rollback
      allowNull: false // Adjust this based on your previous column definition
    });
  }
};
