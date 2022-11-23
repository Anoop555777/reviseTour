const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.protectedRoutes,
    authController.restrict('user'),
    reviewController.putIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getSpecificReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
