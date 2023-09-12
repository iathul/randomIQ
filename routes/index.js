const router = require('express').Router()
const lobby = require('./lobby')

router.use('/lobby', lobby)

module.exports = router
