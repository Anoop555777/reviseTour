const Tour = require('./../models/tourmodel');
const catchAsync = require('./../utiles/catchAsync');
const factory = require('./../controller/handlerFactory');
const AppError = require('./../utiles/appError');
//{
// only to check middleware but now in our data base schema we have validation so  no use of this
// exports.checkID = (req, res, next, val) => {
//   if (+val.id > tours.length)
//     return res.status(404).json({ status: 'failed', message: 'Invalid ID' });

//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price)
//     return res
//       .status(400)
//       .json({ status: 'failed', message: 'Add data first to create tour' });

//   next();
// };

//}

//route handlers

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price';
  req.query.field = 'name,price,duration,difficulty';

  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.createTour = factory.createOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews', select: '-__v' });
exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        averageRating: { $avg: '$ratingAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        numberOfRatings: { $sum: '$ratingAverage' },
        numOfTour: { $sum: 1 },
      },
    },
    {
      $sort: { averagePrice: 1 },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyTour = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        noOfToursStart: { $sum: 1 },
        ToursName: { $push: '$name' },
      },
    },
    {
      $sort: {
        noOfToursStart: -1,
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    return next(new AppError(400, 'please provide latitude and longitude'));

  const tour = await Tour.find({});
});
