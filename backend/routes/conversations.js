const express = require('express')
const router = express.Router()
const db = require('../database')

// GET /conversation -> liste des conversation du user 

router.get('/',(req,res) => {
    const userId = req.user.id 

    db.all('SELECT c.* FROM conversations c JOIN conversation_members cm ON c.id = cm.conversation_id WHERE cm.user_id = ? ',[userId],(err,conversations) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' })
        res.json(conversations)
    })
})

// POST /conversation -> crée une conversation 

router.post('/', (req, res) => {
  const userId = req.user.id
  const { name, is_group, members } = req.body

  // 1. Créer la conversation
  db.run(
    'INSERT INTO conversations (name, is_group, created_by) VALUES (?, ?, ?)',
    [name, is_group, userId],
    function(err) {
      if (err) return res.status(500).json({ error: 'Erreur serveur' })

      const conversationId = this.lastID
      // 2. Ajouter tous les membres + le créateur
      const allMembers = [...members, userId]

      allMembers.forEach(memberId => {
        db.run(
          'INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)',
          [conversationId, memberId]
        )
      })

      res.status(201).json({ conversationId, message: 'Conversation créée ✅' })
    }
  )
})

module.exports = router