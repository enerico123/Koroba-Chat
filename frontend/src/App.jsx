import { useState } from 'react'
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
  
  // console.log('conversation:', conversation)

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
        <Sidebar token={token} onSelectConversation={(conv) => setConversation(conv)}/>
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