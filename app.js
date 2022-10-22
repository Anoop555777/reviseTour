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

module.exports = app;
