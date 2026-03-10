import { useState, useEffect } from 'react';

const Sidebar = ({token, onSelectConversation}) => {

    const [conversations, setConversations] = useState([])
    const [newNameConv,setNewNameConv] = useState('')

    useEffect(() => {
        const chargerConversations = async () => {
            const response = await fetch('/api/conversations', {
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
            })
            const data = await response.json()
            setConversations(data)
        }
        chargerConversations()
        }, [])

    const creerGroupe = async () => {
        if (!newNameConv) return
        const response = await fetch('/api/conversations', {
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
            <input 
            placeholder='Nom du groupe'
            value={newNameConv}
            onChange={(e) => setNewNameConv(e.target.value)}
            type="text"/>
            {/* onClick={envoyerMessage} quand fonction sera créé */}
            <button onClick={creerGroupe}>Créer</button>

            {conversations.map((conv) => (
                <div key={conv.id} onClick={() => onSelectConversation(conv.id)}>
                    {conv.name}
                </div>
            ))}

            
        </>
    );
}

export default Sidebar