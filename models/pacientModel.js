const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

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
            values: ['admin', 'pacient'],
            message: '{VALUE} Position wird nicht unterstützt!'
        },
        default: 'pacient'
    }
})

pacientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined

    next()
})

pacientSchema.methods.comparePasswords = async function (candidatePassword, pacientPassword) {
    return await bcrypt.compare(candidatePassword, pacientPassword)
};

pacientSchema.methods.createPasswordResetToken = function () {
    const plainToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

    return plainToken;
};


const Pacient = mongoose.model('Pacient', pacientSchema)

module.exports = Pacient