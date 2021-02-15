const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const listSchema = new Schema({
  name: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  movies: [{title:String, poster: String}] 
})

module.exports = model('List', listSchema);