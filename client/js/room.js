document.addEventListener('DOMContentLoaded', async () => {
  const socket = io()
  checkAuthenticated()

  const roomTitle = document.querySelector('.room-title')
  const roomDescription = document.querySelector('.room-description')
  const userList = document.getElementById('user-list')
  const joinButton = document.getElementById('join-button')
  const toastContainer = document.querySelector('.toast-container')
  const errorAlert = document.getElementById('error-message')
  const logoutButton = document.getElementById('logout-button')

  const questionContainer = document.querySelector('.question-container')
  const questionText = document.querySelector('.question-text')
  const optionsList = document.querySelector('.options-list')
  const answerButton = document.querySelector('.answer-button')

  let currentQuestionIndex = 0
  let currentQuestions = []

  function renderUserList(users) {
    userList.innerHTML = ''

    users.forEach(user => {
      const listItem = document.createElement('li')
      listItem.className = 'list-group-item'

      const username = document.createElement('span')
      username.textContent = user.userName

      listItem.appendChild(username)

      userList.appendChild(listItem)
    })
  }

  function showToast(message) {
    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'assertive')
    toast.setAttribute('aria-atomic', 'true')

    const toastHeader = document.createElement('div')
    toastHeader.className = 'toast-header'
    const toastTitle = document.createElement('strong')
    toastTitle.className = 'me-auto'
    toastTitle.textContent = 'Notification'
    const closeButton = document.createElement('button')
    closeButton.className = 'btn-close'
    closeButton.setAttribute('data-bs-dismiss', 'toast')

    toastHeader.appendChild(toastTitle)
    toastHeader.appendChild(closeButton)

    const toastBody = document.createElement('div')
    toastBody.className = 'toast-body'
    toastBody.textContent = message

    toast.appendChild(toastHeader)
    toast.appendChild(toastBody)

    toastContainer.appendChild(toast)

    const toastInstance = new bootstrap.Toast(toast)
    toastInstance.show()
  }

  function renderQuestion(question) {
    console.log('render')
    questionText.textContent = question.questionText
    optionsList.innerHTML = ''

    question.options.forEach((option, index) => {
      const listItem = document.createElement('li')
      listItem.className = 'list-group-item'

      const optionLabel = document.createElement('label')
      optionLabel.textContent = option

      const radioInput = document.createElement('input')
      radioInput.type = 'radio'
      radioInput.name = 'answer'
      radioInput.value = option
      radioInput.setAttribute('question-id', question._id)

      optionLabel.appendChild(radioInput)
      listItem.appendChild(optionLabel)

      optionsList.appendChild(listItem)
    })
  }

  async function checkUserInRoom(roomId) {
    try {
      const response = await fetch(`/api/lobby/rooms/${roomId}`)
      const roomData = await response.json()
      const authUser = JSON.parse(localStorage.getItem('user'))

      let isJoined = roomData.room.users.find(user => {
        return user.userName === authUser.userName
      })

      if (isJoined) {
        joinButton.style.display = 'none'
      } else {
        joinButton.style.display = 'block'
      }
    } catch (error) {
      console.error('Error checking room membership:', error)
    }
  }

  joinButton.addEventListener('click', async () => {
    const authToken = localStorage.getItem('authToken')
    const urlParams = new URLSearchParams(window.location.search)
    const roomId = urlParams.get('roomId')

    if (joinButton.style.display !== 'none') {
      socket.emit('joinRoom', authToken, roomId)
    }
  })

  async function getRoomDetails(roomId) {
    try {
      const response = await fetch(`/api/lobby/rooms/${roomId}`)
      const roomData = await response.json()

      roomTitle.textContent = roomData?.room?.roomName
      roomDescription.textContent = `Description: ${roomData?.room?.description}`

      renderUserList(roomData?.room?.users)
    } catch (error) {
      console.error('Error fetching room details:', error)
    }
  }

  async function updateUserList(roomId) {
    try {
      const response = await fetch(`/api/lobby/rooms/${roomId}`)
      const roomData = await response.json()

      renderUserList(roomData.room.users)
    } catch (error) {
      console.error('Error updating user list:', error)
    }
  }

  const urlParams = new URLSearchParams(window.location.search)
  const roomId = urlParams.get('roomId')

  // Add a click event listener to the logout button
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    window.location.href = '/login.html'
  })

  answerButton.addEventListener('click', () => {
    const selectedOption = document.querySelector(
      'input[name="answer"]:checked'
    )
    const questionId = selectedOption.getAttribute('question-id')
    if (selectedOption) {
      const user = JSON.parse(localStorage.getItem('user'))
      const answer = selectedOption.value
      socket.emit('submitAnswer', answer, roomId, user.userName, questionId)
    }
  })

  socket.on('userJoined', message => {
    console.log(message)
    showToast(message)
    getRoomDetails(roomId)
    updateUserList(roomId)
    checkUserInRoom(roomId)
  })

  if (roomId) {
    getRoomDetails(roomId)
    checkUserInRoom(roomId)
  }

  function checkAuthenticated() {
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      console.error('User is not authenticated.')
      window.location.href = '/login.html'
    } else {
      socket.emit('checkToken', authToken)
    }
  }

  socket.on('token_expired', event => {
    window.location.href = '/login.html'
  })

  socket.on('error', error => {
    errorAlert.textContent = error
    errorAlert.classList.remove('d-none')
  })

  const countdownTimer = document.querySelector('.countdown-timer')

  // Function to start the countdown
  function startCountdown(seconds) {
    countdownTimer.style.display = 'block'

    let remainingSeconds = seconds
    const countdownInterval = setInterval(() => {
      countdownTimer.textContent = `Game starting in ${remainingSeconds} seconds`

      if (remainingSeconds <= 0) {
        clearInterval(countdownInterval)
        countdownTimer.style.display = 'none'

        questionContainer.style.display = 'block'
      }

      remainingSeconds--
    }, 1000)
  }

  socket.on('startGame', questions => {
    currentQuestions = questions
    currentQuestionIndex = 0
    startCountdown(5)
    renderQuestion(currentQuestions[currentQuestionIndex])
  })

  socket.on('updateQuestion', question => {
    currentQuestionIndex++
    if (currentQuestionIndex < currentQuestions.length) {
      renderQuestion(currentQuestions[currentQuestionIndex])
    } else {
      questionContainer.style.display = 'none'
    }
  })

  function renderGameResults(results) {
    console.log(results)
    const gameResultsSection = document.getElementById('game-results-section')
    const gameResultsList = document.getElementById('game-results-list')

    gameResultsList.innerHTML = ''

    results.forEach((data) => {
      const listItem = document.createElement('li')
      listItem.className = 'list-group-item'
      listItem.textContent = `${data[0]}: ${data[1]} points`
      gameResultsList.appendChild(listItem)
    })
    gameResultsSection.style.display = 'block'
  }

  socket.on('gameEnd', ({ winner, scores }) => {
    renderGameResults(scores)
  })
})
