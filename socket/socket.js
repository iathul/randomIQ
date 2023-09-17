const socketIo = require('socket.io')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Room = require('../models/room')
const Question = require('../models/question')
const { set } = require('mongoose')

let io
let userScores = new Map()
async function getRandomQuestions() {
  try {
    const randomQuestions = await Question.aggregate([{ $sample: { size: 5 } }])

    return randomQuestions
  } catch (error) {
    console.error('Error fetching random questions:', error)
    throw error
  }
}

function determineWinner(scores) {
  let winner = null
  let highestScore = -1

  for (const [userName, score] of scores) {
    if (score > highestScore) {
      highestScore = score
      winner = userName
    }
  }
  return winner
}

function initSocket(server) {
  io = socketIo(server)

  io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`)

    socket.on('checkToken', async authToken => {
      try {
        await jwt.verify(authToken, process.env.JWT_SECRET)
      } catch (error) {
        io.emit(
          'token_expired',
          'Access token expired please login to continue.'
        )
      }
    })

    socket.on('joinRoom', async (authToken, roomId) => {
      try {
        const decoded = await jwt.verify(authToken, process.env.JWT_SECRET)
        const userId = decoded?._id
        const user = await User.findById(userId)
        const room = await Room.findById(roomId).populate('users')

        if (!user || !room) {
          io.emit('error', 'User or room not found.')
          return
        }

        const userInAnyRoom = await Room.findOne({
          users: { $in: [userId] },
          status: 'open'
        })

        if (userInAnyRoom) {
          io.emit('error', 'You have already joined a room.')
          return
        }

        if (room.users.length < room.maxUsers && !room.users.includes(userId)) {
          room.users.push(userId)
          await room.save()
          if (room.users.length === room.maxUsers) {
            const usersDetails = await Room.findById(roomId).populate('users')
            usersDetails.users.forEach(user => {
              userScores.set(user.userName, 0)
            })
            setTimeout(async () => {
              const randomQuestions = await getRandomQuestions()

              io.emit('startGame', randomQuestions)
              let currentQuestionIndex = 0
              const gameTimer = setInterval(async () => {
                if (currentQuestionIndex < randomQuestions.length) {
                  const currentQuestion = randomQuestions[currentQuestionIndex]
                  io.emit('updateQuestion', currentQuestion)
                  currentQuestionIndex++
                } else {
                  clearInterval(gameTimer)
                  const winner = determineWinner(userScores)
                  io.emit('gameEnd', {
                    winner,
                    scores: Array.from(userScores)
                  })
                  await Room.findByIdAndUpdate(roomId, {
                    $set: {
                      status: 'closed'
                    }
                  })

                }
              }, 10000)
            }, 5000)
          }

          io.emit(
            'userJoined',
            `${user.userName} has joined the room ${room.roomName}`
          )
        }
      } catch (error) {
        console.error(error)
        io.emit('token_expired', 'Token expired, please login to continue.')
      }
    })

    socket.on('submitAnswer', async (answer, roomId, userName, questionId) => {
      try {
        const question = await Question.findById(questionId)

        const isCorrect = question.correctAnswer === answer

        if (isCorrect) {
          userScores.set(userName, userScores.get(userName) + 10)
        }

        socket.emit('answerResult', Object.fromEntries(userScores.entries()))
      } catch (error) {
        console.error(error)
      }
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
    })
  })

  return io
}

module.exports = {
  initSocket,
  getIo: () => {
    if (!io) {
      throw new Error('Socket.IO has not been initialized.')
    }
    return io
  }
}
