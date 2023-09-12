const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxUsers: { type: Number, default: 2 }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Room', roomSchema)
