// room.js
document.addEventListener('DOMContentLoaded', async () => {
  const socket = io()
  checkAuthenticated()

  const roomTitle = document.querySelector('.room-title')
  const roomDescription = document.querySelector('.room-description')
  const userList = document.getElementById('user-list')
  const joinButton = document.getElementById('join-button')
  const toastContainer = document.querySelector('.toast-container')

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

  socket.on('userJoined', message => {
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
})
