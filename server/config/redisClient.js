const redis = require('redis');
const keys = require('./keys');

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
});

module.exports = client;
