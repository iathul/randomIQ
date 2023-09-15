// Load environment variables
require('dotenv').config()

// Import database connection
const connectDB = require('./config/db')

// Start db
connectDB()

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')

const { initSocket } = require('./socket/socket')
const io = initSocket(server)

// Serve static files from the "client" directory
app.use(express.static(path.join(__dirname, 'client')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/login.html')
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/client/login.html')
})

//Serve index.html for /lobby path
app.get('/lobby', (req, res) => {
  res.sendFile(__dirname + '/client/lobby.html')
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

server.listen(PORT, () => {
  console.log(`Server Running at PORT: ${PORT}`)
})
