'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('images', 'post_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'posts',
        },
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('images', 'post_id');
  },
};
