import { useState, useEffect } from 'react';

const Sidebar = ({token, onSelectConversation}) => {

    const [conversations, setConversations] = useState([])

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


    return (
        <>
            {conversations.map((conv) => (
                <div key={conv.id} onClick={() => onSelectConversation(conv.id)}>
                    {conv.name}
                </div>
            ))}
        </>
    );
}

export default Sidebar