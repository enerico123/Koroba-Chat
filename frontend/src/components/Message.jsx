import './Message.css'

function Message({ message, userId }) {
  const estMoi = message.sender_id === userId

  return (
    <div className={estMoi ? "msg moi" : "msg autre"}>
      {message.content}
    </div>
  )
}

export default Message