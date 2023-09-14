document.addEventListener('DOMContentLoaded', () => {
  const registrationForm = document.getElementById('registration-form')
  registrationForm.addEventListener('submit', async e => {
    e.preventDefault()
    const userName = document.getElementById('userName').value
    const fullName = document.getElementById('fullName').value
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, fullName })
      })
      const data = await response.json()
      if (data.auth_token) {
        localStorage.setItem('user', data.user)
        localStorage.setItem('authToken', data.auth_token)
        window.location.href = '/lobby.html'
      } else {
        console.error('Registration failed')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  })
})
