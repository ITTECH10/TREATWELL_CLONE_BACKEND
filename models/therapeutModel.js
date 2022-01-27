const mongoose = require('mongoose');

const therapeutSchema = new mongoose.Schema({
    name: {
        type: String
    },
    specializedServices: {
        type: String
    },
    location: {
        type: String
    },
    image: {
        type: String
    },
    images: {
        type: Array
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        default: '0049-152-901820'
    },
    biography: {
        type: String
    },
    website: {
        type: String
    },
    specializedIn: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    }
})

const Therapeut = mongoose.model('Therapeut', therapeutSchema)

module.exports = Therapeut