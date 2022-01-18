const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Pacient = require('../models/pacientModel')
const createSendToken = require('../utils/signToken')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')

exports.signup = catchAsync(async (req, res, next) => {
    const newPacient = await Pacient.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    })

    res.status(201).json({
        message: 'success',
        newPacient
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email } = req.body

    if (!email) {
        return next(new AppError('Molimo vas unesite e-mail.', 400))
    }

    const pacient = await Pacient.findOne({ email })

    if (!pacient) {
        return next(new AppError('Netačan e-mail ili lozinka.', 401))
    }

    createSendToken(pacient, 200, res)
})

exports.logout = catchAsync(async (req, res, next) => {
    const cookieOptions = {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        // sameSite: 'None',
        // secure: false
        // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.sameSite = 'none'
        cookieOptions.secure = true
    }

    res.cookie('jwt', '', cookieOptions);

    res.status(200).json({
        message: 'success'
    });
})

exports.protect = catchAsync(async (req, res, next) => {
    let token
    // if (req.headers.authorization) {
    //     token = req.headers.authorization
    // }

    //FOR POSTMAN TESTING
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     token = req.headers.authorization.split(' ')[1]
    // }

    // LATER
    if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new AppError('Invalid token', 401))
    }

    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const currentPacient = await Pacient.findById(decodedToken.id)

    if (!currentPacient) {
        return next(new AppError('Benutzer, der diesem Token zugeordnet ist, existiert nicht.', 404))
    }

    req.user = currentPacient
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('Sie sind nicht berechtigt, diese Aktion auszuführen', 403)
            );
        }

        next();
    }
}