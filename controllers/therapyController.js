const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Therapy = require('../models/therapyModel')
const Therapeut = require('../models/therapeutModel')
const ClientEmail = require('../utils/Emails/ClientRelated')
const TherapeutEmail = require('../utils/Emails/TherapeutRelated')
const PacientEmail = require('../utils/Emails/PacientRelated')

exports.createTherapy = catchAsync(async (req, res, next) => {
    const therapeut = await Therapeut.findOne({ _id: req.params.therapeutId })
    const newTherapy = await Therapy.create({
        name: req.body.name,
        category: req.body.category,
        therapeut: req.params.therapeutId,
        pacientWhichBooked: req.user._id,
        price: req.body.price,
        appointedAt: req.body.date
    })

    if (!therapeut) {
        next(new AppError('Therapeut nicht gefunden', 404))
    }

    try {
        await new ClientEmail().therapyBooked(req.user, therapeut)
        await new TherapeutEmail().therapyBooked(req.user, therapeut)
        await new PacientEmail().therapyBooked(req.user, therapeut)
    } catch (e) {
        if (e) {
            console.log(e)
        }
    }

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