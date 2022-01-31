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
        ref: 'Therapeut',
        required: [true, 'Therapie Muss einem Therapeuten gehören']
    },
    pacientWhichBooked: {
        type: mongoose.Schema.ObjectId,
        ref: 'Pacient',
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
//     this.populate('pacientWhichBooked', 'firstName lastName -_id')
//     next()
// })

therapySchema.pre(/^find/, function (next) {
    this.populate('therapeut', 'name image ratingsAverage location website address phone specializedIn _id')
    next()
})

const Therapy = mongoose.model('Therapy', therapySchema)

module.exports = Therapy