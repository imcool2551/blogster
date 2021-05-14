'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Comment.belongsTo(models.Post, {
        foreignKey: 'post_id',
        as: 'post',
      });
    }
  }
  Comment.init(
    {
      comment_text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      tableName: 'comments',
      modelName: 'Comment',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    }
  );
  return Comment;
};
