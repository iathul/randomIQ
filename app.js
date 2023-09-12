const express = require('express')

const app = express()

// Api routes
app.use('/api', require('./routes/index'))

const PORT = process.env.PORT || 5000
// Start server
app.listen(PORT, console.log(`Server Running at PORT: ${PORT}`))
