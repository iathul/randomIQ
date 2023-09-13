const User = require('../models/user')

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
    return res
      .status(200)
      .send({ message: 'User created successfully.', user: newUser })
  } catch (error) {
    console.error(`Failed to add user - ${error.message}`)
    return res
      .status(500)
      .send({ error: 'Failed to add user. Please try again.' })
  }
}
