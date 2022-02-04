const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
    name: {
        type: String
    },
    category: {
        type: String
    },
    appointedAt: {
        type: Date
    },
    therapeut: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Therapie Muss einem Therapeuten gehören']
    },
    pacientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Therapie Muss einem Pacienten gehören']
    },
    price: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    }
})

// therapySchema.pre(/^find/, function (next) {
//     this.populate('pacientId', 'firstName lastName -_id')
//     next()
// })

therapySchema.pre(/^find/, function (next) {
    this.populate('therapeut', 'name image ratingsAverage location website address phone specializedIn _id')
    next()
})

const Therapy = mongoose.model('Therapy', therapySchema)

module.exports = Therapy