'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Components', 'description', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Components', 'description');
  },
};
