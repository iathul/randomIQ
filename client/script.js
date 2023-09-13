document.addEventListener('DOMContentLoaded', () => {
  const socket = io()

  // Function to render the room list
  function renderRoomList(rooms) {
    const roomList = document.getElementById('room-list')
    roomList.innerHTML = ''

    if (rooms.length === 0) {
      // If no rooms available, display a message
      const message = document.createElement('p')
      message.textContent =
        'No rooms available, click below button to create a room.'
      roomList.appendChild(message)
      document.getElementById('create-room').style.display = 'block'
    } else {
      rooms.forEach(room => {
        const li = document.createElement('li')
        li.textContent = room.roomName

        // Create a "Join" button next to each room
        const joinButton = document.createElement('button')
        joinButton.textContent = 'Join'
        joinButton.addEventListener('click', () => {
          // Display room details and enable "Join" button
          document.querySelector('.room-details').style.display = 'block'
          document.getElementById('room-name').textContent = room.roomName
          document.getElementById('join-room').style.display = 'block'
          document.getElementById('leave-room').style.display = 'none'
        })

        li.appendChild(joinButton)
        roomList.appendChild(li)
      })

      // Hide "Create Room" button if rooms are available
      document.getElementById('create-room').style.display = 'none'
    }
  }

  // Initial room list fetch (API call)
  fetch('/api/lobby/rooms')
    .then(response => response.json())
    .then(rooms => {
      renderRoomList(rooms.rooms)
    })
    .catch(error => {
      console.error('Error fetching room list:', error)
    })

  // Socket.IO: Listen for updates when a new user joins or leaves a room
  socket.on('userJoined', username => {
    console.log(`${username} has joined the room`)
    // You can update the UI to display this information to the user
  })

  socket.on('userLeft', username => {
    console.log(`${username} has left the room`)
    // You can update the UI to display this information to the user
  })

  // Handle user actions
  const createRoomButton = document.getElementById('create-room')
  const joinRoomButton = document.getElementById('join-room')
  const leaveRoomButton = document.getElementById('leave-room')

  createRoomButton.addEventListener('click', () => {
    // Implement logic to create a room (API call)
    // After creating, fetch and render the updated room list
  })

  // joinRoomButton.addEventListener('click', () => {
  //   // Implement logic to join a room (API call)
  //   // After joining, fetch and render the updated room list
  //   joinRoomButton.style.display = 'none'
  //   leaveRoomButton.style.display = 'block'
  // })

  // leaveRoomButton.addEventListener('click', () => {
  //   // Implement logic to leave a room (API call)
  //   // After leaving, fetch and render the updated room list
  //   leaveRoomButton.style.display = 'none'
  //   joinRoomButton.style.display = 'block'
  // })
})
