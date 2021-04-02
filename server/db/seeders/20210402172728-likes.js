'use strict';

const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert('likes', [
      {
        user_id: 4,
        post_id: 1,
        createdAt,
        updatedAt,
      },
      {
        user_id: 4,
        post_id: 2,
        createdAt,
        updatedAt,
      },
      {
        user_id: 4,
        post_id: 3,
        createdAt,
        updatedAt,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('likes');
  },
};
