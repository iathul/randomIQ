const router = require('express').Router()
const { addUser } = require('../controllers/user')

// Route add user
router.post('', addUser)

module.exports = router
