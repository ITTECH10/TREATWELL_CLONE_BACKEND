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
        therapeutsController.createTherapeut
    )

router
    .route('/therapeuts-within/distance/:distance/center/:latlng/unit/:unit')
    .get(therapeutsController.getTherapeutsWithin);

router.route('/:id')
    .get(therapeutsController.getOneTherapeut)

module.exports = router