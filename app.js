const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./router/tourRouter/tourRouter');
const userRouter = require('./router/userRouter/userRouter');
const app = express();

//Middlewares
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//server
app.listen(8000, () => {
  console.log('application is running in port 8000');
});
