'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LevelFacilitators', 'specification', {
      type: Sequelize.TEXT,
      allowNull: true, // Change to false if you don't want this column to allow null values
      defaultValue: null, // Set a default value if required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LevelFacilitators', 'specification');
  }
};
