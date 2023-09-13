// Load environment variables
require('dotenv').config()

// Import database connection
const connectDB = require('./config/db')
// Start db
connectDB()

const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html')
})

// Api routes
app.use('/api', require('./routes/index'))

const PORT = process.env.PORT || 5000
// Start server
app.listen(PORT, console.log(`Server Running at PORT: ${PORT}`))
