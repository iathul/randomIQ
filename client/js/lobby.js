document.addEventListener('DOMContentLoaded', () => {
  const socket = io()

  // Get DOM elements
  const createRoomButton = document.getElementById('create-room-button')
  const createRoomForm = document.getElementById('create-room-form')
  const roomList = document.getElementById('room-list')

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

        // Create a "Join" button with Bootstrap classes
        const joinButton = document.createElement('button')
        joinButton.textContent = 'Join'
        joinButton.className = 'btn btn-success'

        // Add an event listener to the "Join" button (implement logic as needed)
        joinButton.addEventListener('click', () => {
          // Handle joining the room
        })

        // Append the elements to the list item
        listItem.appendChild(roomNameDiv)
        listItem.appendChild(joinButton)

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

  // Socket.IO: Listen for updates when a new user joins or leaves a room
  socket.on('userJoined', username => {
    console.log(`${username} has joined the room`)
    // You can update the UI to display this information to the user
  })

  socket.on('userLeft', username => {
    console.log(`${username} has left the room`)
    // You can update the UI to display this information to the user
  })

  // Initial fetch and render of rooms
  getRooms()
})
