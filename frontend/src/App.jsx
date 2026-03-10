import { useState } from 'react'
import Login from './components/Login'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'

function App() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [conversationId, setConversationId] = useState(null)

  if (!token) {
    return <Login onLogin={(token, userId) => {
      setToken(token)
      setUserId(userId)
    }} />
  }

  

  return (
    <div>
      <Sidebar token={token} onSelectConversation={(id) => setConversationId(id)}/>

      <Chat token={token} userId={userId} conversationId={conversationId}/>
    </div>
  ) 
  
}

export default App