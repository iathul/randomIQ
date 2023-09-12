const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true
  },
  fullName: {
    type: String,
    default: '--'
  }
})

module.exports = mongoose.model('User', userSchema)
