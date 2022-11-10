const catchAsync = require('./../utiles/catchAsync');
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
  console.log(token);

  res.status(200).json({ status: 'success', token });
});
