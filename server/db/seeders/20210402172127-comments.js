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
    return queryInterface.bulkInsert('comments', [
      {
        comment_text: 'Big Mac',
        post_id: '1',
        user_id: '2',
        createdAt,
        updatedAt,
      },
      {
        comment_text: 'KFC',
        post_id: '1',
        user_id: '3',
        createdAt,
        updatedAt,
      },
      {
        comment_text: 'Pizza School',
        post_id: '2',
        user_id: '1',
        createdAt,
        updatedAt,
      },
      {
        comment_text: 'Pizza Hut',
        post_id: '2',
        user_id: '3',
        createdAt,
        updatedAt,
      },
      {
        comment_text: 'BBQ',
        post_id: '3',
        user_id: '1',
        createdAt,
        updatedAt,
      },
      {
        comment_text: 'Gyo Chon',
        post_id: '3',
        user_id: '2',
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
    return queryInterface.bulkDelete('comments');
  },
};
