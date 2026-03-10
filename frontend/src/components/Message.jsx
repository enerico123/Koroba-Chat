

function Message({ message, userId }) {
  const estMoi = message.sender_id === userId

  return (
    <div>
      {message.content}
    </div>
  )
}

export default Message