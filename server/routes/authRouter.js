const router = require('express').Router();
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const util = require('util');

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
  POST /api/users/signup

  {
    username
    email
    password
  }
*/

router.post(
  '/api/users/signup',
  [
    body('username')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Username must be 4~20 characters'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be 8~20 characters'),
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
        const url = `http://${req.headers.host}${req.url}?verify_key=${user.verify_key}`;
        return sendVerificationEmail(user, url);
      })
      .then(() => {
        // If email is sent, redirect user (POST-GET-REDIRECT)
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

router.get('/api/users/signup', async (req, res) => {
  const { verify_key } = req.query;

  // REDIRECT FROM POST
  if (!verify_key) {
    return res.status(201).send('Email has been sent');
  }

  let user = await User.findOne({
    where: {
      verify_key,
    },
  });

  if (!user) {
    throw new NotFoundError('There is no user with provided verify_key');
  }

  user = await user.verifyUser();

  // Send jwt
  const token = await jwt.sign(
    {
      id: user.id,
      username: user.username,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
    },
    process.env.JWTKEY,
    {
      expiresIn: '1h',
    }
  );

  res.status(201).send(token);
});

/*
  POST /api/users/signin

  {
    username
    password
  }
*/

router.post(
  '/api/users/signin',
  [
    body('username')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Username must be 4~20 characters'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be 8~20 characters'),
  ],
  validateRequest,
  async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Password does not match');
    }

    if (!user.isVerified) {
      throw new UnauthorizedError('Account is not verified');
    }

    // Send jwt (TODO: fix expiration time)
    jwt.sign(
      {
        id: user.id,
        username: user.username,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
      process.env.JWTKEY,
      {
        expiresIn: '24h',
      },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json(token);
      }
    );
  }
);

/*
  POST /api/users/signout

  Headers: [x-access-token] || [Authorization]
*/

router.post('/api/users/signout', requireAuth, (req, res) => {
  // Serialize req.user, Calculate token's exp time
  const key = JSON.stringify(req.user);
  const seconds = req.user.exp - req.user.iat;
  // Store token in redis (blacklisted)
  client.setex(key, seconds, 'invalid');
  res.send({});
});

router.get('/api/users/currentuser', async (req, res) => {
  const token =
    req.headers['x-access-token'] || req.headers['authorization'].split(' ')[1];
  try {
    console.log(1);
    const decoded = await jwt.verify(token, process.env.JWTKEY);
    console.log(`Decoded ${decoded}`);
    console.log(2);

    const key = JSON.stringify(decoded);
    const reply = await client.get(key);
    if (reply) {
      throw new NotFoundError('Blacklisted token');
    }
    return res.status(200).send(decoded.username);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
