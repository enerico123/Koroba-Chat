import { useState } from 'react'
import Login from './components/Login'
import Chat from './components/Chat'

function App() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)

  if (!token) {
    return <Login onLogin={(token, userId) => {
      setToken(token)
      setUserId(userId)
    }} />
  }

  return <Chat token={token} userId={userId} />
}

export default App