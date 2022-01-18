const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Therapy = require('../models/therapyModel')

exports.createTherapy = catchAsync(async (req, res, next) => {
    const newTherapy = await Therapy.create({
        name: req.body.name,
        category: req.body.category,
        therapeut: req.body.therapeut,
        price: req.body.price
    })

    res.status(201).json({
        message: 'success',
        newTherapy
    })
})

exports.getAllTherapies = catchAsync(async (req, res, next) => {
    const therapies = await Therapy.find()

    if (!therapies) {
        return next(new AppError('Es wurden keine Therapien gefunden', 404))
    }

    res.status(200).json({
        message: 'success',
        therapies
    })
})