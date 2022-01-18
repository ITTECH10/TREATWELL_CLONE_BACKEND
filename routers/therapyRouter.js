const express = require('express');
const therapyController = require('../controllers/therapyController')

const router = express.Router()

router.route('/')
    .post(therapyController.createTherapy)
    .get(therapyController.getAllTherapies)

module.exports = router