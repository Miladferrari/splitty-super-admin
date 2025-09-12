import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useRestaurants } from '../contexts/RestaurantsContext'
import { useTranslation } from '../contexts/TranslationContext'
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyEuroIcon,
  BuildingStorefrontIcon,
  HashtagIcon,
  CalendarIcon,
  FunnelIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline'

const Orders: NextPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [restaurantFilter, setRestaurantFilter] = useState('all')
  const { restaurants } = useRestaurants()

  // Static Splitty transactions data - all platform payments
  const staticTransactions = [
    // Most recent transactions
    { id: '1078', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 12', total: 45.50, paid: 45.50, remaining: 0, guests: 2, paidGuests: 2, status: 'completed', created: new Date(Date.now() - 5 * 60000), paymentMethod: 'splitty' },
    { id: '1077', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 8', total: 23.75, paid: 23.75, remaining: 0, guests: 3, paidGuests: 3, status: 'completed', created: new Date(Date.now() - 12 * 60000), paymentMethod: 'splitty' },
    { id: '1076', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 15', total: 67.80, paid: 20.34, remaining: 47.46, guests: 4, paidGuests: 1, status: 'in_progress', created: new Date(Date.now() - 18 * 60000), paymentMethod: 'splitty' },
    { id: '1075', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 3', total: 34.20, paid: 34.20, remaining: 0, guests: 2, paidGuests: 2, status: 'completed', created: new Date(Date.now() - 25 * 60000), paymentMethod: 'splitty' },
    { id: '1074', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 22', total: 89.90, paid: 89.90, remaining: 0, guests: 3, paidGuests: 3, status: 'completed', created: new Date(Date.now() - 32 * 60000), paymentMethod: 'splitty' },
    // More transactions from Splitty restaurant
    { id: '2001', restaurant: 'Splitty', restaurantId: 17, table: 'Tafel 5', total: 156.80, paid: 78.40, remaining: 78.40, guests: 6, paidGuests: 3, status: 'in_progress', created: new Date(Date.now() - 45 * 60000), paymentMethod: 'splitty' },
    { id: '2002', restaurant: 'Splitty', restaurantId: 17, table: 'Tafel 7', total: 92.45, paid: 92.45, remaining: 0, guests: 4, paidGuests: 4, status: 'completed', created: new Date(Date.now() - 1.2 * 3600000), paymentMethod: 'splitty' },
    { id: '1073', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 19', total: 185.90, paid: 52.33, remaining: 133.57, guests: 4, paidGuests: 1, status: 'in_progress', created: new Date(Date.now() - 1.5 * 3600000), paymentMethod: 'splitty' },
    { id: '2003', restaurant: 'Splitty', restaurantId: 17, table: 'Tafel 11', total: 67.30, paid: 67.30, remaining: 0, guests: 3, paidGuests: 3, status: 'completed', created: new Date(Date.now() - 2 * 3600000), paymentMethod: 'splitty' },
    { id: '1072', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 6', total: 123.75, paid: 123.75, remaining: 0, guests: 5, paidGuests: 5, status: 'completed', created: new Date(Date.now() - 2.5 * 3600000), paymentMethod: 'splitty' },
    // Older transactions
    { id: '2004', restaurant: 'Splitty', restaurantId: 17, table: 'Tafel 2', total: 45.60, paid: 15.20, remaining: 30.40, guests: 3, paidGuests: 1, status: 'in_progress', created: new Date(Date.now() - 3 * 3600000), paymentMethod: 'splitty' },
    { id: '1071', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 14', total: 78.90, paid: 78.90, remaining: 0, guests: 2, paidGuests: 2, status: 'completed', created: new Date(Date.now() - 3.5 * 3600000), paymentMethod: 'splitty' },
    { id: '2005', restaurant: 'Splitty', restaurantId: 17, table: 'Tafel 9', total: 234.50, paid: 234.50, remaining: 0, guests: 8, paidGuests: 8, status: 'completed', created: new Date(Date.now() - 4 * 3600000), paymentMethod: 'splitty' },
    { id: '1070', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 1', total: 56.20, paid: 28.10, remaining: 28.10, guests: 2, paidGuests: 1, status: 'in_progress', created: new Date(Date.now() - 5 * 3600000), paymentMethod: 'splitty' },
    { id: '2006', restaurant: 'Splitty', restaurantId: 17, table: 'Tafel 15', total: 189.75, paid: 189.75, remaining: 0, guests: 6, paidGuests: 6, status: 'completed', created: new Date(Date.now() - 6 * 3600000), paymentMethod: 'splitty' },
    { id: '1069', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 18', total: 112.40, paid: 112.40, remaining: 0, guests: 4, paidGuests: 4, status: 'completed', created: new Date(Date.now() - 7 * 3600000), paymentMethod: 'splitty' },
    { id: '2007', restaurant: 'Splitty', restaurantId: 17, table: 'Tafel 3', total: 76.80, paid: 38.40, remaining: 38.40, guests: 4, paidGuests: 2, status: 'in_progress', created: new Date(Date.now() - 8 * 3600000), paymentMethod: 'splitty' },
    { id: '1068', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 10', total: 145.30, paid: 145.30, remaining: 0, guests: 5, paidGuests: 5, status: 'completed', created: new Date(Date.now() - 9 * 3600000), paymentMethod: 'splitty' },
    { id: '2008', restaurant: 'Splitty', restaurantId: 17, table: 'Tafel 12', total: 98.60, paid: 98.60, remaining: 0, guests: 3, paidGuests: 3, status: 'completed', created: new Date(Date.now() - 10 * 3600000), paymentMethod: 'splitty' },
    { id: '1067', restaurant: 'Limon B.V.', restaurantId: 16, table: 'Tafel 4', total: 201.50, paid: 100.75, remaining: 100.75, guests: 6, paidGuests: 3, status: 'in_progress', created: new Date(Date.now() - 11 * 3600000), paymentMethod: 'splitty' },
  ]
  
  const orders = staticTransactions

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && order.status === 'in_progress') ||
      (statusFilter === 'completed' && order.status === 'completed')
    
    const matchesRestaurant =
      restaurantFilter === 'all' || order.restaurantId === parseInt(restaurantFilter)
    
    return matchesSearch && matchesStatus && matchesRestaurant
  })

  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2)}`
  }

  const formatDate = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} ${t('common.time')} ${t('common.ago')}`
    if (diffHours < 24) return `${diffHours} ${t('common.hours')} ${t('common.ago')}`
    if (diffDays < 7) return `${diffDays} ${t('common.days')} ${t('common.ago')}`
    
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  const getStatusBadge = (status, remaining, total) => {
    const progress = ((total - remaining) / total) * 100
    
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          <CheckCircleIcon className="h-4 w-4 mr-1.5" />
          {t('orders.status.completed')}
        </span>
      )
    }
    
    return (
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
          <ClockIcon className="h-4 w-4 mr-1.5" />
          {t('orders.status.pending')}
        </span>
        <div className="w-20 rounded-full h-2 bg-gray-200">
          <div 
            className="h-2 rounded-full transition-all duration-300 bg-green-600"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">{Math.round(progress)}%</span>
      </div>
    )
  }

  const handleRefresh = () => {
    // Force re-render by updating state
    setSearchQuery('')
    setStatusFilter('all')
    setRestaurantFilter('all')
    
    // Simulate data refresh
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const handleExport = () => {
    console.log('Exporting orders...')
  }

  const activeCount = orders.filter(o => o.status === 'in_progress').length
  const completedCount = orders.filter(o => o.status === 'completed').length
  const totalRevenue = orders.reduce((sum, order) => sum + order.paid, 0)
  const todayTransactions = orders.filter(o => {
    const today = new Date()
    return o.created.toDateString() === today.toDateString()
  }).length
  // Calculate transaction revenue (€0.70 per split payment)
  const todayTransactionRevenue = todayTransactions * 0.70

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('orders.title') }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-[#111827] mb-1">
                  {t('orders.title')}
                </h1>
                <p className="text-[#6B7280]">
                  {t('orders.subtitle')}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2.5 rounded-lg transition-all border border-gray-200 text-[#6B7280] bg-white hover:bg-gray-50 shadow-sm"
                >
                  <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  {t('common.refresh')}
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2.5 font-medium rounded-lg transition bg-green-600 text-white hover:bg-green-700 shadow-sm"
                >
                  <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                  {t('common.export')}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">{t('orders.extra.activeOrders')}</p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">{activeCount}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">{t('orders.stats.todayOrders')}</p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">{todayTransactions}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <UserGroupIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">{t('orders.stats.totalVolume')}</p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">{formatCurrency(totalRevenue)}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <CurrencyEuroIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">{t('orders.extra.transactionRevenue')}</p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">{formatCurrency(todayTransactionRevenue)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className={`p-6 rounded-xl ${
              false 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                : 'bg-white shadow-sm'
            }`}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-12 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition bg-[#F9FAFB] border-gray-200 text-[#111827] placeholder-gray-500 focus:ring-green-500 focus:border-transparent hover:border-gray-300"
                      placeholder={t('orders.search')}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={restaurantFilter}
                    onChange={(e) => setRestaurantFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition bg-[#F9FAFB] border-gray-200 text-[#111827] focus:ring-green-500 focus:border-transparent hover:border-gray-300"
                  >
                    <option value="all">{t('orders.filters.allRestaurants')}</option>
                    {restaurants.filter(r => !r.deleted).map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex rounded-lg p-1 bg-gray-100">
                    {[
                      { value: 'active', label: t('orders.filters.active') },
                      { value: 'completed', label: t('orders.filters.completed') },
                      { value: 'all', label: t('orders.filters.all') },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStatusFilter(option.value)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          statusFilter === option.value
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('orders.table.orderId')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('orders.table.restaurant')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('orders.table.table')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('orders.table.status')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('orders.table.amount')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('common.payment')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('orders.table.date')}
                      </th>
                      <th className="relative px-6 py-4">
                        <span className="sr-only">{t('orders.table.actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.restaurant}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.table}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : order.status === 'in_progress'
                              ? 'bg-orange-100 text-orange-800 border-orange-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                            {order.status === 'completed' ? t('orders.status.completed') : order.status === 'in_progress' ? t('orders.status.pending') : t('orders.status.cancelled')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{formatCurrency(order.paid)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="h-4 w-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>
                            <span className="ml-2 capitalize">{order.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.created.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex gap-2 justify-end">
                            <Link
                              href={`/restaurants/${order.restaurantId}/orders/ORD-2025-${order.id}`}
                              className="text-green-600 hover:text-green-700 text-xs font-medium"
                            >
                              {t('common.order')}
                            </Link>
                            <span className="text-gray-300 text-xs">|</span>
                            <Link
                              href={`/restaurants/${order.restaurantId}/payments/PAY-2025-${order.id}`}
                              className="text-green-600 hover:text-green-700 text-xs font-medium"
                            >
                              {t('common.payment')}
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              {filteredOrders.length > 0 && (
                <div className="px-6 py-4 border-t bg-gray-50 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{filteredOrders.length}</span> {t('orders.foundResults')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="text-center py-16 rounded-xl bg-white shadow-sm">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 text-gray-900">{t('orders.noResults')}</h3>
                <p className="text-gray-600">{t('orders.adjustFilters')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Orders
