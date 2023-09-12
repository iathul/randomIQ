const router = require('express').Router()
const { listRooms } = require('../controllers/lobby')

// Route to list rooms
router.get('/rooms', listRooms)

module.exports = router
