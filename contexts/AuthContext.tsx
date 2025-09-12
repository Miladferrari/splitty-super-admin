import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const isAuthenticated = localStorage.getItem('isAuthenticated')
        if (isAuthenticated === 'true') {
          const userData: User = {
            id: parseInt(localStorage.getItem('userId') || '1'),
            email: localStorage.getItem('userEmail') || '',
            password: '',
            name: localStorage.getItem('userName') || '',
            role: (localStorage.getItem('userRole') || 'admin') as User['role'],
            lastLogin: null,
            created: new Date().toISOString()
          }
          setUser(userData)
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with actual API call
    if (email && password) {
      const userData: User = {
        id: 1,
        email,
        password,
        name: email.split('@')[0],
        role: 'admin',
        lastLogin: new Date().toISOString(),
        created: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userId', userData.id.toString())
      localStorage.setItem('userEmail', userData.email)
      localStorage.setItem('userName', userData.name)
      localStorage.setItem('userRole', userData.role)
      
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
  }

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
