const express = require('express');
const pacientController = require('../controllers/pacientController')
const authController = require('../controllers/authController')

const router = express.Router()

router.route('/signup')
    .post(authController.signup)
router.route('/login')
    .post(authController.login)

router.route('/forgotPassword')
    .post(authController.forgotPassword)

router.route('/resetPassword/:token')
    .post(authController.resetPassword)

router.route('/logout')
    .post(authController.logout)

// BELLOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/me')
    .get(pacientController.getLogedInPacient)

router.route('/:id')
    .get(pacientController.getOnePacient)

module.exports = router