const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Pacient = require('../models/pacientModel')
const PacientEmail = require('../utils/Emails/PacientRelated')
const createSendToken = require('../utils/signToken')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

exports.signup = catchAsync(async (req, res, next) => {
    const newPacient = await Pacient.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    res.status(201).json({
        message: 'success',
        newPacient
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Molimo vas unesite e-mail i password.', 400))
    }

    const pacient = await Pacient.findOne({ email }).select('+password')

    if (!pacient || !await pacient.comparePasswords(password, pacient.password)) {
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const pacient = await Pacient.findOne({ email: req.body.email })

    if (!pacient) {
        return next(new AppError('Dieser E-Mail-Adresse ist kein Patient zugeordnet.', 404))
    }

    const resetToken = pacient.createPasswordResetToken()
    const resetURL = `${req.protocol}://localhost:3000/resetPassword/${resetToken}`;
    // const resetURL = `https://treatwell-clone.vercel.app/resetPassword/${resetToken}`

    await pacient.save({ validateBeforeSave: false })

    try {
        // SEND EMAIL HERE
        await new PacientEmail().resetPassword(pacient, resetURL)

        res.status(200).json({
            message: 'success'
        })

    } catch (err) {
        pacient.passwordResetToken = undefined;
        pacient.passwordResetTokenExpiresIn = undefined;
        await pacient.save({ validateBeforeSave: false })

        return next(new AppError('Beim Senden der E-Mail ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const encryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const pacient = await Pacient.findOne({
        passwordResetToken: encryptedToken,
        passwordResetTokenExpiresIn: { $gt: Date.now() }
    });

    if (!pacient) {
        return next(new AppError('Das Token ist abgelaufen oder ungültig.', 400));
    }

    pacient.password = req.body.password;
    pacient.confirmPassword = req.body.confirmPassword;
    pacient.passwordResetToken = undefined;
    pacient.passwordResetTokenExpiresIn = undefined;

    await pacient.save({ validateBeforeSave: false });

    createSendToken(pacient, 200, res)
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get employee from collection
    const employee = await Employee.findById(req.user._id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await employee.comparePasswords(req.body.currentPassword, employee.password))) {
        return next(new AppError('Vaša trenutna lozinka je netačna.', 401));
    }

    // 3) If so, update password
    employee.password = req.body.password;
    await employee.save();

    // 4) Log user in, send JWT
    createSendToken(employee, 200, res);
});