'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Post.belongsToMany(models.Tag, {
        through: models.PostTag,
        foreignKey: 'post_id',
        as: 'tags',
      });
      Post.hasMany(models.Image, {
        foreignKey: 'post_id',
        as: 'images',
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'post_id',
        as: 'comments',
      });
      Post.hasMany(models.Like, {
        foreignKey: 'post_id',
        as: 'likes',
      });
      Post.hasMany(models.Report, {
        foreignKey: 'post_id',
        as: 'reports',
      });
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      tableName: 'posts',
      modelName: 'Post',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    }
  );
  return Post;
};
