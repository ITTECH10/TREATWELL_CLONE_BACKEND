const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')

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
