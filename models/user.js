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
},{
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
