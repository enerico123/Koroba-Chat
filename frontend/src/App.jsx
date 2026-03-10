import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
const [userId, setUserId] = useState(localStorage.getItem('userId'))
  const [conversationId, setConversationId] = useState(null)
  const [isRegister, setIsRegister] = useState(false)
  

  if (!token) {
    
    if(isRegister){
      return <Register onRegister={(token, userId) => {
      setToken(token)
      setUserId(userId)
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
    }}
    onSwitch={() => setIsRegister(false)} />}

    else {
      return <Login onLogin={(token, userId) => {
      setToken(token)
      setUserId(userId)
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
    }}
    onSwitch={() => setIsRegister(true)}  />}
  }

  

  return (
    <div className="app-container">
      <div className='sidebar'>
        <Sidebar token={token} onSelectConversation={(id) => setConversationId(id)}/>
      </div>
      
      <div className='chat'>
        <Chat token={token} userId={userId} conversationId={conversationId}/>
      </div>
    </div>
  ) 
  
}

export default App