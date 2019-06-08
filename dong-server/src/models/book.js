const mongoose = require('mongoose')
const { Schema } = mongoose

const Author = new Schema({
  name: String,
  email: String
})

const Book = new Schema({
  title: String,
  authros: [Author],
  publishedDate: Date,
  price: Number,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Book', Book)
