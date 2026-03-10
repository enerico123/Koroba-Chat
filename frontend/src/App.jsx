import { useState,useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userId, setUserId] = useState(localStorage.getItem('userId'))
  const [conversation, setConversation] = useState(null)
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState(null)
  
  useEffect(() => {
    if (!token || !userId) return
    
    fetch(`/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setUsername(data.username))
  }, [userId])

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

  const deconnexion = () => {
    setToken(null)
    setUserId(null)
    setUsername(null)
    setConversation(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }
  

  return (
    <div className="app-container">
      <div className='sidebar'>
        <Sidebar 
        token={token} 
        username={username}
        onSelectConversation={(conv) => setConversation(conv)}
        onDeconnexion={deconnexion}/>
      </div>
      
      <div className='chat'>
        <Chat 
        token={token} 
        userId={userId} 
        conversationId={conversation?.id} 
        nomConversation={conversation?.name}/>
      </div>
    </div>
  ) 
  
}

export default App