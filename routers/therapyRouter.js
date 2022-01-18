const express = require('express');
const therapyController = require('../controllers/therapyController')
const authController = require('../controllers/authController')

const router = express.Router()

// BELLOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/')
    .post(therapyController.createTherapy)
    .get(therapyController.getAllTherapies)

module.exports = router