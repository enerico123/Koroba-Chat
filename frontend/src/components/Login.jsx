import { useState } from 'react'
import './Login.css'

function Login({ onLogin,onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      onLogin(data.token, data.userId)

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
          className='input-password'
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p>{error}</p>}
      <div className='bouttons'>
        <button className='btn-main' onClick={handleLogin}>Se connecter</button>
        <button className='btn-switch' onClick={() => onSwitch()}>Pas de compte ? S'inscrire</button>
      </div>
    </div>
  )
}

export default Login