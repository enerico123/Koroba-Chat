const express = require('express')
const router = express.Router()
const db = require('../database')

// GET /users — liste de tous les users
router.get('/', (req, res) => {
  const search = req.query.search

  if (!search) return res.json([])

  db.get(
    'SELECT id, username FROM users WHERE LOWER(username) = LOWER(?)',
    [search],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' })
      if (!user) return res.json(null)  // user pas trouvé
      res.json(user)
    }
  )
})

// GET /users/:id — profil d'un user
router.get('/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT id, username, email, created_at, is_online FROM users WHERE id = ?', [id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' })
    if (!user) return res.status(404).json({ error: 'User introuvable' })
    res.json(user)
  })
})

// PUT /users/:id — modifier son profil
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { username } = req.body

  db.run('UPDATE users SET username = ? WHERE id = ?', [username, id], function(err) {
    if (err) return res.status(500).json({ error: 'Erreur serveur' })
    res.json({ message: 'Profil mis à jour ✅' })
  })
})

module.exports = router