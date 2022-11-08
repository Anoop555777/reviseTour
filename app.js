const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./router/tourRouter/tourRouter');
const userRouter = require('./router/userRouter/userRouter');
const app = express();

//Middlewares
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'failed',
    message: `can't find the route for ${res.originalUrl}`,
  });
  next();
});

module.exports = app;
