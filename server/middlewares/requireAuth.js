const jwt = require('jsonwebtoken');
const util = require('util');

const client = require('../config/redisClient');
const UnauthorizedError = require('../errors/unauthorized-error');

client.get = util.promisify(client.get);
jwt.verify = util.promisify(jwt.verify);

module.exports = async (req, res, next) => {
  const token =
    req.headers['x-access-token'] || req.headers['authorization'].split(' ')[1];

  try {
    const decoded = await jwt.verify(token, process.env.JWTKEY);

    // Sereialize token for redis lookup
    const key = JSON.stringify(decoded);

    const reply = await client.get(key);
    // Redis is marking token as blacklisted
    if (reply) {
      throw new UnauthorizedError('Blacklisted token');
    }
    req.user = decoded;
  } catch (err) {
    // Token is invalid/expired
    throw err;
  }
  next();
};
