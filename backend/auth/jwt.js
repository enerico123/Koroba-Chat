require('dotenv').config()
const jwt = require('jsonwebtoken')

// SECRET_KEY dans .env 
const SECRET_KEY = process.env.JWT_SECRET

// Générer un token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '24h' }
  )
}

// Vérifier un token
const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY)
}

module.exports = { generateToken, verifyToken }