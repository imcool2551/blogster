module.exports = {
  nodePort: process.env.NODEPORT,
  mysqlHost: process.env.MYSQLHOST,
  mysqlPort: process.env.MYSQLPORT,
  mysqlDatabase: process.env.MYSQLDB,
  mysqlUser: process.env.MYSQLUSER,
  mysqlPassword: process.env.MYSQLPASSWORD,
  redisHost: process.env.REDISHOST,
  redisPort: process.env.REDISPORT,
  email: process.env.EMAIL,
  emailPassword: process.env.EMAILPASSWORD,
  jwtKey: process.env.JWTKEY,
};
