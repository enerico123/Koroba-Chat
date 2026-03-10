import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'

function App() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [conversationId, setConversationId] = useState(null)
  const [isRegister, setIsRegister] = useState(false)

  if (!token) {
    
    if(isRegister){
      return <Register onRegister={(token, userId) => {
      setToken(token)
      setUserId(userId)
    }}
    onSwitch={() => setIsRegister(false)} />}

    else {
      return <Login onLogin={(token, userId) => {
      setToken(token)
      setUserId(userId)
    }}
    onSwitch={() => setIsRegister(true)}  />}
  }

  

  return (
    <div>
      <Sidebar token={token} onSelectConversation={(id) => setConversationId(id)}/>

      <Chat token={token} userId={userId} conversationId={conversationId}/>
    </div>
  ) 
  
}

export default App