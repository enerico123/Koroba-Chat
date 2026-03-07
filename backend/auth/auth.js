const db = require('../database')
const { hashPassword, comparePassword } = require('./hash')
const { generateToken } = require('./jwt')

// Inscription
const register = (req, res) => {
  const { username, email, password } = req.body

  // 1. Vérifier que l'email n'existe pas déjà
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' })
    if (user) return res.status(400).json({ error: 'Email déjà utilisé' })

    // 2. Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // 3. Sauvegarder en DB
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function (err) {
        if (err) return res.status(500).json({ error: 'Erreur création compte' })

        // 4. Générer le token
        const token = generateToken({ id: this.lastID, username })
        res.status(201).json({ token, userId: this.lastID, username })
      }
    )
  })
}

// Connexion
const login = (req, res) => {
  const { email, password } = req.body

  // 1. Chercher le user en DB
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' })
    if (!user) return res.status(400).json({ error: 'Email introuvable' })

    // 2. Comparer le mot de passe
    const match = await comparePassword(password, user.password)
    if (!match) return res.status(400).json({ error: 'Mot de passe incorrect' })

    // 3. Générer le token
    const token = generateToken({ id: user.id, username: user.username })
    res.status(200).json({ token, userId: user.id, username: user.username })
  })
}

module.exports = { register, login }