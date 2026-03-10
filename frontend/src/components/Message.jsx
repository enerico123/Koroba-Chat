import './Message.css'

function Message({ message, userId }) {
  // console.log('sender_id:', message.sender_id, 'userId:', userId)
  const estMoi = Number(message.sender_id) === Number(userId)

  return (
    <div className={estMoi ? "msg moi" : "msg autre"}>
      {message.content}
    </div>
  )
}

export default Message