const jwt = require('jsonwebtoken');
const client = require('../config/redisClient');
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const verifyAsync = promisify(jwt.verify);
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = async (req, res, next) => {
  const token =
    req.headers['x-access-token'] || req.headers['authorization'].split(' ')[1];

  try {
    const decoded = await verifyAsync(token, process.env.JWTKEY);

    // Sereialize token for redis lookup
    const key = JSON.stringify(decoded);

    const reply = await getAsync(key);
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
