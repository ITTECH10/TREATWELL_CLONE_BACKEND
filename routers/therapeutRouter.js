const express = require('express');
const authController = require('../controllers/authController')
const therapeutsController = require('../controllers/therapeutsController')

const router = express.Router()

router.route('/')
    .get(therapeutsController.getAllTherapeuts)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        therapeutsController.checkForFiles,
        therapeutsController.createTherapeut
    )

router.route('/:id')
    .get(therapeutsController.getOneTherapeut)

module.exports = router