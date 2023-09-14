const router = require('express').Router()
const { addUser, userLogin } = require('../controllers/user')

// Route add user
router.post('/register', addUser)
router.post('/login', userLogin)

module.exports = router
