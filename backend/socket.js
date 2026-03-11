const { verifyToken } = require('./auth/jwt')
const db = require('./database')

// Partie 1 : Init 

const initSocket = (server) => {
  const io = require('socket.io')(server, {
    cors: { origin: '*' }
  })

  // CORP DANS L'INIT 

  // Partie 2 : Middleware auth : verification avant la connexion permanante 
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    try {
      const decoded = verifyToken(token)
      socket.user = decoded
      next()
    } catch (err) {
      next(new Error('Token invalide'))
    }
  })
  // Partie 3 : connexion permanante 
  io.on('connection', (socket) => {
    // Rejoindre sa room personnelle
    socket.join(`user_${socket.user.id}`)
    console.log(`${socket.user.username} connecté `)

    // Partie 4 : Rejoindre conversation : connexion permanante pour les requetes de conv 
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId)
      console.log(`${socket.user.username} a rejoint la conv ${conversationId}`)
    })

    // Partie 5 : Envoyer un message : connexion permanante pour les requetes de messages 

    socket.on('send_message', (data) => {
      const { conversationId, content } = data
      const senderId = socket.user.id

      db.run(
        'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
        [conversationId, senderId, content],
        function(err) {
          if (err) return console.log('Erreur DB:', err.message)

          // Envoyer le message à tous les membres de la conv
          io.to(conversationId).emit('new_message', {
            id: this.lastID,
            conversationId,
            sender_id : senderId,
            username: socket.user.username,
            content,
            created_at: new Date()
          })
        }
      )
    })
    // Partie 6 : Déconnexion 
    
    socket.on('disconnect', () => {
      console.log(`${socket.user.username} déconnecté 🔴`)
    })
  })
  return io
}

module.exports = initSocket








 







