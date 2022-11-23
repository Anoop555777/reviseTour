const Review = require('./../models/reviewModel');
const factory = require('./../controller/handlerFactory');
const catchAsync = require('./../utiles/catchAsync');

exports.getAllReview = factory.getAll(Review);

exports.putIds = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourid;

  if (!req.body.user) req.body.user = req.user._id;
});

exports.createReview = factory.createOne(Review);

exports.getSpecificReview = factory.getOne(Review);

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
