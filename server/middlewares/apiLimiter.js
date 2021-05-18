const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const client = require('../config/redisClient');

const apiLimiter = (minutes, max, message) =>
  new RateLimit({
    store: new RedisStore({
      expiry: minutes * 60, // minutes * 60 (초)
      client,
    }),
    windowMs: minutes * 60 * 1000, // minutes * 60 * 1000 (밀리초)
    max,
    message,
  });

module.exports = apiLimiter;
