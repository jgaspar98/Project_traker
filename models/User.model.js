const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema ({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required'],
    unique: true
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Username is required'],
  },
  role: String
});

module.exports = model('User', userSchema);
