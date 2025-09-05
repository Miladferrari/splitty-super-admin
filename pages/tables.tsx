import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useRestaurants } from '../contexts/RestaurantsContext'
import { useTranslation } from '../contexts/TranslationContext'
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  TableCellsIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const Tables: NextPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const { restaurants } = useRestaurants()

  // Generate active tables for each restaurant
  const generateActiveTables = () => {
    const tables = []
    const activeRestaurants = restaurants.filter(r => !r.deleted)
    
    activeRestaurants.forEach(restaurant => {
      // Generate random number of active tables per restaurant
      const numActiveTables = Math.floor(Math.random() * 8) + 2
      
      for (let i = 0; i < numActiveTables; i++) {
        const tableNumber = Math.floor(Math.random() * 50) + 1
        const guests = Math.floor(Math.random() * 8) + 1
        const amount = Math.floor(Math.random() * 300) + 20 + Math.random()
        const paidPercentage = Math.random()
        const remaining = amount * (1 - paidPercentage)
        const durationMinutes = Math.floor(Math.random() * 180) + 15
        const durationHours = Math.floor(durationMinutes / 60)
        const durationMins = durationMinutes % 60
        
        tables.push({
          id: `T-${restaurant.id}-${tableNumber}`,
          restaurant: restaurant.name,
          restaurantId: restaurant.id,
          tableNumber: tableNumber.toString(),
          guests: guests,
          orderId: Math.floor(Math.random() * 1000) + 100,
          amount: amount,
          remaining: remaining,
          duration: durationHours > 0 ? `${durationHours}h ${durationMins}m` : `${durationMins}m`,
          status: 'active',
          lastActivity: new Date(Date.now() - durationMinutes * 60 * 1000),
        })
      }
    })
    
    return tables
  }
  
  const activeTables = generateActiveTables()
  
  // Group tables by restaurant
  const tablesByRestaurant = activeTables.reduce((acc, table) => {
    if (!acc[table.restaurantId]) {
      acc[table.restaurantId] = {
        restaurant: table.restaurant,
        restaurantId: table.restaurantId,
        tables: []
      }
    }
    acc[table.restaurantId].tables.push(table)
    return acc
  }, {})
  
  const oldActiveTables = [
    {
      id: 'T-1001',
      restaurant: 'Limon B.V.',
      tableNumber: '1001',
      guests: 4,
      orderId: 330,
      amount: 147.15,
      remaining: 136.85,
      duration: '2h 15m',
      status: 'active',
      lastActivity: new Date('2025-07-15T13:38:00'),
    },
    {
      id: 'T-1002',
      restaurant: 'Limon B.V.',
      tableNumber: '1002',
      guests: 2,
      orderId: 295,
      amount: 63.6,
      remaining: 63.6,
      duration: '45m',
      status: 'active',
      lastActivity: new Date('2025-07-04T09:32:00'),
    },
    {
      id: 'T-806',
      restaurant: 'Limon B.V.',
      tableNumber: '806',
      guests: 8,
      orderId: 296,
      amount: 480.10,
      remaining: 480.10,
      duration: '1h 30m',
      status: 'active',
      lastActivity: new Date('2025-07-04T09:45:00'),
    },
    {
      id: 'T-808',
      restaurant: 'Limon B.V.',
      tableNumber: '808',
      guests: 6,
      orderId: 176,
      amount: 141.5,
      remaining: 119.0,
      duration: '3h 10m',
      status: 'active',
      lastActivity: new Date('2025-05-25T23:21:00'),
    },
    {
      id: 'T-811',
      restaurant: 'Limon B.V.',
      tableNumber: '811',
      guests: 3,
      orderId: 231,
      amount: 67.8,
      remaining: 67.8,
      duration: '1h 05m',
      status: 'active',
      lastActivity: new Date('2025-06-24T13:45:00'),
    },
    {
      id: 'T-324',
      restaurant: 'Limon B.V.',
      tableNumber: '324',
      guests: 12,
      orderId: 334,
      amount: 439.50,
      remaining: 439.50,
      duration: '2h 45m',
      status: 'active',
      lastActivity: new Date('2025-07-30T16:29:00'),
    },
    {
      id: 'T-412',
      restaurant: 'Limon B.V.',
      tableNumber: '412',
      guests: 5,
      orderId: 339,
      amount: 176.20,
      remaining: 151.50,
      duration: '1h 20m',
      status: 'active',
      lastActivity: new Date('2025-07-30T20:17:00'),
    },
    {
      id: 'T-222',
      restaurant: 'Limon B.V.',
      tableNumber: '222',
      guests: 2,
      orderId: 340,
      amount: 30.0,
      remaining: 30.0,
      duration: '30m',
      status: 'active',
      lastActivity: new Date('2025-07-30T21:49:00'),
    },
    {
      id: 'T-6',
      restaurant: 'Anatolii Restaurant',
      tableNumber: '6',
      guests: 4,
      orderId: 341,
      amount: 48.8,
      remaining: 48.8,
      duration: '50m',
      status: 'active',
      lastActivity: new Date('2025-07-31T00:42:00'),
    },
    {
      id: 'T-8',
      restaurant: 'Anatolii Restaurant',
      tableNumber: '8',
      guests: 3,
      orderId: 345,
      amount: 48.8,
      remaining: 48.8,
      duration: '25m',
      status: 'active',
      lastActivity: new Date('2025-07-31T15:45:00'),
    },
    {
      id: 'T-5',
      restaurant: 'Anatolii Restaurant',
      tableNumber: '5',
      guests: 6,
      orderId: 337,
      amount: 123.40,
      remaining: 123.40,
      duration: '1h 15m',
      status: 'active',
      lastActivity: new Date('2025-07-30T18:33:00'),
    },
    {
      id: 'T-50',
      restaurant: 'Viresh Kewalbansing',
      tableNumber: '50',
      guests: 2,
      orderId: 233,
      amount: 35.75,
      remaining: 34.25,
      duration: '40m',
      status: 'active',
      lastActivity: new Date('2025-06-25T13:41:00'),
    },
    {
      id: 'T-1004',
      restaurant: 'Limon B.V.',
      tableNumber: '1004',
      guests: 3,
      orderId: 257,
      amount: 21.8,
      remaining: 9.0,
      duration: '55m',
      status: 'active',
      lastActivity: new Date('2025-07-01T17:51:00'),
    },
    {
      id: 'T-435',
      restaurant: 'Limon B.V.',
      tableNumber: '435',
      guests: 4,
      orderId: 317,
      amount: 43.20,
      remaining: 43.20,
      duration: '35m',
      status: 'active',
      lastActivity: new Date('2025-07-10T12:58:00'),
    },
  ]

  const filteredRestaurants = Object.values(tablesByRestaurant).filter(group => {
    const matchesSearch = 
      group.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tables.some(table => 
        table.tableNumber.includes(searchQuery) ||
        table.orderId.toString().includes(searchQuery)
      )
    return matchesSearch
  })

  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2).replace('.', ',')}`
  }

  const getStatusColor = (remaining, total) => {
    const percentage = (remaining / total) * 100
    if (percentage === 100) return 'bg-yellow-50 text-yellow-700'
    if (percentage > 50) return 'bg-orange-50 text-orange-700'
    return 'bg-green-50 text-green-700'
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('tables.breadcrumb') }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-[#111827] mb-1">
                  {t('tables.title')}
                </h1>
                <p className="text-[#6B7280]">
                  {t('tables.subtitle')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2.5 rounded-lg transition-all border border-gray-200 text-[#6B7280] bg-white hover:bg-gray-50 shadow-sm"
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                {t('tables.refresh')}
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className={`p-6 rounded-xl ${
                'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={"p-3 rounded-lg bg-green-100"
                  }>
                    <TableCellsIcon className={"h-6 w-6 text-green-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${
                      'text-[#6B7280]'
                    }`}>{t('tables.stats.activeTables')}</p>
                    <p className={`text-2xl font-bold mt-2 ${
                      'text-[#111827]'
                    }`}>{activeTables.length}</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${
                'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={"p-3 rounded-lg bg-blue-100"}>
                    <UserGroupIcon className={"h-6 w-6 text-blue-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${
                      'text-[#6B7280]'
                    }`}>{t('tables.stats.totalGuests')}</p>
                    <p className={`text-2xl font-bold mt-2 ${
                      'text-[#111827]'
                    }`}>
                      {activeTables.reduce((sum, table) => sum + table.guests, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${
                'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={"p-3 rounded-lg bg-purple-100"}>
                    <ChartBarIcon className={"h-6 w-6 text-purple-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${
                      'text-[#6B7280]'
                    }`}>{t('tables.stats.totalAmount')}</p>
                    <p className={`text-2xl font-bold mt-2 ${
                      'text-[#111827]'
                    }`}>
                      {formatCurrency(activeTables.reduce((sum, table) => sum + table.amount, 0))}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${
                'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={"p-3 rounded-lg bg-yellow-100"}>
                    <CurrencyEuroIcon className={"h-6 w-6 text-yellow-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${
                      'text-[#6B7280]'
                    }`}>{t('tables.stats.remaining')}</p>
                    <p className={`text-2xl font-bold mt-2 ${
                      'text-[#111827]'
                    }`}>
                      {formatCurrency(activeTables.reduce((sum, table) => sum + table.remaining, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 rounded-xl bg-white shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">
                    {t('tables.search')}
                  </label>
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
                      placeholder={t('tables.searchPlaceholder')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurants with Active Tables */}
            <div className="space-y-6">
              {filteredRestaurants.map((group) => (
                <div key={group.restaurantId} className="rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BuildingStorefrontIcon className={`h-6 w-6 mr-3 ${
                          'text-green-600'
                        }`} />
                        <div>
                          <h2 className={`text-xl font-bold ${
                            'text-[#111827]'
                          }`}>{group.restaurant}</h2>
                          <p className={`text-sm ${
                            'text-[#6B7280]'
                          }`}>{t('tables.activeTablesCount', { count: group.tables.length })}</p>
                        </div>
                      </div>
                      <Link
                        href={`/restaurants/${group.restaurantId}`}
                        className="inline-flex items-center px-4 py-2 rounded-lg transition bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                      >
                        {t('tables.restaurantProfile')}
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.tables.map((table) => (
                        <div
                          key={table.id}
                          className="rounded-xl overflow-hidden transition-all bg-gray-50 border border-gray-200 hover:border-green-300 hover:shadow-md"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className={`text-lg font-bold ${
                                  'text-[#111827]'
                                }`}>
                                  {t('tables.table.table')} {table.tableNumber}
                                </h3>
                                <p className={`text-sm ${
                                  'text-[#6B7280]'
                                }`}>{table.restaurant}</p>
                              </div>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  table.remaining,
                                  table.amount
                                )}`}
                              >
                                {table.remaining === table.amount ? t('tables.status.unpaid') : t('tables.status.partial')}
                              </span>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className={'text-[#6B7280]'}>{t('tables.table.orderNumber')}</span>
                                <span className={`font-medium ${'text-[#111827]'}`}>{table.orderId}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className={'text-[#6B7280]'}>{t('tables.table.guests')}</span>
                                <span className={`font-medium ${'text-[#111827]'}`}>{table.guests}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className={'text-[#6B7280]'}>{t('tables.table.amount')}</span>
                                <span className={`font-medium ${'text-[#111827]'}`}>{formatCurrency(table.amount)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className={'text-[#6B7280]'}>{t('tables.table.remaining')}</span>
                                <span className={`font-medium ${
                                  'text-yellow-600'
                                }`}>
                                  {formatCurrency(table.remaining)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className={'text-[#6B7280]'}>{t('tables.table.duration')}</span>
                                <span className={`font-medium flex items-center ${
                                  'text-[#111827]'
                                }`}>
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {table.duration}
                                </span>
                              </div>
                            </div>

                            <div className={`mt-4 pt-4 border-t ${
                              'border-gray-200'
                            }`}>
                              <Link
                                href={`/orders/${table.orderId}`}
                                className="w-full inline-flex justify-center items-center px-4 py-2.5 font-medium rounded-lg transition-all bg-green-600 text-white hover:bg-green-700 shadow-sm"
                              >
                                {t('tables.table.viewOrder')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-16 rounded-xl bg-white shadow-sm">
                <TableCellsIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-[#6B7280]">
                  {t('tables.emptyState.message')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Tables
