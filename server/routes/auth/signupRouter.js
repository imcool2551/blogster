const router = require('express').Router();
const { body } = require('express-validator');
const validateRequest = require('../../middlewares/validateRequest');

/*
  POST /api/users/signup
  {
    username
    email
    password
  }
*/

router.post(
  '/signup',
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
  (req, res) => {
    res.send(req.body);
  }
);

module.exports = router;
