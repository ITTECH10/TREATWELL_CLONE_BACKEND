const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: [true, 'Bitte geben Sie das Passwort ein'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Bitte bestätigen Sie das Passwort']
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiresIn: {
        type: String
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'pacient', 'therapeut'],
            message: '{VALUE} Position wird nicht unterstützt!'
        },
        default: 'pacient'
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
    phone: {
        type: String
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
    },
    policiesAccepted: {
        type: Boolean,
        default: false,
        select: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// CONSIDER LATER
userSchema.virtual('therapies', {
    ref: 'Therapy',
    foreignField: 'pacientId',
    localField: '_id'
});

userSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'therapeut',
    localField: '_id'
});

// userSchema.pre(/^find/, function (next) {
//     this.populate({ path: 'therapies', select: '-_id' })
//     // this.populate({ path: 'reviews' })
//     next()
// })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined

    next()
})

userSchema.methods.comparePasswords = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
};

userSchema.methods.createPasswordResetToken = function () {
    const plainToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

    return plainToken;
};

const User = mongoose.model('User', userSchema)

module.exports = User