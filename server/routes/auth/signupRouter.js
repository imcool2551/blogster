const router = require('express').Router();
const { body } = require('express-validator');
const validateRequest = require('../../middlewares/validateRequest');
const BadRequestError = require('../../errors/bad-request-error');

const User = require('../../models/user');
const { sendVerificationEmail } = require('../../config/mail');

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
    const { username, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // Build user
    User.buildUser(username, email, password)
      .then((user) => {
        // If user is created, send a verification email
        const baseUrl = `http://${req.headers.host}${req.baseUrl}`;
        return sendVerificationEmail(user, baseUrl);
      })
      .then(() => {
        // If email is sent, redirect user
        return res.redirect(303, '/api/users/signup');
      })
      .catch((err) => {
        throw err;
      });
  }
);

/*
  GET /api/users/signup

  query-string: verify_token
*/

router.get('/', (req, res) => {
  // If there is no req.query.key
  // Simply send a message that email was sent
  if (!req.query.verify_key) {
    return res.send('Email has been sent');
  }
  // If there is req.query.key
  // Find a user and send jwt
  // or throw an error
  console.log('Im executed');
  console.log(req.query);
  res.send(`You are here!`);
});

module.exports = router;
