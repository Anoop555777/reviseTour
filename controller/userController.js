const catchAsync = require('./../utiles/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utiles/appError');
const factory = require('./../controller/handlerFactory');

exports.getAllUsers = factory.getAll(User);

function filterObj(obj, ...fields) {
  const returnObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) returnObj[el] = obj[el];
  });
  return returnObj;
}

exports.setId = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.getMe = factory.getOne(User);

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

exports.createUser = factory.createOne(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user._id);
  res.status(204).json({ status: 'success' });
});
