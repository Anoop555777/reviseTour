const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./router/tourRouter/tourRouter');
const userRouter = require('./router/userRouter/userRouter');
const AppError = require('./utiles/appError');
const globalErrorHandler = require('./controller/errorController');
const app = express();

//Middlewares
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `can't find the route for this ${req.originalUrl}`));
});

app.use(globalErrorHandler);

module.exports = app;
