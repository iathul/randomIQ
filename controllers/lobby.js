const { request } = require('express')
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

// Create new room and add user
exports.createRoom = async (req, res) => {
  try {
    const { roomName, userId } = request.body
    const room = new Room({ roomName: roomName })
    room.users.push(userId)
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

// API  to join room
