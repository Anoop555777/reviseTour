const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);

exports.checkID = (req, res, next, val) => {
  if (+val.id > tours.length)
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });

  next();
};

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

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res
      .status(400)
      .json({ status: 'failed', message: 'Add data first to create tour' });

  next();
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newDataSet = {
    newId,
    ...req.body,
  };

  tours.push(newDataSet);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newDataSet,
        },
      });
    }
  );
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
