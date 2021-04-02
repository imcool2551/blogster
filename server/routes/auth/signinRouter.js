const router = require('express').Router();
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../errors/unauthorized-error');

const NotFoundError = require('../../errors/not-found-error');
const validateRequest = require('../../middlewares/validateRequest');

const { User } = require('../../db/models');

/*
  POST /api/users/signin

  {
    email
    password
  }
*/

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be 4~20 characters'),
  ],
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Password does not match');
    }

    if (!user.isVerified) {
      throw new UnauthorizedError('Email is not verified');
    }

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
        expiresIn: 30,
      }
    );

    res.status(200).json({ token: userJwt });
  }
);

module.exports = router;
