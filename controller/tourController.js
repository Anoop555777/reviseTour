const Tour = require('./../models/tourmodel');
const APIFeatures = require('./../utiles/featureApi');
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

const catchAsync = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch((err) => next(err));
  };
};

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price';
  req.query.field = 'name,price,duration,difficulty';

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const featuresApi = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limiting()
      .pagination();

    const tours = await featuresApi.query;
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'failed', message: 'invalid failed required' });
  }
};

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.getTour = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findById(id);
    // it is equal to Tour.find({_id: id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'failed', message: 'invalid failed required' });
  }
};

exports.updateTour = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'failed', message: 'invalid failed required' });
  }
};

exports.deleteTour = async (req, res) => {
  const id = req.params.id;

  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'failed', message: 'invalid failed required' });
  }
};

exports.getToursStats = async (req, res) => {
  try {
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
  } catch (err) {
    res
      .status(400)
      .json({ status: 'failed', message: 'invalid failed required' });
  }
};

exports.getMonthlyTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'invalid failed required',
      err: err.message,
    });
  }
};
