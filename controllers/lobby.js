const Room = require('../models/room')

// API to list available rooms
exports.listRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ users: { $size: 1 } }).populate('users')
    if (!rooms.length) {
      return res.status(404).send({
        message: 'No rooms found',
        rooms: []
      })
    } else {
      return res.status(200).send({
        message: 'Available rooms',
        rooms
      })
    }
  } catch (error) {
    console.error(`Failed to list rooms - ${error.message}`)
    return res.status(500).send({ error: 'Internal Server Error' })
  }
}

// API  to create rooms
// API  to join room
