import { useEffect, useState, useRef } from "react"
import { io } from 'socket.io-client'
import Message from "./Message"
import './Chat.css'

const Chat = ({token, userId, conversationId}) => {

  const [messages, setMessages] = useState([])
  const [contenu, setContenu] = useState('')
  const socket = useRef(null)

  // charge les messags quand convId change
  useEffect(() => {
    if (!conversationId) return
    const chargerMessages = async () => {
            const response = await fetch(`/api/messages/${conversationId}`, {
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
            })
            const data = await response.json()
            setMessages(data)
        }
        chargerMessages()
  },[conversationId])



  useEffect(() => {
    // connexion perma 
    socket.current = io('http://localhost:3000', { auth: { token } })


    // ecouter les messages
    socket.current.on('new_message', (message) => {
      setMessages(prev => [...prev, message])
    })

    return () => socket.current.disconnect()
  }, [])  // ← une seule fois

  // Rejoindre la room — quand conversationId change
  useEffect(() => {
    if (!conversationId || !socket.current) return
    socket.current.emit('join_conversation', conversationId)
  }, [conversationId])  // ← quand conv change





    // fonction pour ENVOYER son message 
    const envoyerMessage = () => {
    if (!contenu) return  

    socket.current.emit('send_message', {
      conversationId,
      content: contenu
    })




    setContenu('')  // vider l'input après envoi
  }

    return (
      <>
      {/* liste des messages  */}

      <div className="liste-messages">
      {messages.map((mess) => (
        <Message key={mess.id} message={mess} userId={userId} />
      ))}
      </div>

      {/* input pour ecrire un message  */}
      <div className="input-message">
      <input 
        type="text" 
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Écrire un message..."/>
      <button onClick={envoyerMessage}>Envoyer</button>
      </div>
      </>
    )
  }

export default Chat