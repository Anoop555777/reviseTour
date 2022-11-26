const express = require('express');
const tourController = require('../../controller/tourController');
const authController = require('../../controller/authController');
const reviewController = require('../../controller/reviewController');
const reviewRouter = require('../reviewRouter');

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
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);

router
  .route('/')
  .get(authController.protectedRoutes, tourController.getAllTours)
  .post(
    authController.protectedRoutes,
    authController.restrict('admin', 'lead-guide'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protectedRoutes,
    authController.restrict('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protectedRoutes,
    authController.restrict('admin', 'lead-guide'),
    tourController.deleteTour
  );

router.use('/:tourid/review', reviewRouter);

module.exports = router;
