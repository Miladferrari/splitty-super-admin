import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import { useRestaurants } from '../../../contexts/RestaurantsContext'
import { useTranslation } from '../../../contexts/TranslationContext'
import {
  ArrowLeftIcon,
  TableCellsIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyEuroIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'

const RestaurantTables: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { restaurants } = useRestaurants()
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Find the restaurant
  const restaurant = restaurants?.find(r => r.id === parseInt(id))
  
  // Static mock tables data - no random generation
  const staticTables = [
    // Occupied tables (always appear first due to sorting)
    { id: 8, number: 8, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1008', amount: '53.06', startTime: new Date(Date.now() - 35 * 60000).toISOString(), guests: 4 }},
    { id: 9, number: 9, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1009', amount: '132.96', startTime: new Date(Date.now() - 75 * 60000).toISOString(), guests: 7 }},
    { id: 10, number: 10, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1010', amount: '167.97', startTime: new Date(Date.now() - 107 * 60000).toISOString(), guests: 3 }},
    { id: 11, number: 11, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1011', amount: '68.50', startTime: new Date(Date.now() - 111 * 60000).toISOString(), guests: 5 }},
    { id: 16, number: 16, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1016', amount: '143.59', startTime: new Date(Date.now() - 1 * 60000).toISOString(), guests: 4 }},
    { id: 17, number: 17, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1017', amount: '83.64', startTime: new Date(Date.now() - 117 * 60000).toISOString(), guests: 7 }},
    { id: 18, number: 18, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1018', amount: '152.58', startTime: new Date(Date.now() - 84 * 60000).toISOString(), guests: 7 }},
    { id: 20, number: 20, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1020', amount: '163.47', startTime: new Date(Date.now() - 50 * 60000).toISOString(), guests: 2 }},
    { id: 23, number: 23, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1023', amount: '153.98', startTime: new Date(Date.now() - 18 * 60000).toISOString(), guests: 5 }},
    { id: 25, number: 25, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1025', amount: '146.97', startTime: new Date(Date.now() - 119 * 60000).toISOString(), guests: 7 }},
    { id: 26, number: 26, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1026', amount: '47.00', startTime: new Date(Date.now() - 108 * 60000).toISOString(), guests: 2 }},
    { id: 27, number: 27, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1027', amount: '56.11', startTime: new Date(Date.now() - 24 * 60000).toISOString(), guests: 5 }},
    { id: 28, number: 28, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1028', amount: '31.74', startTime: new Date(Date.now() - 83 * 60000).toISOString(), guests: 7 }},
    { id: 29, number: 29, status: 'bezet', currentOrder: { orderId: 'ORD-2025-1029', amount: '45.69', startTime: new Date(Date.now() - 97 * 60000).toISOString(), guests: 7 }},
    // Empty tables
    { id: 1, number: 1, status: 'leeg', currentOrder: null },
    { id: 2, number: 2, status: 'leeg', currentOrder: null },
    { id: 3, number: 3, status: 'leeg', currentOrder: null },
    { id: 4, number: 4, status: 'leeg', currentOrder: null },
    { id: 5, number: 5, status: 'leeg', currentOrder: null },
    { id: 6, number: 6, status: 'leeg', currentOrder: null },
    { id: 7, number: 7, status: 'leeg', currentOrder: null },
    { id: 12, number: 12, status: 'leeg', currentOrder: null },
    { id: 13, number: 13, status: 'leeg', currentOrder: null },
    { id: 14, number: 14, status: 'leeg', currentOrder: null },
    { id: 15, number: 15, status: 'leeg', currentOrder: null },
    { id: 19, number: 19, status: 'leeg', currentOrder: null },
    { id: 21, number: 21, status: 'leeg', currentOrder: null },
    { id: 22, number: 22, status: 'leeg', currentOrder: null },
    { id: 24, number: 24, status: 'leeg', currentOrder: null },
    { id: 30, number: 30, status: 'leeg', currentOrder: null },
  ]
  
  const [tables, setTables] = useState(staticTables)
  
  const filteredTables = tables.filter(table => {
    const matchesSearch = table.number.toString().includes(searchTerm) ||
                         table.currentOrder?.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || table.status === filterStatus
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    // Sort occupied tables (bezet) first, then empty tables (leeg)
    if (a.status === 'bezet' && b.status === 'leeg') return -1
    if (a.status === 'leeg' && b.status === 'bezet') return 1
    // If same status, sort by table number
    return a.number - b.number
  })
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'leeg':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'bezet':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'leeg':
        return <CheckCircleIcon className="h-5 w-5" />
      case 'bezet':
        return <UserGroupIcon className="h-5 w-5" />
      default:
        return null
    }
  }
  
  const getStatusText = (status) => {
    switch (status) {
      case 'leeg':
        return t('tables.restaurant.filters.empty')
      case 'bezet':
        return t('tables.restaurant.filters.occupied')
      default:
        return status
    }
  }
  
  const calculateDuration = (startTime) => {
    const start = new Date(startTime)
    const now = new Date()
    const diff = now - start
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    
    if (hours > 0) {
      return `${hours}u ${minutes}m`
    }
    return `${minutes}m`
  }
  
  // Loading states
  if (!id || !restaurants) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    )
  }

  if (!restaurant) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Restaurant not found</h2>
            <Link href="/restaurants" className="mt-4 inline-flex items-center text-green-600 hover:text-green-700">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to restaurants
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // Calculate statistics
  const stats = {
    total: tables.length,
    leeg: tables.filter(t => t.status === 'leeg').length,
    bezet: tables.filter(t => t.status === 'bezet').length,
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="mb-5" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1 text-sm">
                <li>
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    <HomeIcon className="h-4 w-4" />
                    <span className="sr-only">Dashboard</span>
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <Link href="/restaurants" className="ml-1 text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    Restaurants
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <Link href={`/restaurants/${id}`} className="ml-1 text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    {restaurant.name}
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span className="ml-1 font-medium text-gray-900" aria-current="page">
                    {t('tables.restaurant.breadcrumb')}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Back Button */}
            <Link
              href={`/restaurants/${id}`}
              className="inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium mb-6 group bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-100 hover:border-green-300"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('tables.restaurant.backTo', { restaurant: restaurant.name })}
            </Link>
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">{t('tables.restaurant.title')}</h1>
                <p className="text-gray-600">{t('tables.restaurant.subtitle', { restaurant: restaurant.name })}</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">{t('tables.restaurant.stats.totalTables')}</p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">{stats.total}</p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">{t('tables.restaurant.stats.empty')}</p>
                <p className="text-2xl font-semibold mt-1 text-green-600">{stats.leeg}</p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">{t('tables.restaurant.stats.occupied')}</p>
                <p className="text-2xl font-semibold mt-1 text-red-600">{stats.bezet}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder={t('tables.restaurant.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('tables.restaurant.filters.all')}
                </button>
                <button
                  onClick={() => setFilterStatus('leeg')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    filterStatus === 'leeg'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('tables.restaurant.filters.empty')}
                </button>
                <button
                  onClick={() => setFilterStatus('bezet')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    filterStatus === 'bezet'
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('tables.restaurant.filters.occupied')}
                </button>
              </div>
            </div>

            {/* Occupied Tables Section */}
            {filteredTables.filter(t => t.status === 'bezet').length > 0 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('tables.restaurant.sections.occupied')}</h2>
                  <p className="text-sm text-gray-500">{t('tables.restaurant.sections.occupiedDesc')}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredTables.filter(t => t.status === 'bezet').map((table) => (
                <div
                  key={table.id}
                  className="rounded-lg p-4 transition-all duration-200 bg-white border border-gray-200 hover:border-green-500/50 hover:shadow-md cursor-pointer"
                >
                  {table.status === 'bezet' && table.currentOrder ? (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-[#111827]">{t('tables.restaurant.card.table')} {table.number}</h4>
                          <p className="text-xs text-[#6B7280]">{table.currentOrder.guests || 2} {t('tables.restaurant.card.guests')}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                          {t('tables.restaurant.card.occupied')}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">{t('tables.restaurant.card.order')}</span>
                          <span className="font-medium text-[#111827]">{table.currentOrder.orderId.split('-')[2]}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">{t('tables.restaurant.card.amount')}</span>
                          <span className="font-medium text-[#111827]">€{table.currentOrder.amount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">{t('tables.restaurant.card.paid')}</span>
                          <span className="text-green-500 font-medium">€{(parseFloat(table.currentOrder.amount) * 0.3).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">{t('tables.restaurant.card.duration')}</span>
                          <span className="flex items-center text-[#111827]">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {calculateDuration(table.currentOrder.startTime)}
                          </span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/restaurants/${id}/orders/${table.currentOrder.orderId}`}
                        className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg transition bg-gray-50 text-green-600 hover:bg-gray-100 border border-gray-200 mb-2"
                      >
                        {t('tables.restaurant.card.viewDetails')}
                      </Link>
                      
                      <a 
                        href={`https://c.splitty.nl/${id}/${1000 + table.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg transition bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      >
                        {t('tables.restaurant.card.openLink')}
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-[#111827]">{t('tables.restaurant.card.table')} {table.number}</h4>
                          <p className="text-xs text-[#6B7280]">{t('tables.restaurant.card.available')}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {t('tables.restaurant.card.empty')}
                        </span>
                      </div>
                      
                      <div className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                          <CheckCircleIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">{t('tables.restaurant.card.readyForGuests')}</p>
                        <p className="text-xs text-gray-400 mt-1">{t('tables.restaurant.card.waitingForOrder')}</p>
                      </div>
                      
                      <a 
                        href={`https://c.splitty.nl/${id}/${1000 + table.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg transition bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      >
                        {t('tables.restaurant.card.openLink')}
                      </a>
                    </>
                  )}
                </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty Tables Section */}
            {filteredTables.filter(t => t.status === 'leeg').length > 0 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('tables.restaurant.sections.empty')}</h2>
                  <p className="text-sm text-gray-500">{t('tables.restaurant.sections.emptyDesc')}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredTables.filter(t => t.status === 'leeg').map((table) => (
                    <div
                      key={table.id}
                      className="rounded-lg p-4 transition-all duration-200 bg-white border border-gray-200 hover:border-green-500/50 hover:shadow-md cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-[#111827]">{t('tables.restaurant.card.table')} {table.number}</h4>
                          <p className="text-xs text-[#6B7280]">{t('tables.restaurant.card.available')}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {t('tables.restaurant.card.empty')}
                        </span>
                      </div>
                      
                      <div className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                          <CheckCircleIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">{t('tables.restaurant.card.readyForGuests')}</p>
                        <p className="text-xs text-gray-400 mt-1">{t('tables.restaurant.card.waitingForOrder')}</p>
                      </div>
                      
                      <a 
                        href={`https://c.splitty.nl/${id}/${1000 + table.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg transition bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      >
                        {t('tables.restaurant.card.openLink')}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredTables.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <TableCellsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('tables.emptyState.noTables')}</h3>
                <p className="text-gray-600">{t('tables.emptyState.adjustSearch')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default RestaurantTables
