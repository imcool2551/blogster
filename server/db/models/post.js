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
        foreignKey: 'userId',
        as: 'user',
      });
      Post.belongsToMany(models.Tag, {
        through: models.PostTag,
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        as: 'comments',
      });
      Post.hasMany(models.Like, {
        foreignKey: 'postId',
        as: 'likes',
      });
      Post.hasMany(models.Report, {
        foreignKey: 'postId',
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
        type: DataTypes.STRING,
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
    }
  );
  return Post;
};
