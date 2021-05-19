const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const client = require('../config/redisClient');

const blogPostLimiter = new RateLimit({
  store: new RedisStore({
    expiry: 1 * 60, // 1 * 60 (초)
    client,
  }),
  windowMs: 1 * 60 * 1000, // 1 * 60 * 1000 (밀리초)
  max: 1, // 1번
  handler(req, res) {
    res
      .status(429)
      .send({ errors: [{ message: '1분후에 작성할 수 있습니다' }] });
  },
});

module.exports = { blogPostLimiter };
