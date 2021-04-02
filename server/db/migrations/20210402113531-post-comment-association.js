'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('comments', 'post_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'posts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('comments', 'post_id');
  },
};
