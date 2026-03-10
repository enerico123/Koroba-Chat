import { useState } from 'react'

function Register({ onRegister,onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password,username })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      onRegister(data.token, data.userId)

    } catch (err) {
      setError('Erreur de connexion')
    }
  }

  return (
    <div>
      <h1>Koroba Chat 💬</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br></br>
      <br></br>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br></br>
      <br></br>
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button onClick={handleRegister}>S'identifier</button>
      <button onClick={() => onSwitch()}>Pas de compte ? S'inscrire</button>
    </div>
  )
}

export default Register