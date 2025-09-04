import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useTranslation } from '../contexts/TranslationContext'
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const Support: NextPage = () => {
  const { t } = useTranslation()
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [supportQueue, setSupportQueue] = useState([])
  const [messages, setMessages] = useState([])

  // Load support queue from localStorage
  useEffect(() => {
    const loadSupportQueue = () => {
      const queue = JSON.parse(localStorage.getItem('splitty_support_queue') || '[]')
      setSupportQueue(queue)
      
      // Auto-select first restaurant if none selected
      if (queue.length > 0 && !selectedRestaurant) {
        setSelectedRestaurant(queue[0])
        setMessages(queue[0].messages || [])
      }
    }
    
    loadSupportQueue()
    
    // Set up interval to check for new messages
    const interval = setInterval(loadSupportQueue, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // Update messages when restaurant selection changes
  useEffect(() => {
    if (selectedRestaurant) {
      const restaurant = supportQueue.find(r => r.restaurantId === selectedRestaurant.restaurantId)
      if (restaurant) {
        setMessages(restaurant.messages || [])
        
        // Mark as read
        if (restaurant.unread) {
          restaurant.unread = false
          localStorage.setItem('splitty_support_queue', JSON.stringify(supportQueue))
        }
      }
    }
  }, [selectedRestaurant, supportQueue])

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedRestaurant) return

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'support',
      timestamp: new Date().toISOString(),
      senderName: 'Splitty Support'
    }

    // Update messages for selected restaurant
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    
    // Update support queue
    const updatedQueue = supportQueue.map(restaurant => {
      if (restaurant.restaurantId === selectedRestaurant.restaurantId) {
        return {
          ...restaurant,
          messages: updatedMessages,
          lastMessage: newMessage,
          lastMessageTime: newMessage.timestamp
        }
      }
      return restaurant
    })
    
    // Sort by most recent
    updatedQueue.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
    setSupportQueue(updatedQueue)
    localStorage.setItem('splitty_support_queue', JSON.stringify(updatedQueue))
    
    // Also update restaurant's local storage
    localStorage.setItem(`support_messages_${selectedRestaurant.restaurantName}`, JSON.stringify(updatedMessages))
    
    setMessageInput('')
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return t('support.time.now')
    if (minutes < 60) return `${minutes} ${t('support.time.minAgo')}`
    if (hours < 24) return `${hours} ${t('support.time.hoursAgo')}`
    if (days < 7) return `${days} ${t('support.time.daysAgo')}`
    
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  }

  // Filter restaurants based on search
  const filteredRestaurants = supportQueue.filter(restaurant =>
    restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Main Content */}
            <div className="flex h-[calc(100vh-100px)] -mx-4 sm:-mx-6 lg:-mx-8">
              {/* Left Sidebar - Restaurant List */}
              <div className="hidden lg:block w-full lg:w-96 flex-shrink-0 h-full overflow-y-auto border-r bg-white border-gray-200">
                <div className="p-4 lg:p-6">
                  {/* Header Section */}
                  <div className="mb-6">
              <h2 className="text-xl font-bold flex items-center text-gray-900">
                <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-green-600" />
                {t('support.title')}
              </h2>
              <p className="text-sm mt-1 text-gray-600">{t('support.subtitle')}</p>
            </div>
            
            {/* Search */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder={t('support.searchRestaurants')}
                className="block w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Stats Bar */}
            <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {filteredRestaurants.filter(r => r.unread).length > 0 && (
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {filteredRestaurants.filter(r => r.unread).length} {t('support.newMessages')}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {filteredRestaurants.length} {t('support.restaurants')}
                </span>
              </div>
            </div>

            {/* Restaurant List */}
            <nav className="space-y-2">
              {filteredRestaurants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 mb-3" />
                  <p className="text-sm">{t('support.noConversations')}</p>
                </div>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <div key={restaurant.restaurantId} className="mb-1">
                    <button
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                        selectedRestaurant?.restaurantId === restaurant.restaurantId
                          ? 'bg-green-50 text-green-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center flex-1">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-green-100 text-green-700 mr-3 flex-shrink-0">
                          {restaurant.restaurantName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-medium block">
                            {restaurant.restaurantName}
                          </span>
                          {restaurant.lastMessage && (
                            <span className="text-xs text-gray-500 truncate block mt-0.5">
                              {restaurant.lastMessage.text}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        {restaurant.unread && (
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        )}
                        <span className="text-xs text-gray-400">
                          {restaurant.lastMessageTime && formatTime(restaurant.lastMessageTime)}
                        </span>
                      </div>
                    </button>
                  </div>
                ))
              )}
            </nav>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
            {selectedRestaurant ? (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BuildingStorefrontIcon className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {selectedRestaurant.restaurantName}
                        </h2>
                        <p className="text-sm text-gray-500">{t('support.conversation')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-600">{t('support.status.active')}</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-lg ${msg.sender === 'support' ? 'order-2' : ''}`}>
                        <div className="flex items-end space-x-2">
                          {msg.sender === 'restaurant' && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-600">
                                  {selectedRestaurant.restaurantName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="flex items-baseline space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-600">
                                {msg.sender === 'restaurant' ? msg.userName || t('support.restaurant') : t('support.support')}
                              </span>
                              <span className="text-xs text-gray-400">{formatMessageTime(msg.timestamp)}</span>
                            </div>
                            <div className={`rounded-lg px-4 py-2 ${
                              msg.sender === 'support'
                                ? 'bg-green-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-900'
                            }`}>
                              <p className="text-sm">{msg.text}</p>
                            </div>
                          </div>
                          {msg.sender === 'support' && (
                            <div className="flex-shrink-0 order-first">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-green-600">SS</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={t('support.messageInput')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!messageInput.trim()}
                      className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                        messageInput.trim()
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                      <span>{t('support.sendMessage')}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Support
