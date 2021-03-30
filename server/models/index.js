'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const keys = require('../config/keys');
const db = {};

let sequelize = new Sequelize(
  keys.mysqlDatabase,
  keys.mysqlUser,
  keys.mysqlPassword,
  {
    host: keys.mysqlHost,
    port: keys.mysqlPort,
    dialect: 'mysql',
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* Load Models */
db.User = require('./user')(sequelize, Sequelize);
/* *************/

module.exports = db;
