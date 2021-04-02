'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Report.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Report.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post',
      });
    }
  }
  Report.init(
    {
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'reports',
      modelName: 'Report',
    }
  );
  return Report;
};
