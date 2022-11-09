const AppError = require('./../utiles/appError');
const sendErrorDev = (res, err) => {
  res
    .status(err.statusCode)
    .json({ status: err.status, message: err.message, err, stack: err.stack });
};
const sendErrorProv = (res, err) => {
  if (err.isOperational)
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  else {
    console.log('ERROR 💥', err);
    res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
};

const handleCastError = (err) => {
  const message = `Invalid Id ${err.path}  ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateError = (err) => {
  const value = err.keyValue.name;

  return new AppError(
    400,
    `Duplicate field value ${value} please use another value`
  );
};

function handleValidationErrorDB(err) {
  const error = Object.values(err.errors).map((val) => val.message);
  return new AppError(400, `invalid inputFields ${error.join('. ')}`);
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastError(error);

    if (err.code === 11000) error = handleDuplicateError(error);

    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    sendErrorProv(res, error);
  }
};
