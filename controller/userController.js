const catchAsync = require('./../utiles/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utiles/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: users,
  });
});

function filterObj(obj, ...fields) {
  const returnObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) returnObj[el] = obj[el];
  });
  return returnObj;
}

exports.userMe = catchAsync(async (req, res, next) => {
  //check if body have a password field
  if (req.body.password || req.body.ConfirmPassword)
    return next(
      new AppError(
        400,
        'this is not the route to update password use updatePassword route'
      )
    );

  //filter field names

  const filterBody = filterObj(req.body, 'name', 'email');
  console.log(filterBody);
  const updateUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', data: updateUser });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is yet not defined',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is yet not defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is yet not defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is yet not defined',
  });
};
