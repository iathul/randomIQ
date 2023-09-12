const router = require('express').Router()
const { listRooms, createRoom } = require('../controllers/lobby')

// Route to list rooms
router.get('/rooms', listRooms)

// Route to create room
router.post('/rooms', createRoom)

module.exports = router
