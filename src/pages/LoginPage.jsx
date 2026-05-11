import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import Button  from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    login(username, password)
    try {
      await client.get('/user/me/')
      navigate('/forms')
    } catch {
      setError('Invalid username or password.')
      login('', '')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white text-2xl font-bold shadow">
            F
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Dynamic Form</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to access your forms</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-5">
          <div>
            <label className="label-base" htmlFor="username">Username</label>
            <input id="username" type="text" value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-base" placeholder="testuser" required autoFocus />
          </div>
          <div>
            <label className="label-base" htmlFor="password">Password</label>
            <input id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base" placeholder="••••••••" required />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Spinner className="h-4 w-4" />}
            Sign In
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Seeded credentials — testuser / testpass123
        </p>
      </div>
    </div>
  )
}
