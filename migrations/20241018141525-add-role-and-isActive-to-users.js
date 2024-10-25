'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'role' column
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'student', 'equipment'),
      allowNull: false,
      defaultValue: 'student',
    });

    // Add 'isActive' column
    await queryInterface.addColumn('Users', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'role' column
    await queryInterface.removeColumn('Users', 'role');

    // Remove 'isActive' column
    await queryInterface.removeColumn('Users', 'isActive');
  }
};
