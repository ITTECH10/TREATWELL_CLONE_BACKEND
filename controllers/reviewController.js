const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Review = require('../models/reviewModel')

exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.therapeut) req.body.therapeut = req.params.therapeutId;
    if (!req.body.pacient) req.body.pacient = req.user._id;
    next();
};

exports.createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create({
        review: req.body.review,
        rating: req.body.rating,
        therapeut: req.body.therapeut,
        pacient: req.body.pacient
    })

    res.status(201).json({
        message: 'success',
        newReview
    })
})