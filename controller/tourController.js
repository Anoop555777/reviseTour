const Tour = require('./../models/tourmodel');

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
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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

