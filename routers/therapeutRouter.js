const express = require('express');
const therapeutsController = require('../controllers/therapeutsController')

const router = express.Router()

router.route('/')
    .get(therapeutsController.getAllTherapeuts)
    .post(therapeutsController.createTherapeut)

router.route('/:id')
    .get(therapeutsController.getOneTherapeut)

module.exports = router