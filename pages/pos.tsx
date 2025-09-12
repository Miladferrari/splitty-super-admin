import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useRestaurants } from '../contexts/RestaurantsContext'
import { useTranslation } from '../contexts/TranslationContext'
import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  WifiIcon,
  ArrowPathIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  BellAlertIcon,
  SignalSlashIcon,
  SignalIcon,
  BoltIcon,
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

const POSIntegration: NextPage = () => {
  const { t } = useTranslation()
  const { restaurants } = useRestaurants()
  const [posStatuses, setPosStatuses] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(true)

  // Load POS data from localStorage for each restaurant
  useEffect(() => {
    const loadPosStatuses = () => {
      const statuses = {}
      const newNotifications = []
      
      restaurants.forEach(restaurant => {
        if (!restaurant.deleted) {
          const onboardingData = localStorage.getItem(`onboarding_${restaurant.id}`)
          if (onboardingData) {
            try {
              const parsed = JSON.parse(onboardingData)
              if (parsed.posData && parsed.posData.posType) {
                // Simulate occasional connection issues for demo
                const randomStatus = Math.random()
                const isConnected = randomStatus > 0.2 // 80% chance of being connected
                const isActive = isConnected && randomStatus > 0.3 // 70% chance of being active if connected
                
                statuses[restaurant.id] = {
                  connected: isConnected,
                  posType: parsed.posData.posType,
                  username: parsed.posData.username,
                  environment: parsed.posData.environment || 'production',
                  isActive: isActive,
                  lastSync: isConnected ? new Date().toISOString() : new Date(Date.now() - 3600000).toISOString(),
                }
                
                // Generate notifications for issues
                if (!isConnected) {
                  newNotifications.push({
                    id: `${restaurant.id}-disconnected`,
                    type: 'error',
                    title: t('pos.notifications.connectionLost'),
                    message: `${restaurant.name} - ${t('pos.notifications.systemNotReachable')}`,
                    restaurantId: restaurant.id,
                    timestamp: new Date().toISOString()
                  })
                } else if (!isActive) {
                  newNotifications.push({
                    id: `${restaurant.id}-inactive`,
                    type: 'warning',
                    title: t('pos.notifications.inactive'),
                    message: `${restaurant.name} - ${t('pos.notifications.systemInactive')}`,
                    restaurantId: restaurant.id,
                    timestamp: new Date().toISOString()
                  })
                }
              } else {
                statuses[restaurant.id] = { connected: false }
                newNotifications.push({
                  id: `${restaurant.id}-not-configured`,
                  type: 'info',
                  title: t('pos.notifications.notConfigured'),
                  message: `${restaurant.name} - ${t('pos.notifications.integrationSetup')}`,
                  restaurantId: restaurant.id,
                  timestamp: new Date().toISOString()
                })
              }
            } catch (e) {
              statuses[restaurant.id] = { connected: false }
            }
          } else {
            statuses[restaurant.id] = { connected: false }
          }
        }
      })
      
      setPosStatuses(statuses)
      setNotifications(newNotifications)
    }

    loadPosStatuses()
    
    const interval = setInterval(loadPosStatuses, 10000) // Check every 10 seconds
    
    return () => clearInterval(interval)
  }, [restaurants])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      const event = new Event('storage')
      window.dispatchEvent(event)
    }, 1000)
  }

  const activeRestaurants = restaurants.filter(r => !r.deleted)
  const connectedCount = Object.values(posStatuses).filter(s => s.connected).length
  const activeCount = Object.values(posStatuses).filter(s => s.connected && s.isActive).length

  return (
    <Layout>
      <div className={`min-h-screen ${false ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('pos.title') }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className={`text-2xl font-semibold ${false ? 'text-white' : 'text-[#111827]'} mb-1`}>
                  {t('pos.title')}
                </h1>
                <p className={`${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                  {t('pos.subtitle')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className={`inline-flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  false 
                    ? 'border border-[#2a2d3a] text-white bg-[#1c1e27] hover:bg-[#252833]'
                    : 'border border-gray-200 text-[#6B7280] bg-white hover:bg-gray-50 shadow-sm'
                } ${
                  refreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={refreshing}
              >
                <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${refreshing ? 'animate-spin' : ''} ${false ? 'text-[#BBBECC]' : 'text-gray-500'}`} />
                {refreshing ? t('pos.refreshing') : t('pos.refreshStatus')}
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className={`p-6 rounded-xl ${
                false 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={false ? "p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]" : "p-3 rounded-lg bg-green-100"}>
                    <BuildingStorefrontIcon className={false ? "h-6 w-6 text-black" : "h-6 w-6 text-green-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      {t('pos.stats.totalRestaurants')}
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${false ? 'text-white' : 'text-[#111827]'}`}>
                      {activeRestaurants.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                false 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={false ? "p-3 rounded-lg bg-emerald-500/20" : "p-3 rounded-lg bg-emerald-50"}>
                    <CpuChipIcon className={false ? "h-6 w-6 text-emerald-400" : "h-6 w-6 text-emerald-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      {t('pos.stats.connected')}
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${false ? 'text-white' : 'text-[#111827]'}`}>
                      {connectedCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                false 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={false ? "p-3 rounded-lg bg-[#2BE89A]/20" : "p-3 rounded-lg bg-green-50"}>
                    <WifiIcon className={false ? "h-6 w-6 text-[#2BE89A]" : "h-6 w-6 text-green-500"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      {t('pos.stats.active')}
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${false ? 'text-white' : 'text-[#111827]'}`}>
                      {activeCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                false 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={false ? "p-3 rounded-lg bg-red-500/20" : "p-3 rounded-lg bg-red-50"}>
                    <ExclamationTriangleIcon className={false ? "h-6 w-6 text-red-400" : "h-6 w-6 text-red-500"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      {t('pos.stats.notConnected')}
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${false ? 'text-white' : 'text-[#111827]'}`}>
                      {activeRestaurants.length - connectedCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section - Simplified */}
            {notifications.filter(n => n.type === 'error').length > 0 && showNotifications && (
              <div className={`rounded-lg ${
                false 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className={`h-5 w-5 mr-2 ${
                        false ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                      <h3 className={`text-sm font-medium ${
                        false ? 'text-white' : 'text-gray-900'
                      }`}>
                        {t('pos.attentionRequired')} ({notifications.filter(n => n.type === 'error').length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className={`p-1 rounded transition-colors ${
                        false ? 'hover:bg-[#2a2d3a]' : 'hover:bg-gray-100'
                      }`}
                    >
                      <XMarkIcon className={`h-4 w-4 ${
                        false ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.filter(n => n.type === 'error').slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between"
                      >
                        <p className={`text-sm ${false ? 'text-gray-300' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <Link
                          href={`/restaurants/${notification.restaurantId}/onboarding?step=3`}
                          className={`text-sm ${
                            false ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {t('pos.configure')} →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Restaurant POS Status List */}
            <div className={`rounded-xl overflow-hidden ${
              false 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                : 'bg-white shadow-sm'
            }`}>
              <div className={`px-6 py-4 border-b ${
                false ? 'border-[#2a2d3a] bg-[#0A0B0F]' : 'border-gray-200 bg-gray-50'
              }`}>
                <h2 className={`text-lg font-semibold ${
                  false ? 'text-white' : 'text-[#111827]'
                }`}>
                  {t('pos.restaurantStatus')}
                </h2>
              </div>

              <div className="p-4 space-y-3">
                {activeRestaurants.map((restaurant) => {
                  const posStatus = posStatuses[restaurant.id]
                  const isConnected = posStatus && posStatus.connected
                  const isActive = posStatus && posStatus.isActive
                  
                  return (
                    <div 
                      key={restaurant.id} 
                      className={`p-5 rounded-lg transition-all ${
                        !isConnected
                          ? false 
                            ? 'bg-[#0A0B0F] border border-red-500/20 hover:border-red-500/30'
                            : 'bg-white border border-red-200 hover:border-red-300'
                          : false 
                            ? 'bg-[#0A0B0F] border border-[#2a2d3a] hover:border-[#3a3d4a]'
                            : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Restaurant Logo */}
                          <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                            {restaurant.logo ? (
                              <img
                                src={restaurant.logo}
                                alt={restaurant.name}
                                className="h-full w-full object-contain p-0.5"
                              />
                            ) : (
                              <div className={`h-full w-full flex items-center justify-center ${
                                false ? 'bg-gray-700' : 'bg-gray-200'
                              }`}>
                                <BuildingStorefrontIcon className={`h-5 w-5 ${
                                  false ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                              </div>
                            )}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className={`text-sm font-medium ${
                                false ? 'text-white' : 'text-gray-900'
                              }`}>
                                {restaurant.name}
                              </h3>
                              {posStatus && posStatus.connected && (
                                <span className={`text-xs ${false ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {posStatus.posType}
                                </span>
                              )}
                            </div>
                            <p className={`text-xs mt-1 ${false ? 'text-gray-400' : 'text-gray-500'}`}>
                              {restaurant.location}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {/* Status */}
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            isConnected && isActive
                              ? false ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700'
                              : !isConnected
                              ? false ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
                              : false ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {isConnected && isActive ? (
                              <>
                                <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                                {t('pos.status.active')}
                              </>
                            ) : !isConnected ? (
                              <>
                                <XCircleIcon className="h-3.5 w-3.5 mr-1" />
                                {t('pos.status.notConnected')}
                              </>
                            ) : (
                              <>
                                <ClockIcon className="h-3.5 w-3.5 mr-1" />
                                {t('pos.status.inactive')}
                              </>
                            )}
                          </span>
                          
                          {/* Action */}
                          <Link
                            href={isConnected 
                              ? `/restaurants/${restaurant.id}` 
                              : `/restaurants/${restaurant.id}/onboarding?step=3`
                            }
                            className={`text-sm font-medium ${
                              !isConnected
                                ? false ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                                : false ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                            }`}
                          >
                            {!isConnected ? `${t('pos.configure')} →` : `${t('pos.details')} →`}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Empty State */}
            {activeRestaurants.length === 0 && (
              <div className={`text-center py-16 rounded-xl ${
                false 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <BuildingStorefrontIcon className={`mx-auto h-12 w-12 ${
                  false ? 'text-[#BBBECC]' : 'text-gray-400'
                }`} />
                <h3 className={`mt-4 text-base font-medium ${
                  false ? 'text-white' : 'text-[#111827]'
                }`}>
                  {t('pos.noActiveRestaurants')}
                </h3>
                <p className={`mt-2 text-sm ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                  {t('pos.addFirstRestaurant')}
                </p>
                <Link
                  href="/restaurants/new"
                  className="mt-6 inline-flex items-center px-4 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all"
                >
                  <BuildingStorefrontIcon className="mr-2 h-5 w-5" />
                  {t('pos.addRestaurant')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default POSIntegration
