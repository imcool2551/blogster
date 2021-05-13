const router = require('express').Router();
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const util = require('util');
const { Op } = require('sequelize');

const client = require('../config/redisClient');
const { sendVerificationEmail } = require('../config/mail');

const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');

const validateRequest = require('../middlewares/validateRequest');
const requireAuth = require('../middlewares/requireAuth');

const { User } = require('../db/models');

jwt.verify = util.promisify(jwt.verify);
client.get = util.promisify(client.get);

/*
  POST /api/blogs

  {
    title
    tags
    content
    files
  }
*/

router.post(
  '/api/blogs',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title must not be empty'),
    body('content').trim().notEmpty().withMessage('Content must not be empty'),
    body('tags').matches(/#\w+/g).withMessage('Invalid Tag format'),
  ],
  validateRequest,
  (req, res) => {
    console.log(req.body);
    res.status(201).send('Blog Route');
  }
);

module.exports = router;
