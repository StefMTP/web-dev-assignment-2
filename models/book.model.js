const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    workid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    review: String

});

let Book = module.exports = mongoose.model('Book', bookSchema);