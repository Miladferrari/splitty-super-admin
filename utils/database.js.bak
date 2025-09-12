// Simple localStorage-based database for the application
// This ensures data persistence and synchronization

class Database {
  constructor() {
    this.KEYS = {
      USERS: 'splitty_users',
      RESTAURANTS: 'splitty_restaurants',
      PAYOUTS: 'splitty_payouts',
    }
    
    // Initialize with default data if empty (only on client side)
    if (typeof window !== 'undefined') {
      this.initializeData()
    }
  }

  initializeData() {
    // Initialize users if not exists
    if (!this.getUsers()) {
      const defaultUsers = [
        {
          id: 1,
          name: 'Milad Azizi',
          email: 'milad@splitty.nl',
          password: 'Splitty2025!',
          phone: '+31 6 12345678',
          role: 'ceo',
          department: 'Executive',
          status: 'active',
          avatar: null,
          bio: '',
          lastLogin: new Date('2025-08-02T10:30:00').toISOString(),
          created: new Date('2025-01-15T09:00:00').toISOString(),
        },
        {
          id: 2,
          name: 'Sophie Chen',
          email: 'sophie@splitty.com',
          password: 'Welcome123!',
          phone: '+31 6 90123456',
          role: 'support',
          department: 'Customer Success',
          status: 'active',
          avatar: null,
          bio: '',
          lastLogin: new Date('2025-08-02T09:45:00').toISOString(),
          created: new Date('2025-05-01T09:00:00').toISOString(),
        },
        {
          id: 3,
          name: 'Alex van Dijk',
          email: 'alex@splitty.com',
          password: 'Admin2025!',
          phone: '+31 6 11223344',
          role: 'admin',
          department: 'Operations',
          status: 'active',
          avatar: null,
          bio: '',
          lastLogin: new Date('2025-08-01T16:30:00').toISOString(),
          created: new Date('2025-03-15T10:00:00').toISOString(),
        },
        {
          id: 4,
          name: 'Lisa Vermeer',
          email: 'lisa@splitty.com',
          password: 'Sales2025!',
          phone: '+31 6 55667788',
          role: 'account_manager',
          department: 'Sales',
          status: 'active',
          avatar: null,
          bio: '',
          lastLogin: new Date('2025-08-02T11:15:00').toISOString(),
          created: new Date('2025-04-20T09:00:00').toISOString(),
        },
        {
          id: 5,
          name: 'Mark de Boer',
          email: 'mark@splitty.com',
          password: 'Dev2025!',
          phone: '+31 6 99887766',
          role: 'developer',
          department: 'Engineering',
          status: 'active',
          avatar: null,
          bio: '',
          lastLogin: new Date('2025-08-02T08:00:00').toISOString(),
          created: new Date('2025-02-10T10:00:00').toISOString(),
        },
      ]
      this.setUsers(defaultUsers)
    }
  }

  // User methods
  getUsers() {
    try {
      if (typeof window === 'undefined') return null
      const data = localStorage.getItem(this.KEYS.USERS)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error getting users:', error)
      return null
    }
  }

  setUsers(users) {
    try {
      if (typeof window === 'undefined') return false
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users))
      return true
    } catch (error) {
      console.error('Error setting users:', error)
      return false
    }
  }

  addUser(userData) {
    const users = this.getUsers() || []
    const newUser = {
      ...userData,
      id: Math.max(...users.map(u => u.id), 0) + 1,
      status: userData.status || 'active',
      lastLogin: null,
      created: new Date().toISOString(),
      bio: userData.bio || ''
    }
    users.push(newUser)
    this.setUsers(users)
    return newUser
  }

  updateUser(userId, updates) {
    const users = this.getUsers() || []
    const index = users.findIndex(u => u.id === userId)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      this.setUsers(users)
      return users[index]
    }
    return null
  }

  deleteUser(userId) {
    const users = this.getUsers() || []
    // Filter out the user to delete (actually remove from array)
    const updatedUsers = users.filter(u => u.id !== userId)
    
    // Check if user was actually deleted
    if (users.length !== updatedUsers.length) {
      this.setUsers(updatedUsers)
      return true
    }
    return false
  }

  authenticateUser(email, password) {
    const users = this.getUsers() || []
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && 
           u.password === password &&
           u.status === 'active'
    )
    
    if (user) {
      // Update last login
      this.updateUser(user.id, { lastLogin: new Date().toISOString() })
      return user
    }
    
    return null
  }

  // Restaurant methods
  getRestaurants() {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(this.KEYS.RESTAURANTS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error getting restaurants:', error)
      return []
    }
  }

  setRestaurants(restaurants) {
    try {
      if (typeof window === 'undefined') return false
      localStorage.setItem(this.KEYS.RESTAURANTS, JSON.stringify(restaurants))
      return true
    } catch (error) {
      console.error('Error setting restaurants:', error)
      return false
    }
  }

  // Clear all data
  clearAll() {
    try {
      if (typeof window === 'undefined') return false
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      this.initializeData()
      return true
    } catch (error) {
      console.error('Error clearing data:', error)
      return false
    }
  }
}

// Create singleton instance
const db = new Database()

export default db