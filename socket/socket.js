const socketIo = require('socket.io')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Room = require('../models/room')

let io

function initSocket(server) {
  io = socketIo(server)

  io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`)

    socket.on('checkToken', async authToken => {
      try {
        await jwt.verify(authToken, process.env.JWT_SECRET)
      } catch (error) {
        io.emit('token_expired', 'Token expired please login to continue.')
      }
    })

    socket.on('joinRoom', async (authToken, roomId) => {
      try {
        const decoded = await jwt.verify(authToken, process.env.JWT_SECRET)
        const userId = decoded
        const user = await User.findById(userId)
        const room = await Room.findById(roomId)
        room.users.push(userId)
        await room.save()

        socket.join(roomId)
        io.to(roomId).emit(
          'userJoined',
          `${user.userName} has joined the room ${room.roomName}`
        )
      } catch (error) {
        io.emit('token_expired', 'Token expired please login to continue.')
      }
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
    })
  })

  return io
}

module.exports = {
  initSocket,
  getIo: () => {
    if (!io) {
      throw new Error('Socket.IO has not been initialized.')
    }
    return io
  }
}
