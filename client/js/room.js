// room.js
document.addEventListener('DOMContentLoaded', () => {
  const socket = io()

  // Get DOM elements
  const roomTitle = document.querySelector('.room-title')
  const roomDescription = document.querySelector('.room-description')
  const userList = document.getElementById('user-list')
  const toastContainer = document.querySelector('.toast-container')

  // Function to render the list of users in the room
  function renderUserList(users) {
    userList.innerHTML = ''

    users.forEach(user => {
      // Create list item for each user
      const listItem = document.createElement('li')
      listItem.className = 'list-group-item'

      // Create username element
      const username = document.createElement('span')
      username.textContent = user.userName // Use "userName" from the JSON response

      // Append username to list item
      listItem.appendChild(username)

      // Append list item to user list
      userList.appendChild(listItem)
    })
  }

  // Function to display a toast notification
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

  // Function to fetch room details from the API
  async function getRoomDetails(roomId) {
    try {
      const response = await fetch(`/api/lobby/rooms/${roomId}`) // Replace with your API endpoint
      const roomData = await response.json()

      // Update room title and description
      roomTitle.textContent = roomData.room.roomName
      roomDescription.textContent = `Description: ${roomData.room.roomDescription}`

      // Render the list of users in the room
      renderUserList(roomData.room.users)
    } catch (error) {
      console.error('Error fetching room details:', error)
    }
  }

  // Fetch room details when the page loads
  const urlParams = new URLSearchParams(window.location.search)
  const roomId = urlParams.get('roomId')

  if (roomId) {
    getRoomDetails(roomId)
    // Listen for a socket.io event when a new user joins the room
    socket.on('userJoined', message => {
      showToast(message)
      console.log('message', message)
    })
  }


})
