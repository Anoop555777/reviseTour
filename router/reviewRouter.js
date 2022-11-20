const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.protectedRoutes,
    authController.restrict('user'),
    reviewController.createReview
  );

module.exports = router;
