/* models/user.js */
const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    'user',
    {
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      verify_key: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
