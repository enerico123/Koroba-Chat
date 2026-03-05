const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erreur connexion DB:', err.message)
  } else {
    console.log('Base de données connectée ✅')
  }
})

// Créer les tables si elles n'existent pas
db.serialize(() => {

  // Table users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT    UNIQUE NOT NULL,
    email       TEXT    UNIQUE NOT NULL,
    password    TEXT    NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen   DATETIME,
    is_online   BOOLEAN DEFAULT FALSE
  )`)

  // Table conversations
  db.run(`CREATE TABLE IF NOT EXISTS conversations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT,
    is_group    BOOLEAN DEFAULT FALSE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by  INTEGER REFERENCES users(id)
  )`)

  // Table conversation_members
  db.run(`CREATE TABLE IF NOT EXISTS conversation_members (
    conversation_id INTEGER REFERENCES conversations(id),
    user_id         INTEGER REFERENCES users(id),
    joined_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_admin        BOOLEAN DEFAULT FALSE
  )`)

  // Table messages
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id  INTEGER REFERENCES conversations(id),
    sender_id        INTEGER REFERENCES users(id),
    content          TEXT NOT NULL,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at        DATETIME,
    is_deleted       BOOLEAN DEFAULT FALSE,
    reply_to         INTEGER REFERENCES messages(id)
  )`)

  // Table message_status
  db.run(`CREATE TABLE IF NOT EXISTS message_status (
    message_id  INTEGER REFERENCES messages(id),
    user_id     INTEGER REFERENCES users(id),
    seen_at     DATETIME
  )`)

  console.log('Tables créées ✅')
})

module.exports = db