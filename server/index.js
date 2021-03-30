const sequelize = require('./models/index').sequelize;
const app = require('./app');
const keys = require('./config/keys');

const start = () => {
  console.log(keys);

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

  try {
    sequelize.sync();
    console.log('DB Connection successful');
  } catch (err) {
    console.error('DB Connection failed', err);
  }

  app.listen(keys.nodePort, () => {
    console.log(`Server open on port ${keys.nodePort}`);
  });
};

start();
