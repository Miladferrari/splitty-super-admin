import React, { useState, useEffect, useRef, FormEvent, MutableRefObject, memo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import sendbirdSingleton from '../utils/sendbirdSingleton'
import { 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  FunnelIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

// SendBird types
interface SendBirdInstance {
  GroupChannel: {
    createMyGroupChannelListQuery(): GroupChannelListQuery
  }
  ChannelHandler: new () => ChannelHandler
  UserMessageParams: new () => UserMessageParams
  GroupChannelParams: new () => GroupChannelParams
}

interface GroupChannel {
  url: string
  name: string
  data: string
  lastMessage?: {
    message: string
    createdAt: number
  }
  unreadMessageCount: number
  markAsRead(): void
  createPreviousMessageListQuery(): MessageListQuery
  sendUserMessage(params: UserMessageParams, callback: (message: Message, error: Error | null) => void): void
  updateChannel(params: GroupChannelParams, callback: (response: GroupChannel, error: Error | null) => void): void
  getTypingMembers(): Member[]
}

interface GroupChannelListQuery {
  customTypesFilter: string[]
  includeEmpty: boolean
  limit: number
  order: string
  next(callback: (channelList: GroupChannel[], error: Error | null) => void): void
}

interface Message {
  messageId: string
  message: string
  createdAt: number
  sender: {
    userId: string
    nickname: string
  }
  customType?: string
}

interface MessageListQuery {
  limit: number
  reverse: boolean
  load(callback: (messageList: Message[], error: Error | null) => void): void
}

interface UserMessageParams {
  message: string
  customType: string
}

interface GroupChannelParams {
  data: string
}

interface ChannelHandler {
  onMessageReceived?: (targetChannel: GroupChannel, message: Message) => void
  onTypingStatusUpdated?: (targetChannel: GroupChannel) => void
  onChannelChanged?: (channel: GroupChannel) => void
}

interface Member {
  userId: string
}

interface ChannelData {
  restaurant_name?: string
  restaurantName?: string
  restaurant_id?: string
  restaurantId?: string
  status?: string
  priority?: boolean
  resolvedAt?: string
  priorityChangedAt?: string
}

interface RestaurantInfo {
  name: string
  id: string
}

interface Stats {
  total: number
  open: number
  priority: number
  resolved: number
}

type StatusFilter = 'all' | 'priority' | 'open' | 'resolved'
type ChannelStatus = 'open' | 'priority' | 'resolved'

const SendbirdSupport: React.FC = () => {
  const { user } = useAuth()
  const [sb, setSb] = useState<SendBirdInstance | null>(null)
  const [channels, setChannels] = useState<GroupChannel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<GroupChannel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelHandlerRef = useRef<ChannelHandler | null>(null)
  const refreshIntervalRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null)
  
  // Support agent ID
  const supportUserId = 'support_admin_001'
  const supportName = user?.name || 'Support Team'

  // Stats for the dashboard
  const [stats, setStats] = useState<Stats>({
    total: 0,
    open: 0,
    priority: 0,
    resolved: 0
  })

  useEffect(() => {
    let mounted = true
    
    const init = async () => {
      if (!mounted) return
      
      try {
        await initializeSendbird()
      } catch (error: Error | unknown) {
        console.error('Failed to initialize SendBird:', error)
        setError('Kon niet verbinden met chat service')
        setLoading(false)
      }
    }
    
    init()
    
    // Set up auto-refresh
    refreshIntervalRef.current = setInterval(() => {
      if (sb) {
        loadSupportChannels(sb, false)
      }
    }, 10000) // Refresh every 10 seconds
    
    return () => {
      mounted = false
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      cleanup()
    }
  }, [])

  const cleanup = (): void => {
    // Remove handler
    if (channelHandlerRef.current) {
      sendbirdSingleton.removeHandler('SUPPORT_ADMIN_HANDLER')
      channelHandlerRef.current = null
    }
  }

  const initializeSendbird = async (): Promise<void> => {
    try {
      // Connect using the global singleton
      const connectedUser = await sendbirdSingleton.connect(supportUserId, supportName)
      
      if (!connectedUser) {
        throw new Error('Could not connect to SendBird')
      }
      
      console.log('Connected to Sendbird as support:', connectedUser.userId)
      const sendbird = sendbirdSingleton.getInstance()
      
      if (!sendbird) {
        throw new Error('SendBird SDK not available')
      }
      
      setSb(sendbird)
      setConnected(true)
      
      // Load all support channels
      await loadSupportChannels(sendbird, true)
      setupGlobalMessageHandler(sendbird)
      setLoading(false)
      
    } catch (error: Error | unknown) {
      console.error('Error initializing Sendbird:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setLoading(false)
      setConnected(false)
    }
  }

  const loadSupportChannels = async (sendbird: SendBirdInstance, showLoading: boolean = true): Promise<void> => {
    if (showLoading) setLoading(true)
    
    try {
      const query = sendbird.GroupChannel.createMyGroupChannelListQuery()
      query.customTypesFilter = ['SUPPORT']
      query.includeEmpty = false
      query.limit = 100
      query.order = 'latest_last_message'

      query.next((channelList: GroupChannel[], error: Error | null) => {
        if (error) {
          console.error('Error loading channels:', error)
          setLoading(false)
          return
        }
        
        console.log('Loaded support channels:', channelList.length)
        
        // Calculate stats
        const channelStats: Stats = {
          total: channelList.length,
          open: 0,
          priority: 0,
          resolved: 0
        }

        // Filter out old closed channels and analyze the rest
        const activeChannels = channelList.filter(channel => {
          const channelData = getChannelData(channel)
          
          // Skip channels that are resolved/closed
          if (channelData.status === 'closed' || channelData.status === 'resolved') {
            channelStats.resolved++
            return false // Don't show closed channels in the list
          }
          
          // Count active channels
          if (channelData.priority === true) {
            channelStats.priority++
          } else {
            channelStats.open++
          }
          
          return true // Show this channel
        })

        setStats(channelStats)
        setChannels(activeChannels)
        setLoading(false)
        
        // If we have a selected channel, update it with the fresh data
        if (selectedChannel) {
          const updatedChannel = activeChannels.find(ch => ch.url === selectedChannel.url)
          if (updatedChannel) {
            setSelectedChannel(updatedChannel)
          } else {
            // Channel was closed, deselect it
            setSelectedChannel(null)
            setMessages([])
          }
        }
      })
    } catch (error) {
      console.error('Error creating channel query:', error)
      setLoading(false)
    }
  }

  const getChannelData = (channel: GroupChannel): ChannelData => {
    try {
      let data = channel.data
      if (typeof data === 'string' && data) {
        return JSON.parse(data)
      } else if (!data) {
        return {}
      }
      return data as ChannelData
    } catch (error) {
      return {}
    }
  }

  const getChannelStatus = (channel: GroupChannel): ChannelStatus => {
    const data = getChannelData(channel)
    if (data.status === 'closed' || data.status === 'resolved') {
      return 'resolved'
    } else if (data.priority === true) {
      return 'priority'
    } else {
      return 'open'
    }
  }

  const filteredChannels = channels.filter(channel => {
    if (statusFilter === 'all') return true
    const status = getChannelStatus(channel)
    return status === statusFilter
  })

  const selectChannel = (channel: GroupChannel): void => {
    console.log('Selecting channel:', channel.url)
    setSelectedChannel(channel)
    loadMessages(channel)
    channel.markAsRead()
    
    // Save to database
    const restaurantInfo = getRestaurantInfo(channel)
    const channelData = getChannelData(channel)
    
  }

  const loadMessages = (channel: GroupChannel): void => {
    const messageListQuery = channel.createPreviousMessageListQuery()
    messageListQuery.limit = 100
    messageListQuery.reverse = false

    messageListQuery.load((messageList: Message[], error: Error | null) => {
      if (error) {
        console.error('Error loading messages:', error)
        return
      }
      
      const reversedMessages = messageList.reverse()
      setMessages(reversedMessages)
      
      // Save messages to database
      const restaurantInfo = getRestaurantInfo(channel)
    })
  }

  const setupGlobalMessageHandler = (sendbird: SendBirdInstance): void => {
    // Remove existing handler first
    sendbirdSingleton.removeHandler('SUPPORT_ADMIN_HANDLER')
    
    const channelHandler = new sendbird.ChannelHandler()
    
    channelHandler.onMessageReceived = (targetChannel: GroupChannel, message: Message) => {
      console.log('New message received in channel:', targetChannel.url)
      
      // Refresh channels list
      loadSupportChannels(sendbird, false)
      
      // Update messages if this is the selected channel
      if (selectedChannel && targetChannel.url === selectedChannel.url) {
        setMessages(prev => {
          const newMessages = [...prev, message]
          // Save to database
          return newMessages
        })
        targetChannel.markAsRead()
      }
    }

    channelHandler.onTypingStatusUpdated = (targetChannel: GroupChannel) => {
      if (selectedChannel && targetChannel.url === selectedChannel.url) {
        const typingMembers = targetChannel.getTypingMembers()
        const restaurantTyping = typingMembers.some(member => 
          member.userId.startsWith('restaurant_')
        )
        setIsTyping(restaurantTyping)
      }
    }

    channelHandler.onChannelChanged = (channel: GroupChannel) => {
      console.log('Channel changed:', channel.url)
      // Refresh channels list
      loadSupportChannels(sendbird, false)
    }

    // Store handler reference
    channelHandlerRef.current = channelHandler
    sendbirdSingleton.addHandler('SUPPORT_ADMIN_HANDLER', channelHandler)
  }

  const sendMessage = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (!inputMessage.trim() || !selectedChannel || !sb) return

    const params = new sb.UserMessageParams()
    params.message = inputMessage
    params.customType = 'SUPPORT_REPLY'

    selectedChannel.sendUserMessage(params, (message: Message, error: Error | null) => {
      if (error) {
        console.error('Error sending message:', error)
        return
      }
      
      setMessages(prev => {
        const newMessages = [...prev, message]
        // Save to database
        return newMessages
      })
      setInputMessage('')
    })
  }

  const markAsResolved = (): void => {
    if (!selectedChannel || !sb) return
    
    // Send a system message to indicate resolution
    const params = new sb.UserMessageParams()
    params.message = '✅ Gesprek opgelost door Support Team'
    params.customType = 'SYSTEM_RESOLVED'

    selectedChannel.sendUserMessage(params, (message: Message, error: Error | null) => {
      if (error) {
        console.error('Error sending resolve message:', error)
        return
      }
      
      // Update channel metadata to mark as resolved
      const channelParams = new sb.GroupChannelParams()
      channelParams.data = JSON.stringify({
        ...getChannelData(selectedChannel),
        status: 'resolved',
        priority: false,
        resolvedAt: new Date().toISOString()
      })
      
      selectedChannel.updateChannel(channelParams, (response: GroupChannel, error: Error | null) => {
        if (error) {
          console.error('Error updating channel:', error)
          return
        }
        
        
        // Clear selected channel
        setSelectedChannel(null)
        setMessages([])
        
        // Refresh channels list
        loadSupportChannels(sb, false)
      })
    })
  }

  const togglePriority = (): void => {
    if (!selectedChannel || !sb) return
    
    const currentData = getChannelData(selectedChannel)
    const newPriority = !currentData.priority
    
    // Update channel metadata directly
    const channelParams = new sb.GroupChannelParams()
    channelParams.data = JSON.stringify({
      ...currentData,
      priority: newPriority,
      priorityChangedAt: new Date().toISOString()
    })
    
    selectedChannel.updateChannel(channelParams, (response: GroupChannel, error: Error | null) => {
      if (error) {
        console.error('Error updating channel priority:', error)
        return
      }
      
      
      // Refresh channels list
      loadSupportChannels(sb, false)
    })
  }

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (timestamp: number): string => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Zojuist'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}u`
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
  }

  const getRestaurantInfo = (channel: GroupChannel): RestaurantInfo => {
    const data = getChannelData(channel)
    return {
      name: data.restaurant_name || data.restaurantName || channel.name.replace('Support - ', ''),
      id: data.restaurant_id || data.restaurantId || 'Unknown'
    }
  }

  const refreshChannels = (): void => {
    if (sb) {
      loadSupportChannels(sb, true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Laden van support chats...</p>
        </div>
      </div>
    )
  }

  if (error || !connected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-900 font-medium mb-2">Kon niet verbinden met chat service</p>
          <p className="text-gray-600 text-sm mb-4">{error || 'Controleer je internetverbinding'}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              initializeSendbird()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Totaal</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Open</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Prioriteit</p>
              <p className="text-2xl font-bold text-red-600">{stats.priority}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Opgelost</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex h-[600px] bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Channel List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Support Gesprekken</h3>
              <button
                onClick={refreshChannels}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Vernieuwen"
              >
                <ArrowPathIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === 'all' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Alle ({channels.length})
              </button>
              <button
                onClick={() => setStatusFilter('priority')}
                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === 'priority' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Prioriteit ({stats.priority})
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredChannels.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">Geen actieve gesprekken</p>
              </div>
            ) : (
              filteredChannels.map((channel) => {
                const restaurantInfo = getRestaurantInfo(channel)
                const isSelected = selectedChannel?.url === channel.url
                const unreadCount = channel.unreadMessageCount
                const status = getChannelStatus(channel)
                
                return (
                  <button
                    key={channel.url}
                    onClick={() => selectChannel(channel)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {restaurantInfo.name}
                          </h4>
                          {channel.lastMessage && (
                            <span className="text-xs text-gray-500 ml-2">
                              {formatTime(channel.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">ID: {restaurantInfo.id}</p>
                        {channel.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {channel.lastMessage.message}
                          </p>
                        )}
                        {/* Status Badge */}
                        <div className="mt-2">
                          {status === 'priority' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              🔴 Prioriteit
                            </span>
                          )}
                        </div>
                      </div>
                      {unreadCount > 0 && (
                        <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChannel ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getRestaurantInfo(selectedChannel).name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Restaurant ID: {getRestaurantInfo(selectedChannel).id}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={togglePriority}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      getChannelData(selectedChannel).priority
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    {getChannelData(selectedChannel).priority 
                      ? '🔴 Verwijder prioriteit' 
                      : '🔴 Markeer als prioriteit'
                    }
                  </button>
                  <button
                    onClick={markAsResolved}
                    className="px-3 py-1.5 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"
                  >
                    ✅ Markeer als opgelost
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isSupport = message.sender.userId.startsWith('support_')
                  const isSystem = message.customType?.startsWith('SYSTEM') || message.customType === 'WELCOME'
                  
                  if (isSystem) {
                    return (
                      <div key={message.messageId} className="text-center">
                        <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          {message.message}
                        </span>
                      </div>
                    )
                  }
                  
                  return (
                    <div
                      key={message.messageId}
                      className={`flex ${isSupport ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isSupport ? 'order-2' : ''}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs text-gray-500 font-medium">
                            {isSupport 
                              ? (message.sender.nickname || 'Support')
                              : (message.sender.nickname || 'Restaurant')
                            }
                          </span>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isSupport
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <div className={`mt-1 text-xs text-gray-400 ${isSupport ? 'text-right' : ''}`}>
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={sendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type een bericht..."
                  className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    inputMessage.trim() 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Verstuur
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500">Selecteer een gesprek om te beginnen</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(SendbirdSupport)