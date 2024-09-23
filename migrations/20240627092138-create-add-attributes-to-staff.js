'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Staffs', 'leaveDays', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

 
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Staffs', 'leaveDays');
  },
};