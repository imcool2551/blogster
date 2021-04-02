'use strict';
const bcrypt = require('bcrypt');
const { randomBytes } = require('crypto');
const BadRequestError = require('../../errors/bad-request-error');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts',
      });
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments',
      });
      User.hasMany(models.Like, {
        foreignKey: 'userId',
        as: 'likes',
      });
      User.hasMany(models.Report, {
        foreignKey: 'userId',
        as: 'reports',
      });
    }

    static buildUser(username, email, password) {
      const generateKey = new Promise((resolve, reject) => {
        randomBytes(8, (err, buf) => {
          if (err) {
            reject(err);
          }
          const key = buf.toString('base64');
          console.log('key', key);
          resolve(key);
        });
      });

      const hashPassword = new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            reject(err);
          }
          resolve(hash);
        });
      });

      return Promise.all([generateKey, hashPassword])
        .then((values) => {
          const [verify_key, hashedPassword] = values;
          const user = this.create({
            username,
            email,
            password: hashedPassword,
            verify_key,
          });
          return user;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    async verifyUser() {
      if (this.isVerified) {
        throw new BadRequestError('User is already verified');
      }
      this.isVerified = 1;
      return this.save();
    }

    async comparePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        set(value) {
          this.setDataValue('isVerified', value);
        },
      },
      verify_key: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    }
  );
  return User;
};
