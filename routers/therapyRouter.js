const express = require('express');
const therapyController = require('../controllers/therapyController')
const authController = require('../controllers/authController')

const router = express.Router()

// BELLOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/')
    .get(therapyController.getAllTherapies)

router.route('/cancel-therapy/:therapyId')
    .put(therapyController.cancelTherapy)

router.route('/:therapeutId')
    .post(therapyController.createTherapy)

module.exports = router