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
    return queryInterface.bulkInsert('tags', [
      {
        tag_name: 'Burger',
        createdAt,
        updatedAt,
      },
      {
        tag_name: 'Pizza',
        createdAt,
        updatedAt,
      },
      {
        tag_name: 'Chicken',
        createdAt,
        updatedAt,
      },
      {
        tag_name: 'FOOOOOD',
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
    return queryInterface.bulkDelete('tags');
  },
};
