'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsToMany(models.Post, {
        through: models.PostTag,
        foreignKey: 'tag_id',
        as: 'posts',
      });
    }
  }
  Tag.init(
    {
      tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      tableName: 'tags',
      modelName: 'Tag',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    }
  );
  return Tag;
};
