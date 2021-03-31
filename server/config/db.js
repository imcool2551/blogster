const Sequelize = require('sequelize');
const keys = require('./keys');

const db = new Sequelize(
  keys.mysqlDatabase,
  keys.mysqlUser,
  keys.mysqlPassword,
  {
    host: keys.mysqlHost,
    port: keys.mysqlPort,
    dialect: 'mysql',
  }
);

module.exports = db;
