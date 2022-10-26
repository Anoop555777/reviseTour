const fs = require('fs');
const Tour = require('./../models/tourmodel');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);

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
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
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

exports.getTour = (req, res) => {
  const id = +req.params.id;

  const tour = tours[id];
  // if (!tour) res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  res.status(200).json({ status: 'success', data: { tours: tour } });
};

exports.updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<updated the tour>' } });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};
