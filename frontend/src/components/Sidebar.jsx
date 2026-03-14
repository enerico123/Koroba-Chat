import { useState, useEffect,useRef } from 'react';
import { LogOut, User } from 'lucide-react'
import { io } from 'socket.io-client'
import './Sidebar.css'

const Sidebar = ({fetchAvecAuth,token, onSelectConversation,username, onDeconnexion}) => {

    const [conversations, setConversations] = useState([])
    const [newNameConv,setNewNameConv] = useState('')
    const socket = useRef(null)

    const chargerConversations = async () => {
        const response = await fetchAvecAuth('/api/conversations')
        if (!response) return
        const data = await response.json()
        if (Array.isArray(data)) {
            setConversations(data)
        }
    }

    useEffect(() => {
        chargerConversations()
    }, [])

    useEffect(() => {
        socket.current = io('http://localhost:3000', { auth: { token } })

        socket.current.on('added_to_conversation', () => {
            chargerConversations()  // recharge les convs
        })

        return () => socket.current.disconnect()
    }, [])

    const creerGroupe = async () => {
        if (!newNameConv) return
        const response = await fetchAvecAuth('/api/conversations', {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            name: newNameConv,
            is_group: true,
            members: []
            })
        })

        const data = await response.json()
        setConversations(prev => [...prev, data])  // ajoute à la liste
        setNewNameConv('')
        
    }

    return (
        <>  
            <div className='info-compte'>
                <span className="sidebar-username"><User size={16} /> {username}</span> {/* image user par la suite */} 
                 <button onClick={onDeconnexion}><LogOut size={16} /></button> {/* image deconnecter par la suite  */}
            </div>
            <div className='creation-groups'>
                <input 
                placeholder='Nom du groupe'
                value={newNameConv}
                onChange={(e) => setNewNameConv(e.target.value)}
                type="text"/>

                <button onClick={creerGroupe}>Créer</button>
            </div>
            <div className='liste-groups'>
            {conversations.map((conv) => (
                <div className='message' key={conv.id} onClick={() => onSelectConversation(conv)}>
                    {conv.name}
                </div>
            ))}
            </div>
            
        </>
    );
}

export default Sidebar