const mongoose = require('mongoose');

const pacientSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'pacient'],
            message: '{VALUE} Position wird nicht unterstützt!'
        },
        default: 'pacient'
    },
})

const Pacient = mongoose.model('Pacient', pacientSchema)

module.exports = Pacient