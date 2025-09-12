import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import { useRestaurants } from '../../../contexts/RestaurantsContext'
import { useTranslation } from '../../../contexts/TranslationContext'
import {
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyEuroIcon,
  CalendarIcon,
  UserGroupIcon,
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'

const RestaurantOrders: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { restaurants } = useRestaurants()
  const { t, language } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  
  // Find the restaurant
  const restaurant = restaurants?.find(r => r.id === parseInt(id))
  
  // Static payment transactions data - 78 individual Splitty payments
  const staticPayments = [
    // Recent payments (today)
    { id: 'PAY-2025-5078', orderId: '1078', tableNumber: 12, status: 'completed', amount: '45.50', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: 'PAY-2025-5077', orderId: '1077', tableNumber: 8, status: 'completed', amount: '23.75', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 12 * 60000).toISOString() },
    { id: 'PAY-2025-5076', orderId: '1076', tableNumber: 15, status: 'in_progress', amount: '67.80', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 18 * 60000).toISOString() },
    { id: 'PAY-2025-5075', orderId: '1075', tableNumber: 3, status: 'completed', amount: '34.20', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 25 * 60000).toISOString() },
    { id: 'PAY-2025-5074', orderId: '1074', tableNumber: 22, status: 'completed', amount: '89.90', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 32 * 60000).toISOString() },
    { id: 'PAY-2025-5073', orderId: '1073', tableNumber: 7, status: 'cancelled', amount: '15.60', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
    { id: 'PAY-2025-5072', orderId: '1072', tableNumber: 18, status: 'completed', amount: '56.30', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 52 * 60000).toISOString() },
    { id: 'PAY-2025-5071', orderId: '1071', tableNumber: 11, status: 'completed', amount: '42.15', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 1 * 3600000).toISOString() },
    { id: 'PAY-2025-5070', orderId: '1070', tableNumber: 26, status: 'in_progress', amount: '78.40', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 1.2 * 3600000).toISOString() },
    { id: 'PAY-2025-5069', orderId: '1069', tableNumber: 4, status: 'completed', amount: '31.25', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString() },
    { id: 'PAY-2025-5068', orderId: '1068', tableNumber: 14, status: 'completed', amount: '65.80', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 1.8 * 3600000).toISOString() },
    { id: 'PAY-2025-5067', orderId: '1067', tableNumber: 9, status: 'completed', amount: '48.90', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'PAY-2025-5066', orderId: '1066', tableNumber: 21, status: 'completed', amount: '37.60', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 2.3 * 3600000).toISOString() },
    { id: 'PAY-2025-5065', orderId: '1065', tableNumber: 6, status: 'cancelled', amount: '22.40', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 2.6 * 3600000).toISOString() },
    { id: 'PAY-2025-5064', orderId: '1064', tableNumber: 17, status: 'completed', amount: '94.75', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
    { id: 'PAY-2025-5063', orderId: '1063', tableNumber: 2, status: 'completed', amount: '28.30', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 3.5 * 3600000).toISOString() },
    { id: 'PAY-2025-5062', orderId: '1062', tableNumber: 24, status: 'in_progress', amount: '51.45', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: 'PAY-2025-5061', orderId: '1061', tableNumber: 10, status: 'completed', amount: '73.20', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 4.5 * 3600000).toISOString() },
    { id: 'PAY-2025-5060', orderId: '1060', tableNumber: 19, status: 'completed', amount: '39.85', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: 'PAY-2025-5059', orderId: '1059', tableNumber: 5, status: 'completed', amount: '62.10', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 5.5 * 3600000).toISOString() },
    { id: 'PAY-2025-5058', orderId: '1058', tableNumber: 13, status: 'completed', amount: '46.70', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 6 * 3600000).toISOString() },
    { id: 'PAY-2025-5057', orderId: '1057', tableNumber: 27, status: 'cancelled', amount: '18.90', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 6.5 * 3600000).toISOString() },
    { id: 'PAY-2025-5056', orderId: '1056', tableNumber: 1, status: 'completed', amount: '85.25', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 7 * 3600000).toISOString() },
    { id: 'PAY-2025-5055', orderId: '1055', tableNumber: 16, status: 'completed', amount: '33.60', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 7.5 * 3600000).toISOString() },
    { id: 'PAY-2025-5054', orderId: '1054', tableNumber: 23, status: 'in_progress', amount: '71.40', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
    { id: 'PAY-2025-5053', orderId: '1053', tableNumber: 8, status: 'completed', amount: '25.75', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 8.5 * 3600000).toISOString() },
    { id: 'PAY-2025-5052', orderId: '1052', tableNumber: 20, status: 'completed', amount: '98.30', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 9 * 3600000).toISOString() },
    { id: 'PAY-2025-5051', orderId: '1051', tableNumber: 12, status: 'completed', amount: '44.15', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 9.5 * 3600000).toISOString() },
    { id: 'PAY-2025-5050', orderId: '1050', tableNumber: 25, status: 'completed', amount: '57.80', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 10 * 3600000).toISOString() },
    { id: 'PAY-2025-5049', orderId: '1049', tableNumber: 7, status: 'cancelled', amount: '21.30', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 11 * 3600000).toISOString() },
    
    // Yesterday's payments
    { id: 'PAY-2025-5048', orderId: '1048', tableNumber: 15, status: 'completed', amount: '76.45', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
    { id: 'PAY-2025-5047', orderId: '1047', tableNumber: 3, status: 'completed', amount: '35.20', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 25 * 3600000).toISOString() },
    { id: 'PAY-2025-5046', orderId: '1046', tableNumber: 18, status: 'completed', amount: '68.90', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 26 * 3600000).toISOString() },
    { id: 'PAY-2025-5045', orderId: '1045', tableNumber: 11, status: 'in_progress', amount: '41.75', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 27 * 3600000).toISOString() },
    { id: 'PAY-2025-5044', orderId: '1044', tableNumber: 22, status: 'completed', amount: '93.10', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 28 * 3600000).toISOString() },
    { id: 'PAY-2025-5043', orderId: '1043', tableNumber: 6, status: 'completed', amount: '29.85', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 29 * 3600000).toISOString() },
    { id: 'PAY-2025-5042', orderId: '1042', tableNumber: 14, status: 'completed', amount: '54.60', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 30 * 3600000).toISOString() },
    { id: 'PAY-2025-5041', orderId: '1041', tableNumber: 26, status: 'cancelled', amount: '17.40', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 31 * 3600000).toISOString() },
    { id: 'PAY-2025-5040', orderId: '1040', tableNumber: 9, status: 'completed', amount: '82.25', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 32 * 3600000).toISOString() },
    { id: 'PAY-2025-5039', orderId: '1039', tableNumber: 4, status: 'completed', amount: '38.70', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 33 * 3600000).toISOString() },
    { id: 'PAY-2025-5038', orderId: '1038', tableNumber: 21, status: 'completed', amount: '61.35', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 34 * 3600000).toISOString() },
    { id: 'PAY-2025-5037', orderId: '1037', tableNumber: 17, status: 'in_progress', amount: '47.80', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 35 * 3600000).toISOString() },
    { id: 'PAY-2025-5036', orderId: '1036', tableNumber: 2, status: 'completed', amount: '74.15', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 36 * 3600000).toISOString() },
    { id: 'PAY-2025-5035', orderId: '1035', tableNumber: 24, status: 'completed', amount: '26.90', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 37 * 3600000).toISOString() },
    { id: 'PAY-2025-5034', orderId: '1034', tableNumber: 10, status: 'completed', amount: '89.50', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 38 * 3600000).toISOString() },
    { id: 'PAY-2025-5033', orderId: '1033', tableNumber: 19, status: 'cancelled', amount: '32.25', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 39 * 3600000).toISOString() },
    { id: 'PAY-2025-5032', orderId: '1032', tableNumber: 5, status: 'completed', amount: '66.40', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 40 * 3600000).toISOString() },
    { id: 'PAY-2025-5031', orderId: '1031', tableNumber: 13, status: 'completed', amount: '43.75', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 41 * 3600000).toISOString() },
    
    // Older payments (2-3 days ago)
    { id: 'PAY-2025-5030', orderId: '1030', tableNumber: 27, status: 'completed', amount: '58.20', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
    { id: 'PAY-2025-5029', orderId: '1029', tableNumber: 1, status: 'completed', amount: '91.65', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 50 * 3600000).toISOString() },
    { id: 'PAY-2025-5028', orderId: '1028', tableNumber: 16, status: 'in_progress', amount: '37.30', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 52 * 3600000).toISOString() },
    { id: 'PAY-2025-5027', orderId: '1027', tableNumber: 23, status: 'completed', amount: '72.85', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 54 * 3600000).toISOString() },
    { id: 'PAY-2025-5026', orderId: '1026', tableNumber: 8, status: 'completed', amount: '24.60', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 56 * 3600000).toISOString() },
    { id: 'PAY-2025-5025', orderId: '1025', tableNumber: 20, status: 'cancelled', amount: '45.75', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 58 * 3600000).toISOString() },
    { id: 'PAY-2025-5024', orderId: '1024', tableNumber: 12, status: 'completed', amount: '86.30', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 60 * 3600000).toISOString() },
    { id: 'PAY-2025-5023', orderId: '1023', tableNumber: 25, status: 'completed', amount: '31.45', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 62 * 3600000).toISOString() },
    { id: 'PAY-2025-5022', orderId: '1022', tableNumber: 7, status: 'completed', amount: '69.80', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 64 * 3600000).toISOString() },
    { id: 'PAY-2025-5021', orderId: '1021', tableNumber: 15, status: 'in_progress', amount: '52.25', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 66 * 3600000).toISOString() },
    { id: 'PAY-2025-5020', orderId: '1020', tableNumber: 3, status: 'completed', amount: '77.90', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 68 * 3600000).toISOString() },
    { id: 'PAY-2025-5019', orderId: '1019', tableNumber: 18, status: 'completed', amount: '40.15', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 70 * 3600000).toISOString() },
    { id: 'PAY-2025-5018', orderId: '1018', tableNumber: 11, status: 'completed', amount: '63.70', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 72 * 3600000).toISOString() },
    
    // Week old payments
    { id: 'PAY-2025-5017', orderId: '1017', tableNumber: 22, status: 'completed', amount: '95.35', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 96 * 3600000).toISOString() },
    { id: 'PAY-2025-5016', orderId: '1016', tableNumber: 6, status: 'cancelled', amount: '28.80', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 100 * 3600000).toISOString() },
    { id: 'PAY-2025-5015', orderId: '1015', tableNumber: 14, status: 'completed', amount: '59.45', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 104 * 3600000).toISOString() },
    { id: 'PAY-2025-5014', orderId: '1014', tableNumber: 26, status: 'completed', amount: '81.20', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 108 * 3600000).toISOString() },
    { id: 'PAY-2025-5013', orderId: '1013', tableNumber: 9, status: 'completed', amount: '36.65', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 112 * 3600000).toISOString() },
    { id: 'PAY-2025-5012', orderId: '1012', tableNumber: 4, status: 'in_progress', amount: '70.30', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 116 * 3600000).toISOString() },
    { id: 'PAY-2025-5011', orderId: '1011', tableNumber: 21, status: 'completed', amount: '48.55', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 120 * 3600000).toISOString() },
    { id: 'PAY-2025-5010', orderId: '1010', tableNumber: 17, status: 'completed', amount: '87.75', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 124 * 3600000).toISOString() },
    { id: 'PAY-2025-5009', orderId: '1009', tableNumber: 2, status: 'completed', amount: '25.40', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 128 * 3600000).toISOString() },
    { id: 'PAY-2025-5008', orderId: '1008', tableNumber: 24, status: 'cancelled', amount: '64.85', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 132 * 3600000).toISOString() },
    { id: 'PAY-2025-5007', orderId: '1007', tableNumber: 10, status: 'completed', amount: '42.20', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 136 * 3600000).toISOString() },
    { id: 'PAY-2025-5006', orderId: '1006', tableNumber: 19, status: 'completed', amount: '79.65', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 140 * 3600000).toISOString() },
    { id: 'PAY-2025-5005', orderId: '1005', tableNumber: 5, status: 'completed', amount: '33.90', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 144 * 3600000).toISOString() },
    { id: 'PAY-2025-5004', orderId: '1004', tableNumber: 13, status: 'in_progress', amount: '56.45', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 148 * 3600000).toISOString() },
    { id: 'PAY-2025-5003', orderId: '1003', tableNumber: 27, status: 'completed', amount: '88.10', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 152 * 3600000).toISOString() },
    { id: 'PAY-2025-5002', orderId: '1002', tableNumber: 1, status: 'completed', amount: '30.75', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 156 * 3600000).toISOString() },
    { id: 'PAY-2025-5001', orderId: '1001', tableNumber: 16, status: 'completed', amount: '75.20', paymentMethod: 'splitty', createdAt: new Date(Date.now() - 160 * 3600000).toISOString() },
  ]
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 30
  const [orders, setOrders] = useState(staticPayments)
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.orderId.includes(searchTerm) ||
                          order.tableNumber.toString().includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesPayment = filterPayment === 'all' || order.paymentMethod === filterPayment
    
    // Date filter
    let matchesDate = true
    if (dateRange !== 'all') {
      const orderDate = new Date(order.createdAt)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (dateRange === 'today') {
        matchesDate = orderDate >= today
      } else if (dateRange === 'week') {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchesDate = orderDate >= weekAgo
      } else if (dateRange === 'month') {
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        matchesDate = orderDate >= monthAgo
      }
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate
  })
  
  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)
  
  // Calculate statistics for payments
  const stats = {
    total: filteredOrders.length,
    totalAmount: filteredOrders.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2),
    completedAmount: filteredOrders.filter(p => p.status === 'completed').reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2),
    pendingAmount: filteredOrders.filter(p => p.status === 'in_progress').reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2),
    completed: filteredOrders.filter(p => p.status === 'completed').length,
    inProgress: filteredOrders.filter(p => p.status === 'in_progress').length,
    cancelled: filteredOrders.filter(p => p.status === 'cancelled').length,
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return t('orders.status.paid')
      case 'in_progress':
        return t('orders.status.inProgress')
      case 'cancelled':
        return t('orders.status.cancelled')
      default:
        return status
    }
  }
  
  const getPaymentIcon = (method) => {
    switch (method) {
      case 'splitty':
        return <DevicePhoneMobileIcon className="h-4 w-4" />
      case 'ideal':
        return <CreditCardIcon className="h-4 w-4" />
      case 'creditcard':
        return <CreditCardIcon className="h-4 w-4" />
      case 'cash':
        return <BanknotesIcon className="h-4 w-4" />
      default:
        return <CreditCardIcon className="h-4 w-4" />
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
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
            <h2 className="text-2xl font-semibold text-gray-900">{t('restaurants.notFound')}</h2>
            <Link href="/restaurants" className="mt-4 inline-flex items-center text-green-600 hover:text-green-700">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {t('restaurants.backToList')}
            </Link>
          </div>
        </div>
      </Layout>
    )
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
                    {t('sidebar.menu.restaurants')}
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
                    {t('orders.splittyTransactions')}
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
              {t('orders.backToRestaurant', { name: restaurant.name })}
            </Link>
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">{t('orders.splittyTransactions')}</h1>
                <p className="text-gray-600">{t('orders.viewAllOrdersPayments', { name: restaurant.name })}</p>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">{t('orders.stats.totalPayments')}</p>
                  <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.completed} {t('orders.stats.paid')}</p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">{t('orders.stats.totalAmount')}</p>
                  <CurrencyEuroIcon className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">€{stats.totalAmount}</p>
                <p className="text-xs text-gray-500 mt-1">{t('orders.stats.allTransactions')}</p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">{t('orders.stats.completed')}</p>
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-semibold text-green-600">€{stats.completedAmount}</p>
                <p className="text-xs text-gray-500 mt-1">{t('orders.stats.successfullyPaid')}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder={t('orders.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-700 focus:outline-none"
                >
                  <option value="today">{t('dashboard.filters.today')}</option>
                  <option value="week">{t('orders.filters.thisWeek')}</option>
                  <option value="month">{t('orders.filters.thisMonth')}</option>
                  <option value="all">{t('common.all')}</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-700 focus:outline-none"
                >
                  <option value="all">{t('orders.filters.allStatus')}</option>
                  <option value="completed">{t('orders.status.paid')}</option>
                  <option value="in_progress">{t('orders.status.inProgress')}</option>
                  <option value="cancelled">{t('orders.status.cancelled')}</option>
                </select>
                
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-700 focus:outline-none"
                >
                  <option value="all">{t('orders.filters.allPayments')}</option>
                  <option value="splitty">Splitty</option>
                  <option value="ideal">iDEAL</option>
                  <option value="creditcard">{t('orders.filters.creditCard')}</option>
                  <option value="cash">{t('orders.filters.cash')}</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.order')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.table.table')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.amounts')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.paymentMethod')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.time')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedOrders.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{payment.orderId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{t('orders.tableNumber', { number: payment.tableNumber })}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">€{payment.amount}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            {getPaymentIcon(payment.paymentMethod)}
                            <span className="ml-2 capitalize">{payment.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-1.5 items-center">
                            <Link 
                              href={`/restaurants/${id}/orders/ORD-2025-${payment.orderId}`}
                              className="font-medium text-xs text-green-600 hover:text-green-700"
                            >
                              {t('common.order')}
                            </Link>
                            <span className="text-gray-300 text-xs">|</span>
                            <Link 
                              href={`/restaurants/${id}/payments/${payment.id}`}
                              className="font-medium text-xs text-green-600 hover:text-green-700"
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
              
              {paginatedOrders.length === 0 && (
                <div className="text-center py-12">
                  <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('orders.noPaymentsFound')}</h3>
                  <p className="text-gray-600">{t('orders.tryAdjustingFilters')}</p>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {t('orders.pagination.showing', { 
                      start: startIndex + 1, 
                      end: Math.min(startIndex + itemsPerPage, filteredOrders.length), 
                      total: filteredOrders.length 
                    })}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {t('common.previous')}
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          currentPage === i + 1
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {t('common.next')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default RestaurantOrders
