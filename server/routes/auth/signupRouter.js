const router = require('express').Router();
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');

const BadRequestError = require('../../errors/bad-request-error');
const NotFoundError = require('../../errors/not-found-error');
const validateRequest = require('../../middlewares/validateRequest');
const { sendVerificationEmail } = require('../../config/mail');

const User = require('../../models/user');

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

  query-string: verify_key
*/

router.get('/', async (req, res) => {
  const { verify_key } = req.query;

  // User is redirected
  if (!verify_key) {
    return res.send('Email has been sent');
  }

  const user = await User.findOne({
    where: {
      verify_key,
    },
  });

  if (!user) {
    throw new NotFoundError('There is no user with provided verify_key');
  }

  await user.verifyUser();

  // Send jwt
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
    },
    process.env.JWTKEY,
    {
      expiresIn: '1h',
    }
  );

  res.status(201).send(userJwt);
});

module.exports = router;
