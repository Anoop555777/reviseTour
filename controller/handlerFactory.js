const catchAsync = require('./../utiles/catchAsync');
const AppError = require('./../utiles/appError');
const APIFeatures = require('./../utiles/featureApi');
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const doc = await Model.findByIdAndDelete(id);
    if (!doc) next(new AppError(404, 'no doc with this ID'));

    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError(404, 'No document found with that ID'));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);
    if (populate) query.populate(populate);

    const doc = await query;

    if (!doc) {
      return next(new AppError(404, 'no doc found'));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = {};
    if (req.params.tourid) filter.tour = req.params.tourid;
    try {
      const featuresApi = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limiting()
        .pagination();

      const doc = await featuresApi.query.explain();
      res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
          doc,
        },
      });
    } catch (err) {
      res
        .status(400)
        .json({ status: 'failed', message: 'invalid failed required' });
    }
  });
