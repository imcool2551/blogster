const router = require('express').Router();
const signupRouter = require('./signupRouter.js');
const signinRouter = require('./signinRouter');

router.use('/api/users/signup', signupRouter);
router.use('/api/users/signin', signinRouter);

module.exports = router;
