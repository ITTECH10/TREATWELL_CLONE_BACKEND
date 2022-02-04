const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const therapeutSchema = new mongoose.Schema({
    isTherapeut: {
        type: Boolean,
        default: true,
        select: false
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    age: {
        type: Number
    },
    specializedServices: {
        type: String
    },
    location: {
        type: String
    },
    locationCoordinates: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
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
    password: {
        type: String,
        required: [true, 'Bitte geben Sie das Passwort ein'],
        select: false
    },
    phone: {
        type: String,
        default: '0049-152-901820'
    },
    address: {
        type: String
    },
    biography: {
        type: String
    },
    qualifications: {
        type: String
    },
    website: {
        type: String
    },
    specializedIn: {
        type: String
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    ratingsAverage: {
        type: Number,
        default: 1,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    available: {
        type: Boolean,
        default: true
    },
    availableBookingDates: {
        type: Array
    }
})

therapeutSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)

    next()
})

therapeutSchema.methods.comparePasswords = async function (candidatePassword, therapeutPassword) {
    return await bcrypt.compare(candidatePassword, therapeutPassword)
};

const Therapeut = mongoose.model('Therapeut', therapeutSchema)

module.exports = Therapeut