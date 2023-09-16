document.addEventListener('DOMContentLoaded',async () => {
  const loginForm = document.getElementById('login-form')
  // Handle user login
  loginForm.addEventListener('submit', async e => {
    e.preventDefault()
    const userName = document.getElementById('userName').value
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName })
      })
      const data = await response.json()
      if (data.auth_token) {
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('authToken', data.auth_token)
        window.location.href = '/lobby.html'
      } else {
        console.error('Authentication failed')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  })
})
