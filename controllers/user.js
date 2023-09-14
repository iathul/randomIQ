const User = require('../models/user')
const jwt = require('jsonwebtoken')

// API to add User
exports.addUser = async (req, res) => {
  try {
    const userModel = new User()
    const { userName, fullName } = req.body

    const user = await userModel.getUserByUserName(userName)
    if (user) {
      return res.status(409).send({ error: 'Username already exists.' })
    }
    const newUser = await User.create({
      userName,
      fullName
    })
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '30m'
    })
    return res.status(200).send({
      message: 'User created successfully.',
      user: newUser,
      auth_token: token
    })
  } catch (error) {
    console.error(`Failed to add user - ${error.message}`)
    return res
      .status(500)
      .send({ error: 'Failed to add user. Please try again.' })
  }
}

// API to user login
exports.userLogin = async (req, res) => {
  try {
    const userModel = new User()
    const { userName } = req.body

    const user = await userModel.getUserByUserName(userName)
    if (!user) {
      return res.status(404).send({ error: 'User not found.Please login.' })
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30m'
    })
    return res.status(200).send({
      message: 'Login success.',
      user: user,
      auth_token: token
    })
  } catch (error) {
    console.error(`User login failed - ${error.message}`)
    return res
      .status(500)
      .send({ error: 'User login failed. Please try again.' })
  }
}
