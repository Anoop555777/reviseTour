const express = require('express');
const tourController = require('../../controller/tourController');

const router = express.Router();

//only to check middleware
// router.param('/:id', tourController.checkID);
router.route(
  '/top-5-cheap',
  tourController.aliasTopTour,
  tourController.getAllTours
);

router.route('/getMonthlyTour/:year').get(tourController.getMonthlyTour);

router.route('/getToursStats').get(tourController.getToursStats);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
