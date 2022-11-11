const express = require('express');
const tourController = require('../../controller/tourController');
const authController = require('../../controller/authController');

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
  .get(authController.protectedRoutes, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protectedRoutes,
    authController.restrict('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
