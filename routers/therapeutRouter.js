const express = require('express');
const authController = require('../controllers/authController')
const therapeutsController = require('../controllers/therapeutsController')
const reviewRouter = require('./reviewRouter')

const router = express.Router()

router.use('/:therapeutId/reviews', reviewRouter);

router.route('/')
    .get(therapeutsController.getAllTherapeuts)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        therapeutsController.checkForFiles,
        authController.createTherapeut
    )

router.route('/update')
    .put(
        authController.protect,
        authController.restrictTo('therapeut'),
        therapeutsController.updateTherapeut
    )

router.route('/become-partner')
    .post(therapeutsController.becomePartner)

// router.route('/me')
//     .get(authController.protect, authController.getLogedInUser)

router
    .route('/therapeuts-within/distance/:distance/center/:latlng/unit/:unit')
    .get(therapeutsController.getTherapeutsWithin);

router.route('/:id')
    .get(therapeutsController.getOneTherapeut)
    .put(authController.protect, therapeutsController.updateTherapeutInfo)

module.exports = router