const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const PacientEmail = require('../utils/Emails/PacientRelated')
const TherapeutEmail = require('../utils/Emails/TherapeutRelated')
const createSendToken = require('../utils/signToken')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    createSendToken(newUser, 201, res)
})

exports.createTherapeut = catchAsync(async (req, res, next) => {
    const newTherapeut = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: 'therapeut',
        age: req.body.age,
        availableBookingDates: req.body.availableBookingDates,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        phone: req.body.phone,
        address: req.body.address,
        qualifications: req.body.qualifications,
        biography: req.body.biography,
        website: req.body.website,
        specializedIn: req.body.specializedIn,
        specializedServices: req.body.specializedServices,
        specializedMethods: req.body.specializedMethods,
        location: req.body.location,
        image: req.files && req.files.image ? req.files.image : req.body.image,
        images: req.files && req.files.bulk ? req.files.bulk : req.body.bulk,
        locationCoordinates: {
            coordinates: [req.body.longitude, req.body.latitude]
        }
    })

    try {
        await new TherapeutEmail().welcomeGreetings(newTherapeut, req.body.password)
    } catch (err) {
        if (err) console.log(err)
    }

    res.status(201).json({
        message: 'success',
        newTherapeut
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Molimo vas unesite e-mail i password.', 400))
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !await user.comparePasswords(password, user.password)) {
        return next(new AppError('Netačan e-mail ili lozinka.', 401))
    }

    createSendToken(user, 200, res)
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
    const currentUser = await User.findById(decodedToken.id)

    if (!currentUser) {
        return next(new AppError('Benutzer, der diesem Token zugeordnet ist, existiert nicht.', 404))
    }

    req.user = currentUser
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
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('Dieser E-Mail-Adresse ist kein Patient zugeordnet.', 404))
    }

    const resetToken = user.createPasswordResetToken()
    // const resetURL = `${req.protocol}://localhost:3000/resetPassword/${resetToken}`;
    const resetURL = `https://treatwell-clone.vercel.app/resetPassword/${resetToken}`

    await user.save({ validateBeforeSave: false })

    try {
        // SEND EMAIL HERE
        // await new PacientEmail().resetPassword(user, resetURL)

        res.status(200).json({
            message: 'success'
        })

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresIn = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new AppError('Beim Senden der E-Mail ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const encryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: encryptedToken,
        passwordResetTokenExpiresIn: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Das Token ist abgelaufen oder ungültig.', 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;

    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res)
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

exports.getLogedInUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).select('+policiesAccepted')
        // .populate('reviews', 'rating review pacient -therapeut')
        .populate('therapies', 'therapeut appointedAt -pacientId')

    if (!user) {
        return next(new AppError('Ihr Konto wurde nicht gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        user
    })
})

exports.acceptPrivacyPolicy = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+policiesAccepted')

    if (!user) {
        return next(new AppError('User nicht gefunden...', 404))
    }

    user.policiesAccepted = true

    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        message: 'success',
        user
    })
})