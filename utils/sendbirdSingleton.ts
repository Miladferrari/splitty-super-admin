// Global SendBird singleton to ensure only ONE instance exists
import SendBird from 'sendbird'

class SendBirdSingleton {
  constructor() {
    this.sb = null
    this.APP_ID = '4690CBA2-7C41-454C-951B-886F72A250F1'
    this.initialized = false
    this.currentUserId = null
    this.handlers = new Map()
  }

  init() {
    // Only create instance once and only in browser environment
    if (!this.sb && !this.initialized && typeof window !== 'undefined') {
      console.log('[SendBird] Creating singleton instance')
      
      // Ensure fetch is available
      if (!window.fetch) {
        console.error('[SendBird] fetch is not available')
        return null
      }
      
      try {
        this.sb = new SendBird({
          appId: this.APP_ID,
          localCacheEnabled: true,
          connectionTimeout: 30000,
          websocketResponseTimeout: 30000,
          logLevel: 'error'
        })
        this.initialized = true
      } catch (error) {
        console.error('[SendBird] Error initializing:', error)
        return null
      }
    }
    return this.sb
  }

  getInstance() {
    if (typeof window === 'undefined') {
      return null
    }
    if (!this.sb) {
      return this.init()
    }
    return this.sb
  }

  async connect(userId, nickname = '') {
    const sb = this.getInstance()
    
    if (!sb) {
      throw new Error('[SendBird] SDK not initialized')
    }
    
    // Check if already connected with the same user
    if (sb.currentUser && sb.currentUser.userId === userId) {
      console.log('[SendBird] Already connected as:', userId)
      return sb.currentUser
    }

    // If connected with different user, disconnect first
    if (sb.currentUser && sb.currentUser.userId !== userId) {
      console.log('[SendBird] Switching user from', sb.currentUser.userId, 'to', userId)
      await this.disconnect()
    }

    return new Promise((resolve, reject) => {
      const connectionState = sb.getConnectionState()
      console.log('[SendBird] Current state:', connectionState)

      // If already connecting, wait
      if (connectionState === 'CONNECTING') {
        console.log('[SendBird] Connection already in progress, waiting...')
        setTimeout(() => {
          this.connect(userId, nickname).then(resolve).catch(reject)
        }, 1000)
        return
      }

      // Connect
      console.log('[SendBird] Connecting as:', userId)
      sb.connect(userId, null, (user, error) => {
        if (error) {
          console.error('[SendBird] Connection error:', error)
          reject(error)
          return
        }

        console.log('[SendBird] Connected successfully')
        this.currentUserId = userId

        // Update nickname if provided
        if (nickname) {
          sb.updateCurrentUserInfo(nickname, '', (response, error) => {
            if (error) {
              console.error('[SendBird] Error updating user info:', error)
            }
          })
        }

        resolve(user)
      })
    })
  }

  async disconnect() {
    const sb = this.getInstance()
    
    return new Promise((resolve) => {
      if (sb.getConnectionState() === 'CLOSED') {
        console.log('[SendBird] Already disconnected')
        resolve()
        return
      }

      console.log('[SendBird] Disconnecting...')
      
      // Remove all handlers before disconnecting
      this.handlers.forEach((handler, key) => {
        sb.removeChannelHandler(key)
      })
      this.handlers.clear()
      
      sb.disconnect(() => {
        console.log('[SendBird] Disconnected')
        this.currentUserId = null
        resolve()
      })
    })
  }

  addHandler(key, handler) {
    const sb = this.getInstance()
    
    // Remove existing handler with same key
    if (this.handlers.has(key)) {
      sb.removeChannelHandler(key)
    }
    
    // Add new handler
    sb.addChannelHandler(key, handler)
    this.handlers.set(key, handler)
  }

  removeHandler(key) {
    const sb = this.getInstance()
    
    if (this.handlers.has(key)) {
      sb.removeChannelHandler(key)
      this.handlers.delete(key)
    }
  }

  getConnectionState() {
    const sb = this.getInstance()
    return sb.getConnectionState()
  }

  isConnected() {
    const sb = this.getInstance()
    return sb.getConnectionState() === 'OPEN' && !!sb.currentUser
  }

  cleanup() {
    console.log('[SendBird] Cleaning up...')
    
    // Remove all handlers
    if (this.sb) {
      this.handlers.forEach((handler, key) => {
        this.sb.removeChannelHandler(key)
      })
      this.handlers.clear()
    }
    
    // Don't disconnect or destroy the instance
    // Just clean up handlers to prevent memory leaks
  }
}

// Create singleton instance
let instance = null

function getSendBirdInstance() {
  // Only create instance in browser environment
  if (typeof window === 'undefined') {
    return {
      getInstance: () => null,
      connect: () => Promise.reject(new Error('SendBird not available on server')),
      disconnect: () => Promise.resolve(),
      addHandler: () => {},
      removeHandler: () => {},
      getConnectionState: () => 'CLOSED',
      isConnected: () => false,
      cleanup: () => {}
    }
  }
  
  if (!instance) {
    instance = new SendBirdSingleton()
    
    // Store in window for development hot reload
    if (!window.__sendbirdSingleton) {
      window.__sendbirdSingleton = instance
    } else {
      instance = window.__sendbirdSingleton
    }
  }
  return instance
}

export default getSendBirdInstance()