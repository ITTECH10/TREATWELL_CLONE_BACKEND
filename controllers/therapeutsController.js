const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Therapeut = require('../models/therapeutModel')

exports.getAllTherapeuts = catchAsync(async (req, res, next) => {
    const therapeuts = await Therapeut.find()

    if (!therapeuts) {
        return next(new AppError('Keine therapeuts sind gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        therapeuts
    })
})

exports.getOneTherapeut = catchAsync(async (req, res, next) => {
    const therapeut = await Therapeut.findOne({ _id: req.params.id })

    if (!therapeut) {
        return next(new AppError('Kein therapeut gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        therapeut
    })
})

exports.createTherapeut = catchAsync(async (req, res, next) => {
    const newTherapeut = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        biography: req.body.biography,
        website: req.body.website,
        specializedIn: req.body.specializedIn,
        specializedServices: req.body.specializedServices
    })

    res.status(200).json({
        message: 'success',
        newTherapeut
    })
})