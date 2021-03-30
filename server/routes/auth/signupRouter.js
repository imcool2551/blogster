const router = require('express').Router();
const { body } = require('express-validator');
const bcrypt = require('bcrypt');
const { randomBytes } = require('crypto');
const validateRequest = require('../../middlewares/validateRequest');
const BadRequestError = require('../../errors/bad-request-error');

const { User } = require('../../models');

/*
  POST /api/users/signup
  {
    username
    email
    password
  }
*/

router.post(
  '/',
  [
    body('username')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Username must be 4~20 characters'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be 4~20 characters'),
  ],
  validateRequest,
  async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    // Check if user already exists
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestError('Email in use');
    }
    // generate verify_key
    const verifyKey = await bcrypt.genSalt(10);
    console.log(verifyKey);

    // Save a user to DB (+ hash password)

    // Send an email
    // (http://<req.host>:<PORT>/auth/signup?key=<key>)

    // Redirect to GET /auth/user/signup
  }
);

router.get('/', (req, res) => {
  // If there is no req.params.key
  // Simply send a message that email was sent
  // If there is req.params.key
  // Find a user and send jwt
  // or throw an error
});

module.exports = router;
