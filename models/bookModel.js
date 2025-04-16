const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    name: {type: String, required:true, unique: true},
    genre: {type: String, required:true},
    authorId: {type: String, required:true}
}, {
    timestamps: true
})

const bookModel = new mongoose.model('books', BookSchema)
module.exports = bookModel