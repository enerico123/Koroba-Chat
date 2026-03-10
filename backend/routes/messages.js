const express = require('express')
const router = express.Router()
const db = require('../database')

// GET /messages/:conversationId -> liste les messages 

router.get('/:conversationId', (req, res) => {
  const conversationId = req.params.conversationId

  db.all(`
    SELECT messages.*, users.username 
    FROM messages 
    JOIN users ON messages.sender_id = users.id
    WHERE messages.conversation_id = ?
  `, [conversationId], (err, messages) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' })
    res.json(messages)
  })
})

// POST /messages -> envoyer un message dans une conversation 

router.post('/', (req, res) => {
  const { content, conversationId } = req.body
  const { id } = req.user

  db.run(
    'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
    [conversationId, id, content],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' })
      }

      const messageId = this.lastID

      // Ajouter le statut pour tous les membres de la conversation
      db.all(
        'SELECT user_id FROM conversation_members WHERE conversation_id = ?',
        [conversationId],
        (err, members) => {
          members.forEach(member => {
            db.run(
              'INSERT INTO message_status (message_id, user_id) VALUES (?, ?)',
              [messageId, member.user_id]
            )
          })
        }
      )

      res.status(201).json({ conversationId, content, message: 'Message envoyé ✅' })
    }
  )
})

module.exports = router