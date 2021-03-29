const router = require('express').Router();
const signupRouter = require('./signupRouter.js');

router.use('/api/users', signupRouter);

module.exports = router;
