import { useState } from 'react'
import './Register.css'

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
    <div className='auth-container'>
      <h1 className='title'>Koroba Chat</h1>
      <div className='entree'>
        <input
          className='input-mail'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className='input-username'
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className='input-password'
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p>{error}</p>}
      <div className='bouttons'>
        <button className='btn-main' onClick={handleRegister}>S'identifier</button>
      <button className='btn-switch' onClick={() => onSwitch()}>Pas de compte ? S'inscrire</button>
      </div>
      
    </div>
  )
}

export default Register