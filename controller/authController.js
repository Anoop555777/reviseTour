const catchAsync = require('./../utiles/catchAsync');
const util = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utiles/appError');
const sendEmail = require('./../utiles/email');
const crypto = require('crypto');

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
    // you must select role in previous middleware because role are not selected in models
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'You are forbidden to delete tour'));
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  //find the user with the help of email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(400, 'sorry wrong email'));

  // generate a ramdom route token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/${resetToken}`;
  const message = `Forget your password ? don't worries you can send the patch request with a new password to  ${resetURL} if you don't forget your password then just ignore the mail`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'to have to reset password with in 10 min',

      message,
    });
    res.status(200).json({ status: 'success', message: 'Token send to email' });
  } catch (err) {
    user.passwordExpireToken = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError(
        500,
        'something want wrong in send the email please try later!'
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get the token from the forget password
  const hashtoken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashtoken,
    passwordExpireToken: { $gte: Date.now() },
  });

  // if token is not expire and user exist

  if (!user) return next(new AppError(400, 'token is invalid or expired'));

  //update password property of user
  user.password = req.body.password;
  user.passwordConfirm = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordExpireToken = undefined;
  await user.save();

  //update changePasswordProperty for the user

  //sent the jwt token
  const token = signToken(user._id);

  res.status(200).json({ status: 'success', token });
});

exports.updatepassword = catchAsync(async (req, res, next) => {
  //get user form protect method

  const user = await User.findById(req.user._id).select('password');

  //only if user password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError(401, 'enter correct password'));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({ status: 'success', token });
});
