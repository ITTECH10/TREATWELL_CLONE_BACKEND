const express = require('express');
const pacientController = require('../controllers/pacientController')
const authController = require('../controllers/authController')

const router = express.Router()

router.route('/signup')
    .post(authController.signup)
router.route('/login')
    .post(authController.login)

router.route('/logout')
    .post(authController.logout)

router.route('/:id')
    .get(pacientController.getOnePacient)

module.exports = router