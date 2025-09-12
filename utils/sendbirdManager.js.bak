// Singleton SendBird instance manager to prevent multiple connections
import SendBird from 'sendbird'

class SendBirdManager {
  constructor() {
    this.instance = null
    this.isConnecting = false
    this.isConnected = false
    this.connectionPromise = null
    this.APP_ID = '4690CBA2-7C41-454C-951B-886F72A250F1'
    this.lastRequestTime = {}
    this.requestQueue = []
    this.minRequestInterval = 1000 // Minimum 1 second between similar requests
  }

  getInstance() {
    if (!this.instance) {
      console.log('Creating new SendBird instance')
      this.instance = new SendBird({
        appId: this.APP_ID,
        localCacheEnabled: true,
        connectionTimeout: 30000,
        websocketResponseTimeout: 30000,
        logLevel: 'error', // Reduce log noise
        // Add rate limiting configuration
        maxRequestRate: 3, // Max 3 requests per second
        requestInterval: 1000 // 1 second interval
      })
    }
    return this.instance
  }

  async connect(userId, nickname = '') {
    // Rate limit check
    const now = Date.now()
    const lastConnect = this.lastRequestTime['connect'] || 0
    if (now - lastConnect < this.minRequestInterval) {
      console.log('Connection rate limited, waiting...')
      await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - (now - lastConnect)))
    }
    this.lastRequestTime['connect'] = Date.now()
    
    // If already connected with same user, return existing connection
    if (this.isConnected && this.instance) {
      const currentUser = this.instance.currentUser
      if (currentUser && currentUser.userId === userId) {
        console.log('Already connected as:', userId)
        return currentUser
      }
    }

    // If currently connecting, wait for that connection
    if (this.isConnecting && this.connectionPromise) {
      console.log('Connection in progress, waiting...')
      return this.connectionPromise
    }

    // Start new connection
    this.isConnecting = true
    this.connectionPromise = this._performConnection(userId, nickname)
    
    try {
      const user = await this.connectionPromise
      this.isConnected = true
      return user
    } finally {
      this.isConnecting = false
      this.connectionPromise = null
    }
  }

  async _performConnection(userId, nickname) {
    return new Promise((resolve, reject) => {
      const sb = this.getInstance()
      
      // Check current connection state
      const currentState = sb.getConnectionState()
      console.log('Current connection state:', currentState)
      
      if (currentState === 'OPEN' && sb.currentUser && sb.currentUser.userId === userId) {
        console.log('Already connected, reusing connection')
        resolve(sb.currentUser)
        return
      }

      // Disconnect first if needed
      if (currentState !== 'CLOSED') {
        console.log('Disconnecting existing connection...')
        sb.disconnect(() => {
          this._connectUser(sb, userId, nickname, resolve, reject)
        })
      } else {
        this._connectUser(sb, userId, nickname, resolve, reject)
      }
    })
  }

  _connectUser(sb, userId, nickname, resolve, reject) {
    console.log('Connecting as:', userId)
    
    // Set a timeout for the connection
    const connectionTimeout = setTimeout(() => {
      console.error('Connection timeout after 30 seconds')
      reject(new Error('Connection timeout'))
    }, 30000)

    sb.connect(userId, null, (user, error) => {
      clearTimeout(connectionTimeout)
      
      if (error) {
        console.error('SendBird connection error:', error)
        this.isConnected = false
        
        // Check if it's a retryable error
        if (error.code === 800000 || error.code === 800170 || 
            error.message?.includes('no ack') || 
            error.message?.includes('timeout')) {
          // Don't retry here, let the component handle it
          reject(error)
        } else {
          reject(error)
        }
        return
      }

      console.log('Successfully connected as:', user.userId)
      
      // Update nickname if provided
      if (nickname) {
        sb.updateCurrentUserInfo(nickname, '', (response, error) => {
          if (error) {
            console.error('Error updating user info:', error)
          }
        })
      }
      
      resolve(user)
    })
  }

  disconnect() {
    if (!this.instance) return Promise.resolve()
    
    return new Promise((resolve) => {
      const sb = this.instance
      if (sb.getConnectionState() === 'CLOSED') {
        this.isConnected = false
        resolve()
        return
      }
      
      sb.disconnect(() => {
        console.log('Disconnected from SendBird')
        this.isConnected = false
        resolve()
      })
    })
  }

  getConnectionState() {
    if (!this.instance) return 'CLOSED'
    return this.instance.getConnectionState()
  }

  isUserConnected() {
    if (!this.instance) return false
    return this.instance.getConnectionState() === 'OPEN' && !!this.instance.currentUser
  }

  // Rate limited API call wrapper
  async rateLimitedCall(key, callback) {
    const now = Date.now()
    const lastCall = this.lastRequestTime[key] || 0
    
    if (now - lastCall < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - (now - lastCall)
      console.log(`Rate limiting ${key}, waiting ${waitTime}ms`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastRequestTime[key] = Date.now()
    return callback()
  }
  
  reset() {
    console.log('Resetting SendBird manager')
    this.disconnect()
    this.instance = null
    this.isConnecting = false
    this.isConnected = false
    this.connectionPromise = null
    this.lastRequestTime = {}
    this.requestQueue = []
  }
}

// Export singleton instance
const sendbirdManager = new SendBirdManager()

// Prevent multiple instances in development hot reload
if (typeof window !== 'undefined') {
  if (!window.__sendbirdManager) {
    window.__sendbirdManager = sendbirdManager
  }
  module.exports = window.__sendbirdManager
} else {
  module.exports = sendbirdManager
}

export default sendbirdManager