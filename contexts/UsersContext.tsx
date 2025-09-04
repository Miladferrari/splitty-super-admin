import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import db from '../utils/database'
import { User, StaffMember } from '../types'

// Use StaffMember as RestaurantUser
type RestaurantUser = StaffMember & {
  lastActive: string
}

// Extended user type with Date objects
interface CompanyUser extends Omit<User, 'lastLogin' | 'created'> {
  lastLogin: Date | null
  created: Date
}

// Context value type
interface UsersContextValue {
  companyUsers: CompanyUser[]
  restaurantUsers: Record<string, RestaurantUser[]>
  loading: boolean
  error: string | null
  addUser: (userData: Partial<User>) => Promise<CompanyUser | null>
  updateUser: (userId: number, updates: Partial<User>) => Promise<CompanyUser | null>
  deleteUser: (userId: number) => Promise<boolean>
  addRestaurantUser: (restaurantId: string, userData: Partial<RestaurantUser>) => void
  updateRestaurantUser: (restaurantId: string, userId: number, updates: Partial<RestaurantUser>) => void
  deleteRestaurantUser: (restaurantId: string, userId: number) => void
  refreshUsers: () => void
  authenticateUser: (email: string, password: string) => { success: boolean; user?: User; error?: string }
  getCompanyUser: (userId: number | string) => CompanyUser | undefined
  getRestaurantUser: (restaurantId: string, userId: number | string) => RestaurantUser | undefined
  deleteCompanyUser: (userId: number | string) => void
  addCompanyUser: (userData: Partial<User>) => User | null
  updateRestaurantUsersFromOnboarding: (restaurantId: string, personnelData: StaffMember[]) => void
  refreshRestaurantUsers: () => void
}

const UsersContext = createContext<UsersContextValue | undefined>(undefined)

export function useUsers(): UsersContextValue {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}

interface UsersProviderProps {
  children: ReactNode
}

