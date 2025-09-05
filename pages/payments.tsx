import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useTranslation } from '../contexts/TranslationContext'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

const Payments: NextPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('last30days')

  const payments = [
    {
      id: 'pay_1N8K9L2eZvKYlo',
      orderId: 223,
      restaurant: 'Limon B.V.',
      amount: 3.9,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-06-20T11:49:00'),
    },
    {
      id: 'pay_2M7J8K1dYuJXkn',
      orderId: 257,
      restaurant: 'Limon B.V.',
      amount: 12.8,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-01T17:51:00'),
    },
    {
      id: 'pay_3L6I7J0cXtIWjm',
      orderId: 247,
      restaurant: 'Limon B.V.',
      amount: 38.5,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-01T13:02:00'),
    },
    {
      id: 'pay_4K5H6I9bWsHVil',
      orderId: 272,
      restaurant: 'Limon B.V.',
      amount: 43.5,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-03T12:28:00'),
    },
    {
      id: 'pay_5J4G5H8aVrGUhk',
      orderId: 191,
      restaurant: 'Limon B.V.',
      amount: 7.4,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-06-13T14:58:00'),
    },
    {
      id: 'pay_6I3F4G7zUqFTgj',
      orderId: 292,
      restaurant: 'Limon B.V.',
      amount: 114.3,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-03T20:11:00'),
    },
    {
      id: 'pay_7H2E3F6yTpESfi',
      orderId: 216,
      restaurant: 'Limon B.V.',
      amount: 48.5,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-06-19T13:51:00'),
    },
    {
      id: 'pay_8G1D2E5xSoDReh',
      orderId: 179,
      restaurant: 'Limon B.V.',
      amount: 6.8,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-05-27T18:05:00'),
    },
    {
      id: 'pay_9F0C1D4wRnCQdg',
      orderId: 178,
      restaurant: 'Limon B.V.',
      amount: 39.0,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-05-27T17:19:00'),
    },
    {
      id: 'pay_0E9B0C3vQmBPcf',
      orderId: 251,
      restaurant: 'Limon B.V.',
      amount: 7.0,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-01T14:54:00'),
    },
    {
      id: 'pay_1D8A9B2uPlAObe',
      orderId: 306,
      restaurant: 'Limon B.V.',
      amount: 115.0,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-04T20:34:00'),
    },
    {
      id: 'pay_2C7Z8A1tOkZNad',
      orderId: 315,
      restaurant: 'Limon B.V.',
      amount: 70.1,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-09T23:06:00'),
    },
    {
      id: 'pay_3B6Y7Z0sNjYMzc',
      orderId: 185,
      restaurant: 'Viresh Kewalbansing',
      amount: 48.8,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-06-11T10:10:00'),
    },
    {
      id: 'pay_4A5X6Y9rMiXLyb',
      orderId: 257,
      restaurant: 'Limon B.V.',
      amount: 9.0,
      method: 'stripe',
      status: 'pending',
      created: new Date('2025-07-10T14:30:00'),
    },
    {
      id: 'pay_5Z4W5X8qLhWKxa',
      orderId: 233,
      restaurant: 'Viresh Kewalbansing',
      amount: 1.5,
      method: 'stripe',
      status: 'failed',
      created: new Date('2025-06-25T15:45:00'),
    },
    {
      id: 'pay_6Y3V4W7pKgVJwz',
      orderId: 176,
      restaurant: 'Limon B.V.',
      amount: 22.5,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-05-26T10:15:00'),
    },
    {
      id: 'pay_7X2U3V6oJfUIvy',
      orderId: 330,
      restaurant: 'Limon B.V.',
      amount: 10.3,
      method: 'stripe',
      status: 'pending',
      created: new Date('2025-07-15T16:20:00'),
    },
    {
      id: 'pay_8W1T2U5nIeTHux',
      orderId: 339,
      restaurant: 'Limon B.V.',
      amount: 24.7,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-30T21:00:00'),
    },
  ]

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toString().includes(searchQuery) ||
      payment.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    // Date range filter
    const now = new Date()
    const paymentDate = new Date(payment.created)
    let matchesDate = true
    
    if (dateRange === 'today') {
      matchesDate = paymentDate.toDateString() === now.toDateString()
    } else if (dateRange === 'last7days') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      matchesDate = paymentDate >= weekAgo
    } else if (dateRange === 'last30days') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      matchesDate = paymentDate >= monthAgo
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const totalAmount = filteredPayments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, payment) => sum + payment.amount, 0)

  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2).replace('.', ',')}`
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-50 text-green-700'
      case 'failed':
        return 'bg-red-50 text-red-700'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleExport = () => {
    console.log('Exporting payments...')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('payments.breadcrumb') }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-[#111827] mb-1">
                  {t('payments.title')}
                </h1>
                <p className="text-[#6B7280]">
                  {t('payments.subtitle')}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/payments/payouts"
                  className="inline-flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 border border-gray-200 text-[#6B7280] bg-white hover:bg-gray-50 shadow-sm"
                >
                  <BanknotesIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  {t('payments.viewPayouts')}
                </Link>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 border border-gray-200 text-[#6B7280] bg-white hover:bg-gray-50 shadow-sm"
                >
                  <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  {t('payments.export')}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <CreditCardIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                      {t('payments.stats.totalPayments')}
                    </p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">
                      {filteredPayments.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                      {t('payments.stats.succeeded')}
                    </p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">
                      {filteredPayments.filter(p => p.status === 'succeeded').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <ChartBarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                      {t('payments.stats.totalAmount')}
                    </p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-red-50">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                      {t('payments.stats.failed')}
                    </p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">
                      {filteredPayments.filter(p => p.status === 'failed').length}
                    </p>
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
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">
                    Zoeken
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
                      placeholder={t('payments.searchPlaceholder')}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    id="status"
                    name="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition bg-[#F9FAFB] border-gray-200 text-[#111827] focus:ring-green-500 focus:border-transparent hover:border-gray-300"
                  >
                    <option value="all">{t('payments.filters.allStatuses')}</option>
                    <option value="succeeded">{t('payments.filters.succeeded')}</option>
                    <option value="pending">In Behandeling</option>
                    <option value="failed">{t('payments.filters.failed')}</option>
                  </select>
                  <select
                    id="dateRange"
                    name="dateRange"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition bg-[#F9FAFB] border-gray-200 text-[#111827] focus:ring-green-500 focus:border-transparent hover:border-gray-300"
                  >
                    <option value="today">{t('payments.dateFilters.today')}</option>
                    <option value="last7days">{t('payments.dateFilters.last7days')}</option>
                    <option value="last30days">{t('payments.dateFilters.last30days')}</option>
                    <option value="all">{t('payments.dateFilters.allTime')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
              <table className="min-w-full divide-y ${false ? 'divide-[#2a2d3a]' : 'divide-gray-200'}">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('payments.table.paymentId')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('payments.table.order')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('payments.table.restaurant')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('payments.table.amount')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('payments.table.method')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('payments.table.status')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('payments.table.date')}
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">{t('payments.table.view')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/orders/${payment.orderId}`}
                          className="transition-colors text-green-600 hover:text-green-700"
                        >
                          #{payment.orderId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.restaurant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">
                            {payment.status === 'succeeded' ? t('payments.filters.succeeded') : 
                             payment.status === 'failed' ? t('payments.filters.failed') : 
                             t('payments.filters.pending')}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.created)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/payments/${payment.id}`}
                          className="transition-colors text-green-600 hover:text-green-700"
                        >
                          {t('payments.table.view')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Table Footer */}
              <div className="px-6 py-4 border-t bg-gray-50 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {t('payments.tableFooter.showing', { count: filteredPayments.length })}
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredPayments.length === 0 && (
              <div className="text-center py-16 rounded-xl bg-white shadow-sm">
                <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">
                  {t('payments.emptyState.message')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Payments
