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

userSchema.methods = {
  getUserByUserName(userName) {
    const User = mongoose.model('User')
    return User.findOne({ userName })
  }
}

module.exports = mongoose.model('User', userSchema)
