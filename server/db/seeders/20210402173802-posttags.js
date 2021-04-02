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
    return queryInterface.bulkInsert('post_tags', [
      {
        post_id: 1,
        tag_id: 1,
        createdAt,
        updatedAt,
      },
      {
        post_id: 1,
        tag_id: 4,
        createdAt,
        updatedAt,
      },
      {
        post_id: 2,
        tag_id: 2,
        createdAt,
        updatedAt,
      },
      {
        post_id: 2,
        tag_id: 4,
        createdAt,
        updatedAt,
      },
      {
        post_id: 3,
        tag_id: 3,
        createdAt,
        updatedAt,
      },
      {
        post_id: 3,
        tag_id: 4,
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
    return queryInterface.bulkDelete('post_tags');
  },
};
