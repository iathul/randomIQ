const socketIo = require('socket.io')

function initSocket(server) {
  const io = socketIo(server)

  io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`)

    // You can define your Socket.IO event handlers here.
    // For example, handling room logic.

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
    })
  })

  return io
}

module.exports = initSocket