export function UsersProvider({ children }: UsersProviderProps) {
  // Initialize users from database
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>(() => {
    const users = db.getUsers() || []
    return users.map(user => ({
      ...user,
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      created: new Date(user.created)
    }))
  })

  // Load restaurant users from localStorage
  const loadRestaurantUsersFromStorage = (): Record<string, RestaurantUser[]> => {
    // Check if we're on the client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return {}
    }
    
    // First, check if we have directly saved restaurant users
    const savedRestaurantUsers = localStorage.getItem('restaurantUsers')
    if (savedRestaurantUsers) {
      try {
        return JSON.parse(savedRestaurantUsers)
      } catch (e) {
        console.error('Error parsing saved restaurant users:', e)
      }
    }
    
    // Fallback: Load from onboarding data
    const restaurantUsersData: Record<string, RestaurantUser[]> = {}
    
    // Also check all localStorage keys for any onboarding data
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('onboarding_')) {
          const restaurantId = key.replace('onboarding_', '')
          const onboardingData = localStorage.getItem(key)
          
          if (onboardingData) {
            try {
              const parsed = JSON.parse(onboardingData)
              // Check for personnelData (not staff)
              if (parsed.personnelData && parsed.personnelData.length > 0) {
                restaurantUsersData[restaurantId] = parsed.personnelData.map((staffMember: StaffMember, index: number) => ({
                  id: index + 1,
                  firstName: staffMember.firstName,
                  lastName: staffMember.lastName,
                  email: staffMember.email,
                  phone: staffMember.phone || '',
                  role: staffMember.role === 'manager' ? 'admin' : 'staff',
                  lastActive: 'Recent',
                  status: 'active'
                }))
              }
            } catch (e) {
              console.error(`Error parsing onboarding data for restaurant ${restaurantId}:`, e)
            }
          }
        }
      }
    }
    
    // Add default data for restaurants without onboarding data
    if (!restaurantUsersData[6]) {
      restaurantUsersData[6] = [
        { id: 1, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@limon.nl', phone: '+31 6 34567890', role: 'staff', lastActive: '5 minuten geleden', status: 'active' },
        { id: 2, firstName: 'Tom', lastName: 'Bakker', email: 'tom@limon.nl', phone: '+31 6 01234567', role: 'staff', lastActive: '2 uur geleden', status: 'active' },
      ]
    }
    if (!restaurantUsersData[16]) {
      restaurantUsersData[16] = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@splitty.com', role: 'admin', lastActive: '2 uur geleden', status: 'active' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@splitty.com', role: 'staff', lastActive: '5 minuten geleden', status: 'active' },
      ]
    }
    
    return restaurantUsersData
  }

  // Restaurant users by restaurant ID
  const [restaurantUsers, setRestaurantUsers] = useState<Record<string, RestaurantUser[]>>(() => {
    if (typeof window === 'undefined') {
      return {}
    }
    return loadRestaurantUsersFromStorage()
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Save restaurant users to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(restaurantUsers).length > 0) {
      localStorage.setItem('restaurantUsers', JSON.stringify(restaurantUsers))
    }
  }, [restaurantUsers])

  // Reload from storage on mount (handles storage events from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRestaurantUsers = loadRestaurantUsersFromStorage()
      setRestaurantUsers(updatedRestaurantUsers)
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also refresh restaurant users periodically
    const interval = setInterval(() => {
      const updatedRestaurantUsers = loadRestaurantUsersFromStorage()
      setRestaurantUsers(updatedRestaurantUsers)
    }, 1000) // Check every second for updates
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Refresh users from database
  const refreshUsers = () => {
    const users = db.getUsers() || []
    setCompanyUsers(users.map(user => ({
      ...user,
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      created: new Date(user.created)
    })))
  }

  // Add company user
  const addUser = async (userData: Partial<User>): Promise<CompanyUser | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const newUser = db.addUser(userData)
      if (newUser) {
        const userWithDates = {
          ...newUser,
          lastLogin: newUser.lastLogin ? new Date(newUser.lastLogin) : null,
          created: new Date(newUser.created)
        }
        setCompanyUsers(prev => [...prev, userWithDates])
        return userWithDates
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update company user
  const updateUser = async (userId: number, updates: Partial<User>): Promise<CompanyUser | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedUser = db.updateUser(userId, updates)
      if (updatedUser) {
        const userWithDates = {
          ...updatedUser,
          lastLogin: updatedUser.lastLogin ? new Date(updatedUser.lastLogin) : null,
          created: new Date(updatedUser.created)
        }
        setCompanyUsers(prev => 
          prev.map(user => user.id === userId ? userWithDates : user)
        )
        return userWithDates
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Delete company user
  const deleteUser = async (userId: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const success = db.deleteUser(userId)
      if (success) {
        setCompanyUsers(prev => prev.filter(user => user.id !== userId))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Add restaurant user
  const addRestaurantUser = (restaurantId: string, userData: Partial<RestaurantUser>) => {
    setRestaurantUsers(prev => {
      const existingUsers = prev[restaurantId] || []
      const newUser: RestaurantUser = {
        id: Math.max(...existingUsers.map(u => u.id || 0), 0) + 1,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone,
        role: userData.role || 'staff',
        lastActive: 'Just now',
        status: userData.status || 'active'
      }
      return {
        ...prev,
        [restaurantId]: [...existingUsers, newUser]
      }
    })
  }

  // Update restaurant user
  const updateRestaurantUser = (restaurantId: string, userId: number, updates: Partial<RestaurantUser>) => {
    setRestaurantUsers(prev => ({
      ...prev,
      [restaurantId]: (prev[restaurantId] || []).map(user =>
        user.id === userId ? { ...user, ...updates } : user
      )
    }))
  }

  // Delete restaurant user
  const deleteRestaurantUser = (restaurantId: string, userId: number) => {
    setRestaurantUsers(prev => ({
      ...prev,
      [restaurantId]: (prev[restaurantId] || []).filter(user => user.id !== userId)
    }))
  }

  // Authenticate user
  const authenticateUser = (email: string, password: string): { success: boolean; user?: User; error?: string } => {
    // Use database to authenticate
    const user = db.authenticateUser(email, password)
    
    console.log('Authenticating user:', email, 'Result:', user)
    
    if (user) {
      return { success: true, user }
    } else {
      return { success: false, error: 'Invalid email or password' }
    }
  }

  // Get company user by ID
  const getCompanyUser = (userId: number | string): CompanyUser | undefined => {
    return companyUsers.find(user => user.id === (typeof userId === 'string' ? parseInt(userId) : userId))
  }

  // Get restaurant user by restaurant ID and user ID
  const getRestaurantUser = (restaurantId: string, userId: number | string): RestaurantUser | undefined => {
    const users = restaurantUsers[restaurantId] || []
    const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId
    return users.find(user => user.id === userIdNum)
  }

  // Delete company user
  const deleteCompanyUser = (userId: number | string): void => {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId
    db.deleteUser(userIdNum)
    refreshUsers()
  }

  // Add company user
  const addCompanyUser = (userData: Partial<User>): User | null => {
    const newUser = db.addUser(userData)
    refreshUsers()
    return newUser
  }

  // Update restaurant users from onboarding
  const updateRestaurantUsersFromOnboarding = (restaurantId: string, personnelData: StaffMember[]): void => {
    if (personnelData && personnelData.length > 0) {
      const updatedUsers = personnelData.map((staffMember: StaffMember, index: number) => ({
        id: index + 1,
        firstName: staffMember.firstName,
        lastName: staffMember.lastName,
        email: staffMember.email,
        phone: staffMember.phone || '',
        role: staffMember.role === 'manager' ? 'admin' as const : 'staff' as const,
        lastActive: 'Recent',
        status: 'active' as const
      }))
      
      setRestaurantUsers(prev => ({
        ...prev,
        [restaurantId]: updatedUsers
      }))
    } else {
      // Clear users if no personnel data
      setRestaurantUsers(prev => ({
        ...prev,
        [restaurantId]: []
      }))
    }
  }

  // Refresh restaurant users from storage
  const refreshRestaurantUsers = (): void => {
    const newData = loadRestaurantUsersFromStorage()
    setRestaurantUsers(newData)
  }

  const value: UsersContextValue = {
    companyUsers,
    restaurantUsers,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    addRestaurantUser,
    updateRestaurantUser,
    deleteRestaurantUser,
    refreshUsers,
    authenticateUser,
    getCompanyUser,
    getRestaurantUser,
    deleteCompanyUser,
    addCompanyUser,
    updateRestaurantUsersFromOnboarding,
    refreshRestaurantUsers
  }

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}