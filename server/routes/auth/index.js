const router = require('express').Router();
const signupRouter = require('./signupRouter.js');
const signinRouter = require('./signinRouter');
const signoutRouter = require('./signoutRouter');
const requireAuth = require('../../middlewares/requireAuth');

router.use('/api/users/signup', signupRouter);
router.use('/api/users/signin', signinRouter);
router.use('/api/users/signout', requireAuth, signoutRouter);

module.exports = router;
