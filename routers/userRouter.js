const express = require('express');
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()

router.route('/signup')
    .post(authController.signup)
router.route('/login')
    .post(authController.login)

router.route('/')
    .get(userController.getAllUsers)

router.route('/forgotPassword')
    .post(authController.forgotPassword)

router.route('/resetPassword/:token')
    .post(authController.resetPassword)

router.route('/logout')
    .post(authController.logout)

// BELLOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/accept-policies')
    .get(authController.acceptPrivacyPolicy)

router.route('/me')
    .get(authController.getLogedInUser)

router.route('/:id')
    .get(userController.getOneUser)

module.exports = router