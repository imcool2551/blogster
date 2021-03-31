const db = require('./config/db');
const app = require('./app');
const keys = require('./config/keys');

const start = () => {
  if (!keys.nodePort) {
    throw new Error('Node Port must be defined');
  }

  if (!keys.mysqlHost) {
    throw new Error('MySQL Host must be defined');
  }

  if (!keys.mysqlPort) {
    throw new Error('MySQL Port must be defined');
  }

  if (!keys.mysqlDatabase) {
    throw new Error('MySQL Database must be defined');
  }

  if (!keys.mysqlUser) {
    throw new Error('MYSQL User must be defined');
  }

  if (!keys.mysqlPassword) {
    throw new Error('MySQL Password must be defined');
  }

  if (!keys.redisHost) {
    throw new Error('Redis Host must be defined');
  }

  if (!keys.redisPort) {
    throw new Error('Redis Port must be defined');
  }

  if (!keys.email) {
    throw new Error('Email must be defined');
  }

  if (!keys.emailPassword) {
    throw new Error('Email Password must be defined');
  }

  if (!keys.jwtKey) {
    throw new Error('JWT Key must be defined');
  }

  try {
    db.sync();
    console.log('DB Connection successful');
    // Create redisClient
    require('./config/redisClient');
    console.log('Redis Connection successful');
  } catch (err) {
    console.error('DB Connection failed', err);
  }

  app.listen(keys.nodePort, () => {
    console.log(`Server open on port ${keys.nodePort}`);
  });
};

start();
