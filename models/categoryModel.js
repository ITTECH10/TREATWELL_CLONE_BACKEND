const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    therapies: {
        type: Array
    }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category