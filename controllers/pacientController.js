const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Pacient = require('../models/pacientModel')

exports.getAllPacients = catchAsync(async (req, res, next) => { })
exports.getOnePacient = catchAsync(async (req, res, next) => { })

exports.getLogedInPacient = catchAsync(async (req, res, next) => {
    const pacient = await Pacient.findOne({ _id: req.user._id })

    if (!pacient) {
        return next(new AppError('Ihr Konto wurde nicht gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        pacient
    })
})