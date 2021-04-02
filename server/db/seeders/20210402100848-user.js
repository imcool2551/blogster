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
    return queryInterface.bulkInsert('users', [
      {
        username: 'John Doe',
        email: 'john@gmail.com',
        password: 'password',
        isAdmin: 1,
        isVerified: 1,
        verify_key: 'key',
        createdAt,
        updatedAt,
      },
      {
        username: 'Alex Kim',
        email: 'alex@gmail.com',
        password: 'password',
        isAdmin: 0,
        isVerified: 1,
        verify_key: 'key',
        createdAt,
        updatedAt,
      },
      {
        username: 'Paul Lee',
        email: 'paul@gmail.com',
        password: 'password',
        isAdmin: 0,
        isVerified: 1,
        verify_key: 'key',
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
    return queryInterface.bulkDelete('users');
  },
};
