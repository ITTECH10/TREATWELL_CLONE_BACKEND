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
        required: [true, 'Therapie Muss einem Therapeuten gehören']
    },
    pacientWhichBooked: {
        type: mongoose.Schema.ObjectId,
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

const Therapy = mongoose.model('Therapy', therapySchema)

module.exports = Therapy