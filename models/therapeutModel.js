const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String
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
    specializedServices: {
        type: String
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User