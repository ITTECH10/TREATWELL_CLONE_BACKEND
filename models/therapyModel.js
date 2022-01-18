const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
    name: {
        type: String
    },
    category: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Therapie Muss eine Kategorie haben']
    },
    therapeut: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Therapie Muss einem Therapeuten gehören']
    },
    price: {
        type: String
    },
    available: {
        type: Boolean
    }
})

const Therapy = mongoose.model('Therapy', therapySchema)

module.exports = Therapy