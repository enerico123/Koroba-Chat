import './Message.css'

function Message({ message, userId }) {
  // console.log('sender_id:', message.sender_id, 'userId:', userId)
  const estMoi = Number(message.sender_id) === Number(userId)

  return (
    <div className={estMoi ? "msg-container moi-container" : "msg-container autre-container"}>
    <span className="username">{message.username}</span>
    <div className={estMoi ? "msg moi" : "msg autre"}>
      <p className='msg-content'>{message.content}</p>
    </div>
  </div>
  )
}

export default Message