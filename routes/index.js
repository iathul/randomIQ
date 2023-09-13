const router = require('express').Router()
const lobby = require('./lobby')
const user = require('./user')

router.use('/lobby', lobby)
router.use('/users', user)

module.exports = router
