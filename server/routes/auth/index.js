const router = require('express').Router();
const signupRouter = require('./signupRouter.js');

router.use('/api/users/signup', signupRouter);

module.exports = router;
