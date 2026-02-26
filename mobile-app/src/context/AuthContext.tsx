import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import http from '../api/http'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([AsyncStorage.getItem('token'), AsyncStorage.getItem('user')]).then(([t, u]) => {
      if (t) { setToken(t); http.defaults.headers.common['Authorization'] = `Bearer ${t}` }
      if (u) setUser(JSON.parse(u))
    }).finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await http.post('/api/auth/login', { email, password })
    const { token: t, user: u } = res.data
    setToken(t); setUser(u)
    http.defaults.headers.common['Authorization'] = `Bearer ${t}`
    await AsyncStorage.setItem('token', t)
    await AsyncStorage.setItem('user', JSON.stringify(u))
  }

  const register = async (email: string, password: string, name: string) => {
    const res = await http.post('/api/auth/register', { email, password, name, role: 'guest' })
    const { token: t, user: u } = res.data
    setToken(t); setUser(u)
    http.defaults.headers.common['Authorization'] = `Bearer ${t}`
    await AsyncStorage.setItem('token', t)
    await AsyncStorage.setItem('user', JSON.stringify(u))
  }

  const logout = async () => {
    setToken(null); setUser(null)
    delete http.defaults.headers.common['Authorization']
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
