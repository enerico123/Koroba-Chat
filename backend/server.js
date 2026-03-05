const express = require('express')
const cors = require('cors')
const db = require('./database')

const app = express()
const PORT = 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Serveur Koroba-Chat opérationnel' })
})

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})