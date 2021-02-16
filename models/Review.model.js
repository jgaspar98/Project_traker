const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const reviewSchema = new Schema({
  movieId: String,
  review: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = model('Review', reviewSchema);