document.addEventListener('DOMContentLoaded', () => {
  const socket = io()
  checkAuthenticated()

  // Get DOM elements
  const createRoomButton = document.getElementById('create-room-button')
  const createRoomForm = document.getElementById('create-room-form')
  const roomList = document.getElementById('room-list')
  const logoutButton = document.getElementById('logout-button')

  // Handle room creation form display
  createRoomButton.addEventListener('click', () => {
    createRoomForm.style.display = 'block'
    createRoomButton.style.display = 'none'
  })

  // Handle room creation
  createRoomForm.addEventListener('submit', async e => {
    e.preventDefault()
    const roomName = document.getElementById('room-name').value
    const roomDescription = document.getElementById('room-description').value
    try {
      const response = await fetch('/api/lobby/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, description: roomDescription })
      })
      const rooms = await response.json()
      getRooms()
      createRoomForm.style.display = 'none'
      createRoomButton.style.display = 'block'
    } catch (error) {
      console.error('Error creating room:', error)
    }
  })

  // Function to render the room list
  function renderRoomList(rooms) {
    roomList.innerHTML = ''

    if (rooms.length === 0) {
      // If no rooms available, display a message
      roomList.innerHTML =
        '<p>No rooms available, click below button to create a room.</p>'
      createRoomButton.style.display = 'block'
    } else {
      rooms.forEach(room => {
        // Create list group item with Bootstrap classes
        const listItem = document.createElement('li')
        listItem.className =
          'list-group-item d-flex justify-content-between align-items-center'

        // Create a div to hold room name
        const roomNameDiv = document.createElement('div')
        roomNameDiv.textContent = room.roomName

        // Create a "View" button with Bootstrap classes
        const viewButton = document.createElement('button')
        viewButton.textContent = 'View'
        viewButton.className = 'view-btn btn btn-primary'
        viewButton.setAttribute('data-room-id', room._id)

        viewButton.addEventListener('click', e => {
          e.preventDefault()
          if (e.target.classList.contains('view-btn')) {
            const roomId = e.target.getAttribute('data-room-id')
            // Redirect to the corresponding room page with the roomId parameter
            window.location.href = `/room.html?roomId=${roomId}`
          }
        })

        // Append the elements to the list item
        listItem.appendChild(roomNameDiv)
        listItem.appendChild(viewButton)

        // Append the list item to the room list
        roomList.appendChild(listItem)
      })

      // Hide "Create Room" button if rooms are available
      createRoomButton.style.display = 'none'
    }
  }

  // Function to fetch and display rooms
  async function getRooms() {
    try {
      const response = await fetch('/api/lobby/rooms')
      const rooms = await response.json()
      renderRoomList(rooms.rooms)
    } catch (error) {
      console.error('Error fetching room list:', error)
    }
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

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    window.location.href = '/login.html'
  })
  socket.on('token_expired', event => {
    window.location.href = '/login.html'
  })
  
  getRooms()
})
