const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protectedRoutes);

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.restrict('user'),
    reviewController.putIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getSpecificReview)
  .delete(
    authController.restrict('admin', 'user'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrict('admin', 'user'),
    reviewController.updateReview
  );

module.exports = router;
