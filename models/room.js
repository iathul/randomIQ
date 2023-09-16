const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxUsers: { type: Number, default: 2 },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Room', roomSchema)
