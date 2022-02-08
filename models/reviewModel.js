// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty!']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        therapeut: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a therapeut.'],
            select: false
        },
        pacient: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a pacient'],
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.index({ therapeut: 1, pacient: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'pacient',
        select: 'firstName lastName -_id'
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (therapeutId) {
    const stats = await this.aggregate([
        {
            $match: { therapeut: therapeutId }
        },
        {
            $group: {
                _id: '$therapeut',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await User.findByIdAndUpdate(therapeutId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await User.findByIdAndUpdate(therapeutId, {
            ratingsQuantity: 0,
            ratingsAverage: 0
        });
    }
};

reviewSchema.post('save', function () {
    // this points to current review
    this.constructor.calcAverageRatings(this.therapeut);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    // console.log(this.r);
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.therapeut);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
