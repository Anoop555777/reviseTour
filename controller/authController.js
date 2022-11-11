const catchAsync = require('./../utiles/catchAsync');
const util = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utiles/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);

  res.status(201).json({ status: 'success', data: newUser, token });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1 check if the email and password exist
  if (!email || !password)
    return next(new AppError(400, 'enter both email and password'));

  //2 check is user exist and the password is correct

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError(401, 'enter correct email and password'));

  //3 generate the token

  const token = signToken(user._id);

  res.status(200).json({ status: 'success', token });
});

exports.protectedRoutes = catchAsync(async (req, res, next) => {
  let token;
  //1)take the token and check if the token exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError(401, 'First please logIn'));

  //2 verification of the this token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //3 check if user is still exists
  const freshUser = await User.findById(decoded.id).select('+role');

  if (!freshUser)
    return new AppError(401, "Token belong to the user don't exist anymore");

  //4 check if the user have changed the password after logIn

  if (freshUser.changePasswordAfter(decoded.iat))
    return new AppError(401, 'user have change the password logIn again');

  //next will grant excess to private routes
  req.user = freshUser;
  next();
});
exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'You are forbidden to delete tour'));
    }

    next();
  };
};
