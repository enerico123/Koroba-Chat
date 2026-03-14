import { useEffect, useState, useRef } from "react"
import { io } from 'socket.io-client'
import Message from "./Message"
import './Chat.css'

const Chat = ({fetchAvecAuth, token, userId, conversationId, nomConversation}) => {

  const [messages, setMessages] = useState([])
  const [contenu, setContenu] = useState('')
  const [showModal, setShowModal] = useState(false)
  const socket = useRef(null)
  const messagesEndRef = useRef(null)
  const [searchUsername, setSearchUsername] = useState('')
  const [userTrouve, setUserTrouve] = useState(null)

  // console.log('conversationId:', conversationId)

  // charge les messags quand convId change
  useEffect(() => {
    if (!conversationId) return
    const chargerMessages = async () => {
            const response = await fetchAvecAuth(`/api/messages/${conversationId}`)
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

    // fonction pour chercher un user grace a route/user.js
    const chercherUser = async () => {
      console.log('cherche:', searchUsername)
      if (!searchUsername) return
      
      const response = await fetchAvecAuth(`/api/users?search=${searchUsername}`)
      const data = await response.json()
      console.log('data :', {data})
      setUserTrouve(data)
    }


    //fct pour ajouter un user au groupe 
    const ajouterMembre = async () => {
      if (!userTrouve) return

      const response = await fetchAvecAuth(`/api/conversations/${conversationId}/members`, {
        method: 'POST',                          
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userTrouve.id })  
      })

      const data = await response.json()
      //console.log(data)
      setShowModal(false) 
      setSearchUsername('')
      setUserTrouve(null)
    }

    // fonction pour ENVOYER son message 
    const envoyerMessage = () => {
    if (!contenu) return  

    socket.current.emit('send_message', {
      conversationId,
      content: contenu
    })




    setContenu('')  // vider l'input après envoi
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

    if(!conversationId){
      return (
        <>
          <div className="sleep">Sleep...</div>
        </>
      )
    }


    return (
      <>
         {/* TOPBAR : avec nom du groupe + bouton ajouter user au groupe   */}
        <div className="chat-header">
          <h2>{nomConversation}</h2>
          <button onClick={() => setShowModal(true)}>+ Ajouter</button>
        </div>


        {/* FENETRE POUR AJOUTER USER  */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Ajouter un membre</h3>

              <input 
                type="text" 
                placeholder="Nom d'utilisateur exact..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
              
              <button onClick={chercherUser}>Rechercher</button>
              
              <hr></hr>

              {userTrouve && (
                <div>
                  <span>{userTrouve.username}</span>
                  <button className='ajouter-btn' onClick={ajouterMembre}>Ajouter</button>
                </div>
              )}
              {userTrouve === null && searchUsername && (
                <p>Utilisateur introuvable</p>
              )}
              
              <button onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>

          )}

        {/* liste des messages  */}

        <div className="liste-messages">
        {messages.map((mess) => (
          <Message key={mess.id} message={mess} userId={userId} />
        ))}
        <div ref={messagesEndRef} /> 
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