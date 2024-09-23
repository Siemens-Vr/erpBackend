'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Levels', 'exam_dates', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Levels', 'exam_quotation_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('levels', 'exam_dates');
    await queryInterface.removeColumn('levels', 'exam_quotation_number');
  },
};