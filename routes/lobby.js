const router = require('express').Router()
const { listRooms, createRoom, getRoom } = require('../controllers/lobby')

// Route to list rooms
router.get('/rooms', listRooms)

// Route to create room
router.post('/rooms', createRoom)

// Route to get room
router.get('/rooms/:roomId', getRoom)

module.exports = router
