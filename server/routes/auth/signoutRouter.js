const router = require('express').Router();
const client = require('../../config/redisClient');

/*
  POST /api/users/signout

  Headers: [x-access-token] || [Authorization]
*/

router.post('/', (req, res) => {
  // Serialize req.user, Calculate token's exp time
  const key = JSON.stringify(req.user);
  const seconds = req.user.exp - req.user.iat;
  // Store token in redis (blacklisted)
  client.setex(key, seconds, 'invalid');
  res.send({});
});

module.exports = router;
