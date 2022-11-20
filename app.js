const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./router/tourRouter/tourRouter');
const userRouter = require('./router/userRouter/userRouter');
const reviewRouter = require('./router/reviewRouter');
const AppError = require('./utiles/appError');
const globalErrorHandler = require('./controller/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const app = express();

//Global middleware
//set security http headers
app.use(helmet());

//Body parser for rate limit
app.use(express.json({ limit: '10kb' }));

//set rate limit for API
const limit = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'Too many request from IP,please try again',
});

app.use('/api', limit);

//data sanatization
app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//development api
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `can't find the route for this ${req.originalUrl}`));
});

app.use(globalErrorHandler);

module.exports = app;
