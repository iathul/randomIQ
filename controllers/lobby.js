const Room = require('../models/room')

// API to list available rooms
exports.listRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $expr: {
        $lt: [{ $size: '$users' }, 2]
      },
      status: 'open'
    }).populate('users')
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

// Create new room and add user
exports.createRoom = async (req, res) => {
  try {
    const { roomName, description } = req.body
    const room = new Room({ roomName: roomName, description: description })
    await room.save()
    return res.status(200).send({
      message: 'Room created successfully.',
      room
    })
  } catch (error) {
    console.error(`Failed to create room - ${error.message}`)
    return res
      .status(500)
      .send({ error: 'Failed to create room. Please try again.' })
  }
}

exports.getRoom = async (req, res) => {
  try {
    const { roomId } = req.params
    const room = await Room.findById(roomId).populate('users')
    if (!room) {
      return res.status(404).send({
        message: 'Room not found',
        room: {}
      })
    } else {
      return res.status(200).send({
        message: 'Room details fetched successfully.',
        room: room
      })
    }
  } catch (error) {
    console.error(`Failed to fetch room - ${error.message}`)
    return res
      .status(500)
      .send({ error: 'Failed to fetch room. Please try again.' })
  }
}
