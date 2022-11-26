const mongoose = require('mongoose');
const Tour = require('./../models/tourmodel');
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review must not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'the review must be of some tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'the review must have a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calAvgRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',

        nRanting: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingQuantity: stats[0].nRanting,
    ratingAverage: stats[0].avgRating,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calAvgRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();

  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calAvgRating(this.r.tour);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name image',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
