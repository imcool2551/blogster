/* models/user.js */
const db = require('../config/db');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { randomBytes } = require('crypto');

const BadRequestError = require('../errors/bad-request-error');

const User = db.define(
  'user',
  {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

/* 
  Static Methods
*/

// Build user with <verify_key and hasehdPassword>
User.buildUser = function (username, email, password) {
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
};

/* 
  Instance Methods
*/

User.prototype.verifyUser = async function () {
  if (this.isVerified) {
    throw new BadRequestError('User is already verified');
  }
  this.isVerified = 1;
  return this.save();
};

User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
