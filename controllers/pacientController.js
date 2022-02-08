const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')

exports.getAllPacients = catchAsync(async (req, res, next) => {
    const pacients = await User.find({ role: 'pacient' })

    if (!pacients) {
        return next(new AppError('Es wurden keine pacienten gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        pacients
    })
})

exports.getOnePacient = catchAsync(async (req, res, next) => { })