import { useEffect, useState } from "react"

const Chat = ({token, userId, conversationId}) => {

  const [messages, setMessages] = useState([])

  useEffect(() => {
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

  return (
    <>
    {/* liste des messages  */}
    
    {messages.map((mess) => (
      <div key={mess.id}>
        {mess.content}
      </div>
    ))}

    {/* input pour ecrire un message  */}
    <input type="text" />
    </>
  )
}

export default Chat