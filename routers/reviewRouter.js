const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .post(
        authController.restrictTo('pacient'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

module.exports = router;
