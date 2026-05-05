import { createContext, useContext, useState } from 'react'
import { setCredentials, clearCredentials, hasCredentials } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(hasCredentials)

  function login(username, password) {
    setCredentials(username, password)
    setAuthenticated(true)
  }

  function logout() {
    clearCredentials()
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
