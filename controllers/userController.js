const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const TherapeutEmail = require('../utils/Emails/TherapeutRelated')

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    if (!users) {
        return next(new AppError('Es gibt keine results.', 404))
    }

    res.status(200).json({
        message: 'success',
        users
    })
})

exports.getOneUser = catchAsync(async (req, res, next) => { })

exports.contactTherapeutFromPopupMap = catchAsync(async (req, res, next) => {
    const pacient = await User.findById(req.user._id)
    const therapeut = await User.findById(req.params.therapeutId)

    if (!pacient) {
        return next(new AppError('Korrupte Daten, bitte melden Sie sich erneut an.', 404))
    }

    if (!therapeut) {
        return next(new AppError('Therapeut nicht gefunden', 404))
    }

    try {
        await new TherapeutEmail().contactTherapeutFromPopupMap(therapeut, req)
    } catch (err) {
        console.log(err)
    }

    res.status(200).json({
        message: 'success'
    })
})