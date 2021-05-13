const { sequelize } = require('./db/models');
const app = require('./app');

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB Connection successful');
    // Create redisClient
    require('./config/redisClient');
    console.log('Redis Connection successful');
  } catch (err) {
    console.error('DB Connection failed', err);
  }

  app.listen(process.env.NODEPORT, () => {
    console.log(`Server open on port ${process.env.NODEPORT}`);
  });
};

start();
