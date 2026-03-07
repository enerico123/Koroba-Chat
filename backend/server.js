const express = require('express')
const cors = require('cors')
const db = require('./database')
const { register, login } = require('./auth/auth')

const app = express()
const PORT = 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Serveur Koroba-Chat opérationnel' })
})

// Routes auth
app.post('/auth/register', register)
app.post('/auth/login', login)


// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})