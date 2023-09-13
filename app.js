// Load environment variables
require('dotenv').config()

// Import database connection
const connectDB = require('./config/db')

// Start db
connectDB()

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')

// Serve static files from the "client" directory
app.use(express.static(path.join(__dirname, 'client')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'))
})

// Api routes
app.use('/api', require('./routes/index'))

io.on('connection', socket => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

const PORT = process.env.PORT || 5000

http.listen(PORT, () => {
  console.log(`Server Running at PORT: ${PORT}`)
})
