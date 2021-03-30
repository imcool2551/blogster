const express = require('express');
require('express-async-errors');
const { json } = require('body-parser');
const app = express();

app.use(json());

const CustomError = require('./errors/custom-error');

/***** import routers *****/
const authRouter = require('./routes/auth');
/*************************/

app.use(authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: err.message || 'Somethig went wrong' }],
  });
});

module.exports = app;
