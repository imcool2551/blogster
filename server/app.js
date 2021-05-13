require('express-async-errors');
const express = require('express');
const app = express();
const { json } = require('body-parser');
const cors = require('cors');

// Middlewares
app.use(json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Authorization', 'x-access-token', 'Content-Type'],
  })
);

const CustomError = require('./errors/custom-error');

/***** import routers *****/
const authRouter = require('./routes/authRouter');
const uploadRouter = require('./routes/uploadRouter');
const blogRouter = require('./routes/blogRouter');
/*************************/

app.use(authRouter);
app.use(uploadRouter);
app.use(blogRouter);

app.get('/api', (req, res) => {
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
