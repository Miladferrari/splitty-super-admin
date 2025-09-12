import React, { useState, useEffect, useRef, Suspense } from 'react'
import type { NextPage } from 'next'
import Layout from '../components/Layout'
import { useRestaurants } from '../contexts/RestaurantsContext'
import { useTranslation } from '../contexts/TranslationContext'
// ChartDataPoint imported from types - commented out due to local definition conflict
import { LazyDashboardAnalytics } from '../components/LazyChartComponents'
import {
  BuildingStorefrontIcon,
  UsersIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  StarIcon,
  UserGroupIcon,
  SparklesIcon,
  BanknotesIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline'
import { formatCurrency } from '../utils/formatters'

interface DateRange {
  start: Date | null
  end: Date | null
}

interface ChartDataPoint {
  time: string
  omzet?: number
  betalingen?: number
  transacties?: number
  gemiddeldBedrag?: number
  gemiddeldeTafelgrootte?: number
  [key: string]: string | number | undefined
}

const Dashboard: NextPage = () => {
  const { t } = useTranslation()
  const [greeting, setGreeting] = useState('')
  const [selectedStore, setSelectedStore] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [userName, setUserName] = useState('User')
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null) // Track which metric is selected - null shows all
  const [analyticsView, setAnalyticsView] = useState('totaal') // totaal, restaurant, regio
  const [customDateRange, setCustomDateRange] = useState<DateRange>({ start: null, end: null })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [compareWithPrevious, setCompareWithPrevious] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [calendarView, setCalendarView] = useState<Date>(new Date())
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ start: null, end: null })
  const [tempDateFilter, setTempDateFilter] = useState<string | null>(null) // Track which preset is temporarily selected
  const [showRestaurantDropdown, setShowRestaurantDropdown] = useState(false)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [selectedChartMetric, setSelectedChartMetric] = useState('all') // 'all', 'revenue', 'payments', 'tips'
  const { restaurants } = useRestaurants()
  const datePickerRef = useRef<HTMLDivElement | null>(null)
  const restaurantDropdownRef = useRef<HTMLDivElement | null>(null)
  
  // Generate chart data based on date range and selected metric
  const generateChartData = (statsData: ChartDataPoint[]): ChartDataPoint[] => {
    // Use the passed stats data, no fallback needed
    if (!statsData || statsData.length === 0) return [];
    
    // Get actual values from stats
    const splittyOmzetItem = statsData.find((s: any) => s.id === 'splitty-omzet');
    const splittyOmzet = splittyOmzetItem && typeof splittyOmzetItem.value === 'string' 
      ? parseFloat(splittyOmzetItem.value.replace('€', '').replace(/\./g, '').replace(',', '.')) 
      : 105.00;
    
    const verwerkteBetalingenItem = statsData.find((s: any) => s.id === 'verwerkte-betalingen');
    const verwerkteBetalingen = verwerkteBetalingenItem && typeof verwerkteBetalingenItem.value === 'string'
      ? parseFloat(verwerkteBetalingenItem.value.replace('€', '').replace(/\./g, '').replace(',', '.'))
      : 6300.00;
    
    const aantalTransactiesItem = statsData.find((s: any) => s.id === 'aantal-transacties');
    const aantalTransacties = aantalTransactiesItem && typeof aantalTransactiesItem.value === 'string'
      ? parseInt(aantalTransactiesItem.value)
      : 150;
    
    const gemiddeldBedragItem = statsData.find((s: any) => s.id === 'gemiddeld-bedrag');
    const gemiddeldBedrag = gemiddeldBedragItem && typeof gemiddeldBedragItem.value === 'string'
      ? parseFloat(gemiddeldBedragItem.value.replace('€', '').replace(',', '.'))
      : 42.00;
    
    // Hourly pattern for restaurant business (peak at lunch and dinner)
    const hourlyPattern = {
      '9:00': 0.1,
      '10:00': 0.2,
      '11:00': 0.3,
      '12:00': 0.8,
      '13:00': 0.9,
      '14:00': 0.6,
      '15:00': 0.3,
      '16:00': 0.3,
      '17:00': 0.5,
      '18:00': 0.7,
      '19:00': 1.0,
      '20:00': 0.95,
      '21:00': 0.6,
      '22:00': 0.3,
      '23:00': 0.1
    };
    
    if (dateRange === 'today') {
      const currentHour = new Date().getHours();
      const totalHourFactors = Object.values(hourlyPattern).reduce((sum, f) => sum + f, 0);
      
      return Object.entries(hourlyPattern).map(([time, factor]) => {
        const hour = parseInt(time.split(':')[0]);
        const isActiveHour = hour <= currentHour;
        
        // Calculate varying average amounts based on time of day
        let hourlyAverage = gemiddeldBedrag;
        if (hour === 12 || hour === 13) {
          hourlyAverage = gemiddeldBedrag * 0.85; // Lunch is slightly cheaper
        } else if (hour >= 18 && hour <= 21) {
          hourlyAverage = gemiddeldBedrag * 1.25; // Dinner is more expensive
        } else if (hour < 11) {
          hourlyAverage = gemiddeldBedrag * 0.7; // Morning/breakfast is cheaper
        }
        
        // Add some random variation (±10%)
        const variation = 0.9 + Math.random() * 0.2;
        hourlyAverage = hourlyAverage * variation;
        
        // Calculate table size based on time of day
        let tableSize = 4.2; // Base average
        if (hour === 12 || hour === 13) {
          // Lunch: mix of solo diners and small groups
          tableSize = 2.8 + Math.random() * 1.2; // 2.8 - 4.0 people
        } else if (hour >= 18 && hour <= 21) {
          // Dinner: larger groups, families, dates
          tableSize = 3.5 + Math.random() * 2.5; // 3.5 - 6.0 people
        } else if (hour < 11) {
          // Breakfast: mostly solo or couples
          tableSize = 1.5 + Math.random() * 1.0; // 1.5 - 2.5 people
        } else {
          // Other times: varies
          tableSize = 2.0 + Math.random() * 2.0; // 2.0 - 4.0 people
        }
        
        return {
          time,
          splittyOmzet: isActiveHour ? parseFloat((splittyOmzet * factor / totalHourFactors).toFixed(2)) : 0,
          verwerkteBetalingen: isActiveHour ? Math.round(verwerkteBetalingen * factor / totalHourFactors) : 0,
          aantalTransacties: isActiveHour ? Math.round(aantalTransacties * factor / totalHourFactors) : 0,
          gemiddeldBedrag: isActiveHour ? parseFloat(hourlyAverage.toFixed(2)) : 0,
          tafelgrootte: isActiveHour ? parseFloat(tableSize.toFixed(1)) : 0
        };
      });
    } else if (dateRange === 'yesterday') {
      // For yesterday, show full day hourly data
      const totalHourFactors = Object.values(hourlyPattern).reduce((sum, f) => sum + f, 0);
      
      return Object.entries(hourlyPattern).map(([time, factor]) => {
        const hour = parseInt(time.split(':')[0]);
        
        // Calculate varying average amounts based on time of day
        let hourlyAverage = gemiddeldBedrag;
        if (hour === 12 || hour === 13) {
          hourlyAverage = gemiddeldBedrag * 0.85; // Lunch
        } else if (hour >= 18 && hour <= 21) {
          hourlyAverage = gemiddeldBedrag * 1.25; // Dinner
        } else if (hour < 11) {
          hourlyAverage = gemiddeldBedrag * 0.7; // Breakfast
        }
        
        const variation = 0.9 + Math.random() * 0.2;
        hourlyAverage = hourlyAverage * variation;
        
        // Calculate table size based on time of day
        let tableSize = 4.2; // Base average
        if (hour === 12 || hour === 13) {
          tableSize = 2.8 + Math.random() * 1.2; // 2.8 - 4.0 people
        } else if (hour >= 18 && hour <= 21) {
          tableSize = 3.5 + Math.random() * 2.5; // 3.5 - 6.0 people
        } else if (hour < 11) {
          tableSize = 1.5 + Math.random() * 1.0; // 1.5 - 2.5 people
        } else {
          tableSize = 2.0 + Math.random() * 2.0; // 2.0 - 4.0 people
        }
        
        return {
          time,
          splittyOmzet: parseFloat((splittyOmzet * factor / totalHourFactors).toFixed(2)),
          verwerkteBetalingen: Math.round(verwerkteBetalingen * factor / totalHourFactors),
          aantalTransacties: Math.round(aantalTransacties * factor / totalHourFactors),
          gemiddeldBedrag: parseFloat(hourlyAverage.toFixed(2)),
          tafelgrootte: parseFloat(tableSize.toFixed(1))
        };
      });
    } else {
      // For multi-day ranges, show daily distribution
      let dayLabels = [];
      let dayCount = 7; // Default for week view
      
      if (dateRange === 'last7days' || dateRange === 'weekToDate') {
        dayLabels = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
      } else if (dateRange === 'last30days' || dateRange === 'monthToDate') {
        // Show weekly aggregates for month view
        dayLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        dayCount = 4;
      } else {
        // Default weekly view
        dayLabels = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
      }
      
      // Distribute values evenly across the period
      const dailyFactor = 1 / dayCount;
      
      return dayLabels.map((label, index) => {
        // Add some variation to make it look realistic
        const variation = 0.8 + (Math.random() * 0.4); // 80% to 120% variation
        
        // Vary table size by day of week
        let tableSize = 4.2; // Base average
        if (label === 'Vr' || label === 'Za') {
          // Friday/Saturday: larger groups
          tableSize = 4.5 + Math.random() * 1.5; // 4.5 - 6.0 people
        } else if (label === 'Zo') {
          // Sunday: family dinners
          tableSize = 3.8 + Math.random() * 1.2; // 3.8 - 5.0 people
        } else if (label === 'Ma' || label === 'Di') {
          // Monday/Tuesday: smaller groups
          tableSize = 2.5 + Math.random() * 1.5; // 2.5 - 4.0 people
        } else {
          // Wed/Thu: average
          tableSize = 3.0 + Math.random() * 1.5; // 3.0 - 4.5 people
        }
        
        return {
          time: label,
          splittyOmzet: parseFloat((splittyOmzet * dailyFactor * variation).toFixed(2)),
          verwerkteBetalingen: Math.round(verwerkteBetalingen * dailyFactor * variation),
          aantalTransacties: Math.round(aantalTransacties * dailyFactor * variation),
          gemiddeldBedrag: gemiddeldBedrag,
          tafelgrootte: parseFloat(tableSize.toFixed(1))
        };
      });
    }
  }

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting(t('dashboard.greeting.morning'))
    else if (hour < 18) setGreeting(t('dashboard.greeting.afternoon'))
    else setGreeting(t('dashboard.greeting.evening'))
    
    // Get user name from localStorage on client side
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName') || 'User'
      setUserName(storedUserName)
    }
  }, [t])

  // Handle click outside to close date picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
        setTempDateFilter(null)
      }
    }

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDatePicker])

  // Handle click outside to close restaurant dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (restaurantDropdownRef.current && !restaurantDropdownRef.current.contains(event.target as Node)) {
        setShowRestaurantDropdown(false)
      }
    }

    if (showRestaurantDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showRestaurantDropdown])

  // Calculate real data from restaurants
  const activeRestaurants = restaurants?.filter(r => !r.deleted && r.status === 'active') || []
  
  // Filter restaurants based on selected store
  const filteredRestaurants = selectedStore === 'all' 
    ? activeRestaurants 
    : activeRestaurants.filter(r => r.id.toString() === selectedStore)
  
  // Generate data based on selected date range
  const generateDailyData = () => {
    const data = []
    const today = new Date()
    let days = 7
    let startDate = new Date(today)
    
    // Determine number of days based on date range
    switch(dateRange) {
      case 'today':
        days = 1
        break
      case 'yesterday':
        days = 1
        startDate.setDate(startDate.getDate() - 1)
        break
      case 'last7days':
        days = 7
        startDate.setDate(startDate.getDate() - 6)
        break
      case 'last30days':
        days = 30
        startDate.setDate(startDate.getDate() - 29)
        break
      case 'last90days':
        days = 90
        startDate.setDate(startDate.getDate() - 89)
        break
      case 'last365days':
        days = 365
        startDate.setDate(startDate.getDate() - 364)
        break
      case 'lastWeek':
        startDate.setDate(startDate.getDate() - startDate.getDay() - 7)
        days = 7
        break
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        days = lastDayOfMonth.getDate()
        break
      case 'lastQuarter':
        const quarter = Math.floor(today.getMonth() / 3)
        startDate = new Date(today.getFullYear(), (quarter - 1) * 3, 1)
        const endQuarter = new Date(today.getFullYear(), quarter * 3, 0)
        days = Math.ceil((endQuarter - startDate) / (1000 * 60 * 60 * 24)) + 1
        break
      case 'lastYear':
        startDate = new Date(today.getFullYear() - 1, 0, 1)
        days = 365
        break
      case 'weekToDate':
        startDate.setDate(startDate.getDate() - startDate.getDay())
        days = startDate.getDay() + 1
        break
      case 'monthToDate':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        days = today.getDate()
        break
      case 'quarterToDate':
        const currentQuarter = Math.floor(today.getMonth() / 3)
        startDate = new Date(today.getFullYear(), currentQuarter * 3, 1)
        days = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1
        break
      case 'yearToDate':
        startDate = new Date(today.getFullYear(), 0, 1)
        days = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1
        break
      case 'custom':
        if (customDateRange.start && customDateRange.end) {
          const start = new Date(customDateRange.start)
          const end = new Date(customDateRange.end)
          days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
          startDate = new Date(start)
        }
        break
    }
    
    // Generate data for the period
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      
      // Generate consistent data with some variation
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // Adjust data based on whether viewing all restaurants or single restaurant
      const multiplier = selectedStore === 'all' ? filteredRestaurants.length : 1
      const baseOrders = isWeekend ? (200 + (i % 50)) / Math.max(1, activeRestaurants.length) * multiplier : (150 + (i % 70)) / Math.max(1, activeRestaurants.length) * multiplier
      const avgOrderValue = 42 + (i % 8)
      const dailyTurnover = baseOrders * avgOrderValue
      
      // Format date based on range
      let dateFormat: Intl.DateTimeFormatOptions = { month: 'short' as const, day: 'numeric' as const }
      if (days > 30) {
        dateFormat = { month: 'short' as const, day: 'numeric' as const }
      } else if (days > 90) {
        dateFormat = { month: 'short' as const }
      }
      
      data.push({
        date: date.toLocaleDateString('nl-NL', dateFormat),
        fullDate: date,
        orders: baseOrders,
        turnover: dailyTurnover,
      })
    }
    
    // Limit data points for better visualization
    if (days > 30) {
      // Group by week for monthly view
      const weeklyData = []
      for (let i = 0; i < data.length; i += 7) {
        const weekData = data.slice(i, i + 7)
        const weekOrders = weekData.reduce((sum, d) => sum + d.orders, 0)
        const weekTurnover = weekData.reduce((sum, d) => sum + d.turnover, 0)
        weeklyData.push({
          date: `Week ${Math.floor(i / 7) + 1}`,
          orders: Math.round(weekOrders / weekData.length),
          turnover: weekTurnover / weekData.length,
        })
      }
      return weeklyData.slice(0, 12) // Max 12 data points
    }
    
    return data.slice(-7) // Return last 7 days for daily view
  }

  interface DailyDataPoint {
    date: string
    fullDate?: Date
    orders: number
    turnover: number
  }
  
  const [dailyData, setDailyData] = useState<DailyDataPoint[]>([])
  
  // Initialize data on client side to avoid hydration issues
  useEffect(() => {
    setDailyData(generateDailyData())
  }, [dateRange, selectedStore, filteredRestaurants.length])
  
  // Calculate totals - Splitty payments processing
  const totalProcessedPayments = dailyData.reduce((sum, day) => sum + day.turnover, 0) // Total amount processed through Splitty
  const totalSplittyTransactions = dailyData.reduce((sum, day) => sum + day.orders, 0) // Number of Splitty payments
  const avgTransactionAmount = totalSplittyTransactions > 0 ? totalProcessedPayments / totalSplittyTransactions : 0 // Average payment amount
  const splittRevenue = totalSplittyTransactions * 0.70 // €0.70 per transaction
  const activeRestaurantsCount = selectedStore === 'all' ? activeRestaurants.length : 1
  
  // Calculate Stripe costs for Splitty as payment processor
  // Our actual cost per transaction is €0.29 (Stripe fees)
  const totalStripeCosts = totalSplittyTransactions * 0.29 // €0.29 per transaction
  
  // Net profit is what Splitty keeps after paying Stripe
  const netProfit = splittRevenue - totalStripeCosts // Our €0.70 per transaction minus €0.29 costs = €0.41 profit per transaction

  // Calculate additional metrics
  const totalUsers = 17 // Based on your example
  const currentUsers = 17 // All users active
  const avgTableSize = 4.2 // Average number of people per table (based on split payments)
  const totalTablesServed = Math.floor(totalSplittyTransactions / avgTableSize) // Estimate of tables served
  const serviceFees = splittRevenue // Revenue from €0.70 per transaction
  const totalRestaurantsTarget = 11 // Target restaurant count

  // Splitty admin panel styled cards - Organized by category
  const stats = [
    // PRIMARY METRICS - Most important
    {
      id: 'splitty-omzet',
      title: t('dashboard.stats.splittyRevenue.title'),
      value: formatCurrency(splittRevenue),
      change: '+15.3%',
      trend: 'up',
      icon: BanknotesIcon,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      changeColor: 'text-emerald-600',
      description: t('dashboard.stats.splittyRevenue.description'),
      priority: 'primary'
    },
    {
      id: 'verwerkte-betalingen',
      title: t('dashboard.stats.processedPayments.title'),
      value: formatCurrency(totalProcessedPayments),
      change: '+12.5%',
      trend: 'up',
      icon: CreditCardIcon,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      changeColor: 'text-blue-600',
      description: t('dashboard.stats.processedPayments.description')
    },
    {
      id: 'aantal-transacties',
      title: t('dashboard.stats.totalTransactions.title'),
      value: Math.round(totalSplittyTransactions).toString(),
      change: '+18.7%',
      trend: 'up',
      icon: ShoppingBagIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      changeColor: 'text-purple-600',
      description: t('dashboard.stats.totalTransactions.description')
    },
    {
      id: 'gemiddeld-bedrag',
      title: t('dashboard.stats.averageAmount.title'),
      value: formatCurrency(avgTransactionAmount),
      change: '-2.1%',
      trend: 'down',
      icon: ChartBarIcon,
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      changeColor: 'text-red-600',
      description: t('dashboard.stats.averageAmount.description')
    },
    // SECONDARY METRICS
    {
      id: 'actieve-restaurants',
      title: t('dashboard.stats.activeRestaurants.title'),
      value: activeRestaurantsCount,
      change: '+2',
      trend: 'up',
      icon: BuildingStorefrontIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      changeColor: 'text-green-600',
      description: t('dashboard.stats.activeRestaurants.description')
    },
    {
      id: 'tafelgrootte',
      title: t('dashboard.stats.tableSize.title'),
      value: avgTableSize.toFixed(1),
      subValue: t('dashboard.stats.tableSize.unit'),
      change: '+5.2%',
      trend: 'up',
      icon: UserGroupIcon,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      changeColor: 'text-teal-600',
      description: t('dashboard.stats.tableSize.description')
    },
  ]

  // Update chart data when stats or other values change
  useEffect(() => {
    if (stats && stats.length > 0 && dailyData.length > 0) {
      setChartData(generateChartData(stats as any))
    }
  }, [dateRange, selectedMetric, selectedStore, dailyData.length])

  const openQuotations = [
    { id: 1, restaurant: 'The Golden Fork', amount: '€2,450', date: '2 uur geleden', status: 'urgent' },
    { id: 2, restaurant: 'Bella Vista', amount: '€1,890', date: '5 uur geleden', status: 'pending' },
    { id: 3, restaurant: 'Ocean Breeze', amount: '€3,200', date: '1 dag geleden', status: 'pending' },
  ]

  const bestPerformingRestaurants = filteredRestaurants.slice(0, 5).map((restaurant, index) => ({
    id: restaurant.id,
    name: restaurant.name,
    revenue: formatCurrency((index + 1) * 2450 + (index * 250)), // Fixed calculation instead of random
    transactions: 150 + (index * 20), // Fixed calculation instead of random
    rating: (4.5 + (index * 0.1)).toFixed(1) // Fixed calculation instead of random
  }))

  const partners = [
    { name: 'Stripe', type: 'Payment Provider', status: 'active', icon: '💳' },
    { name: 'Mollie', type: 'Payment Provider', status: 'active', icon: '💰' },
    { name: 'Lightspeed', type: 'POS Integration', status: 'active', icon: '🖥️' },
    { name: 'Square', type: 'POS Integration', status: 'pending', icon: '📱' },
  ]

  // Find max values for chart scaling
  const maxOrders = Math.max(...dailyData.map(d => d.orders))
  const maxTurnover = Math.max(...dailyData.map(d => d.turnover))

  // Generate analytics data based on selected metric and view
  const getAnalyticsData = () => {
    if (selectedMetric === 'splitty-omzet') {
      if (analyticsView === 'totaal') {
        return {
          title: t('dashboard.stats.splittyRevenue.title'),
          subtitle: t('dashboard.stats.splittyRevenue.description'),
          cards: [
            { 
              label: t('dashboard.sections.financialOverview.stripeCosts'), 
              value: formatCurrency(totalStripeCosts), 
              change: totalStripeCosts > 0 ? `${((totalStripeCosts / splittRevenue) * 100).toFixed(1)}% van omzet` : '0%', 
              positive: false,
              isNegative: true  
            },
            {
              label: 'Netto Winst',
              value: formatCurrency(netProfit),
              change: netProfit > 0 ? `${((netProfit / splittRevenue) * 100).toFixed(1)}% marge` : '0%',
              positive: netProfit > 0,
              isProfit: true
            }
          ]
        }
      } else if (analyticsView === 'restaurant') {
        return {
          title: selectedStore === 'all' ? `${t('dashboard.stats.splittyRevenue.title')} per Restaurant` : `${t('dashboard.chart.metrics.revenue')} ${activeRestaurants.find(r => r.id.toString() === selectedStore)?.name || ''}`,
          subtitle: selectedStore === 'all' ? t('dashboard.sections.bestPerforming.subtitle') : 'Restaurant specifiek',
          cards: selectedStore === 'all' 
            ? filteredRestaurants.slice(0, 3).map((r, i) => ({
                label: r.name,
                value: formatCurrency((150 + i * 50) * 0.70),
                change: `+${10 + i * 2}%`,
                positive: true
              }))
            : [
                { 
                  label: t('dashboard.sections.financialOverview.stripeCosts'), 
                  value: formatCurrency(totalStripeCosts), 
                  change: `${((totalStripeCosts / splittRevenue) * 100).toFixed(1)}% van omzet`, 
                  positive: false,
                  isNegative: true
                },
                {
                  label: 'Netto Winst',
                  value: formatCurrency(netProfit),
                  change: `€${(netProfit / Math.max(1, totalSplittyTransactions)).toFixed(2)} per transactie`,
                  positive: netProfit > 0,
                  isProfit: true
                }
              ]
        }
      } else if (analyticsView === 'regio') {
        return {
          title: `${t('dashboard.stats.splittyRevenue.title')} per ${t('dashboard.analytics.views.region')}`,
          subtitle: 'Geografische verdeling',
          cards: [
            { label: t('dashboard.analytics.regions.northHolland'), value: formatCurrency(splittRevenue * 0.4), change: '+22%', positive: true },
            { label: t('dashboard.analytics.regions.southHolland'), value: formatCurrency(splittRevenue * 0.3), change: '+15%', positive: true },
            { label: t('dashboard.analytics.regions.utrecht'), value: formatCurrency(splittRevenue * 0.2), change: '+8%', positive: true }
          ]
        }
      }
    } else if (selectedMetric === 'verwerkte-betalingen') {
      if (analyticsView === 'totaal') {
        return {
          title: t('dashboard.stats.processedPayments.title'),
          subtitle: 'Totaal transactievolume',
          cards: [
            { 
              label: t('dashboard.sections.financialOverview.stripeCosts'), 
              value: formatCurrency(totalStripeCosts), 
              change: totalStripeCosts > 0 ? `${((totalStripeCosts / totalProcessedPayments) * 100).toFixed(2)}% van volume` : '0%', 
              positive: false,
              isNegative: true 
            },
            {
              label: 'Netto Winst',
              value: formatCurrency(netProfit),
              change: netProfit > 0 ? `€${(netProfit / Math.max(1, totalSplittyTransactions)).toFixed(2)} per transactie` : '€0',
              positive: netProfit > 0,
              isProfit: true
            }
          ]
        }
      } else if (analyticsView === 'restaurant') {
        return {
          title: `${t('dashboard.chart.metrics.payments')} per Restaurant`,
          subtitle: 'Volume per locatie',
          cards: activeRestaurants.slice(0, 3).map((r, i) => ({
            label: r.name,
            value: formatCurrency((2000 + i * 500)),
            change: `+${8 + i * 3}%`,
            positive: true
          }))
        }
      } else if (analyticsView === 'regio') {
        return {
          title: `${t('dashboard.chart.metrics.payments')} per ${t('dashboard.analytics.views.region')}`,
          subtitle: 'Regionale verdeling',
          cards: [
            { label: t('dashboard.analytics.regions.northHolland'), value: formatCurrency(totalProcessedPayments * 0.45), change: '+18%', positive: true },
            { label: t('dashboard.analytics.regions.southHolland'), value: formatCurrency(totalProcessedPayments * 0.35), change: '+14%', positive: true },
            { label: t('dashboard.analytics.regions.utrecht'), value: formatCurrency(totalProcessedPayments * 0.2), change: '+10%', positive: true }
          ]
        }
      }
    }
    // Default fallback
    return {
      title: 'Analytics',
      subtitle: 'Selecteer een metric',
      cards: []
    }
  }

  const analyticsData = getAnalyticsData()

  // Calendar helper functions
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    // Adjust to start on Monday (1) instead of Sunday (0)
    const dayOfWeek = firstDay.getDay()
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(startDate.getDate() - daysToSubtract)
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const isInCurrentMonth = (date: Date, monthDate: Date) => {
    return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date: Date) => {
    if (!selectedDateRange.start) return false
    
    // If only start date is selected
    if (!selectedDateRange.end) {
      return date.toDateString() === selectedDateRange.start.toDateString()
    }
    
    // If both dates are selected, check if date is in range
    return date >= selectedDateRange.start && date <= selectedDateRange.end
  }

  const formatDateForInput = (date: Date) => {
    if (!date) return ''
    // Create a new date and adjust for timezone to avoid off-by-one errors
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateSelect = (date: Date) => {
    if (!selectedDateRange.start || (selectedDateRange.start && selectedDateRange.end)) {
      // Start a new selection
      setSelectedDateRange({ start: date, end: null })
    } else {
      // Complete the selection
      if (date < selectedDateRange.start) {
        setSelectedDateRange({ start: date, end: selectedDateRange.start })
      } else {
        setSelectedDateRange({ start: selectedDateRange.start, end: date })
      }
      // Don't update customDateRange here - wait for Toepassen button
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#111827] mb-1">
              {greeting}, {userName}
            </h1>
            <p className="text-[#6B7280] mb-6">
              {t('dashboard.subtitle')}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {/* Professional Date Range Dropdown */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => {
                    if (!showDatePicker) {
                      // Set temp filter to current dateRange when opening
                      setTempDateFilter(dateRange);
                      
                      // Initialize selection based on current filter
                      if (dateRange === 'today') {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start: today, end: today });
                      } else if (dateRange === 'yesterday') {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        yesterday.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start: yesterday, end: yesterday });
                      } else if (dateRange === 'last7days') {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() - 6);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'last30days') {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() - 29);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'last90days') {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() - 89);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'last365days') {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() - 364);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'lastWeek') {
                        const today = new Date();
                        const start = new Date();
                        start.setDate(today.getDate() - today.getDay() - 7);
                        const end = new Date(start);
                        end.setDate(end.getDate() + 6);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'lastMonth') {
                        const today = new Date();
                        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                        const end = new Date(today.getFullYear(), today.getMonth(), 0);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'lastQuarter') {
                        const today = new Date();
                        const quarter = Math.floor(today.getMonth() / 3);
                        const start = new Date(today.getFullYear(), (quarter - 1) * 3, 1);
                        const end = new Date(today.getFullYear(), quarter * 3, 0);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'lastYear') {
                        const today = new Date();
                        const start = new Date(today.getFullYear() - 1, 0, 1);
                        const end = new Date(today.getFullYear() - 1, 11, 31);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'weekToDate') {
                        const today = new Date();
                        const start = new Date();
                        // Start from Monday instead of Sunday
                        const dayOfWeek = today.getDay();
                        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                        start.setDate(today.getDate() - daysToSubtract);
                        start.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end: today });
                      } else if (dateRange === 'monthToDate') {
                        const today = new Date();
                        const start = new Date(today.getFullYear(), today.getMonth(), 1);
                        start.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end: today });
                      } else if (dateRange === 'quarterToDate') {
                        const today = new Date();
                        const quarter = Math.floor(today.getMonth() / 3);
                        const start = new Date(today.getFullYear(), quarter * 3, 1);
                        start.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end: today });
                      } else if (dateRange === 'yearToDate') {
                        const today = new Date();
                        const start = new Date(today.getFullYear(), 0, 1);
                        start.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end: today });
                      } else if (dateRange === 'custom' && customDateRange.start) {
                        // For custom ranges, load from customDateRange
                        let startDate, endDate = null
                        
                        if (typeof customDateRange.start === 'string') {
                          const [year1, month1, day1] = customDateRange.start.split('-').map(Number)
                          startDate = new Date(year1, month1 - 1, day1)
                        } else {
                          startDate = new Date(customDateRange.start)
                        }
                        
                        if (customDateRange.end) {
                          if (typeof customDateRange.end === 'string') {
                            const [year2, month2, day2] = customDateRange.end.split('-').map(Number)
                            endDate = new Date(year2, month2 - 1, day2)
                          } else {
                            endDate = new Date(customDateRange.end)
                          }
                        }
                        
                        setSelectedDateRange({ start: startDate, end: endDate })
                      } else {
                        setSelectedDateRange({ start: null, end: null })
                      }
                    }
                    setShowDatePicker(!showDatePicker)
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {dateRange === 'today' && t('dashboard.filters.today')}
                    {dateRange === 'yesterday' && t('dashboard.filters.yesterday')}
                    {dateRange === 'last7days' && t('dashboard.filters.last7days')}
                    {dateRange === 'last30days' && t('dashboard.filters.last30days')}
                    {dateRange === 'last90days' && t('dashboard.filters.last90days')}
                    {dateRange === 'last365days' && t('dashboard.filters.last365days')}
                    {dateRange === 'lastWeek' && t('dashboard.filters.lastWeek')}
                    {dateRange === 'lastMonth' && t('dashboard.filters.lastMonth')}
                    {dateRange === 'lastQuarter' && t('dashboard.filters.lastQuarter')}
                    {dateRange === 'lastYear' && t('dashboard.filters.lastYear')}
                    {dateRange === 'weekToDate' && t('dashboard.filters.weekToDate')}
                    {dateRange === 'monthToDate' && t('dashboard.filters.monthToDate')}
                    {dateRange === 'quarterToDate' && t('dashboard.filters.quarterToDate')}
                    {dateRange === 'yearToDate' && t('dashboard.filters.yearToDate')}
                    {dateRange === 'custom' && customDateRange.start && (() => {
                      // Parse dates properly to avoid timezone issues
                      let startDate, endDate = null
                      
                      // Check if customDateRange.start is a string or Date object
                      if (typeof customDateRange.start === 'string') {
                        const [year1, month1, day1] = customDateRange.start.split('-').map(Number)
                        startDate = new Date(year1, month1 - 1, day1)
                      } else {
                        startDate = new Date(customDateRange.start)
                      }
                      
                      if (customDateRange.end) {
                        if (typeof customDateRange.end === 'string') {
                          const [year2, month2, day2] = customDateRange.end.split('-').map(Number)
                          endDate = new Date(year2, month2 - 1, day2)
                        } else {
                          endDate = new Date(customDateRange.end)
                        }
                      }
                      
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      startDate.setHours(0, 0, 0, 0)
                      
                      if (!endDate || customDateRange.start === customDateRange.end) {
                        // Single date
                        return startDate.getTime() === today.getTime() ? t('dashboard.filters.today') : startDate.toLocaleDateString('nl-NL')
                      } else {
                        // Date range
                        return `${startDate.toLocaleDateString('nl-NL')} - ${endDate.toLocaleDateString('nl-NL')}`
                      }
                    })()}
                  </span>
                </button>
                
                {/* Professional Dropdown Menu */}
                {showDatePicker && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50" style={{width: '600px', maxHeight: '400px'}}>
                    <div className="flex h-full" style={{maxHeight: '400px'}}>
                      {/* Left Sidebar with Options */}
                      <div className="w-40 border-r border-gray-200 bg-gray-50 flex flex-col" style={{maxHeight: '400px'}}>
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {/* Quick Picks */}
                          <div className="p-2">
                            <button
                              onClick={() => { 
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start: today, end: today });
                                setTempDateFilter('today');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                                (tempDateFilter ? tempDateFilter === 'today' : dateRange === 'today') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.today')}
                              {dateRange === 'today' && (
                                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => { 
                                const yesterday = new Date();
                                yesterday.setDate(yesterday.getDate() - 1);
                                yesterday.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start: yesterday, end: yesterday });
                                setTempDateFilter('yesterday');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'yesterday' : dateRange === 'yesterday') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.yesterday')}
                            </button>
                          </div>
                          
                          <div className="border-t border-gray-200 mx-2"></div>
                          
                          {/* Relative Periods */}
                          <div className="p-2">
                            <button
                              onClick={() => { 
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 6);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('last7days');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'last7days' : dateRange === 'last7days') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.last7days')}
                            </button>
                            <button
                              onClick={() => { 
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 29);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('last30days');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'last30days' : dateRange === 'last30days') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.last30days')}
                            </button>
                            <button
                              onClick={() => { 
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 89);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('last90days');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'last90days' : dateRange === 'last90days') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.last90days')}
                            </button>
                            <button
                              onClick={() => { 
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 364);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('last365days');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'last365days' : dateRange === 'last365days') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.last365days')}
                            </button>
                          </div>
                          
                          <div className="border-t border-gray-200 mx-2"></div>
                          
                          {/* Calendar Periods */}
                          <div className="p-2">
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date();
                                start.setDate(today.getDate() - today.getDay() - 7);
                                const end = new Date(start);
                                end.setDate(end.getDate() + 6);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('lastWeek');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'lastWeek' : dateRange === 'lastWeek') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.lastWeek')}
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                                const end = new Date(today.getFullYear(), today.getMonth(), 0);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('lastMonth');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'lastMonth' : dateRange === 'lastMonth') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.lastMonth')}
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const quarter = Math.floor(today.getMonth() / 3);
                                const start = new Date(today.getFullYear(), (quarter - 1) * 3, 1);
                                const end = new Date(today.getFullYear(), quarter * 3, 0);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('lastQuarter');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'lastQuarter' : dateRange === 'lastQuarter') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.lastQuarter')}
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date(today.getFullYear() - 1, 0, 1);
                                const end = new Date(today.getFullYear() - 1, 11, 31);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('lastYear');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'lastYear' : dateRange === 'lastYear') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.lastYear')}
                            </button>
                          </div>
                          
                          <div className="border-t border-gray-200 mx-2"></div>
                          
                          {/* To Date Options */}
                          <div className="p-2">
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date();
                                // Start from Monday instead of Sunday
                                const dayOfWeek = today.getDay();
                                const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                                start.setDate(today.getDate() - daysToSubtract);
                                start.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end: today });
                                setTempDateFilter('weekToDate');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'weekToDate' : dateRange === 'weekToDate') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.weekToDate')}
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date(today.getFullYear(), today.getMonth(), 1);
                                start.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end: today });
                                setTempDateFilter('monthToDate');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'monthToDate' : dateRange === 'monthToDate') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.monthToDate')}
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const quarter = Math.floor(today.getMonth() / 3);
                                const start = new Date(today.getFullYear(), quarter * 3, 1);
                                start.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end: today });
                                setTempDateFilter('quarterToDate');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'quarterToDate' : dateRange === 'quarterToDate') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.quarterToDate')}
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date(today.getFullYear(), 0, 1);
                                start.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end: today });
                                setTempDateFilter('yearToDate');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'yearToDate' : dateRange === 'yearToDate') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {t('dashboard.filters.yearToDate')}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Side - Calendar and Date Inputs */}
                      <div className="flex-1 overflow-y-auto" style={{maxHeight: '400px'}}>
                        <div className="p-4 space-y-4">
                          {/* Date Range Inputs */}
                          <div className="grid grid-cols-5 gap-2 items-end">
                            <div className="col-span-2">
                              <label className="block text-[10px] font-medium text-gray-600 mb-1">{t('dashboard.filters.from')}</label>
                              <input
                                type="text"
                                placeholder="DD-MM-JJJJ"
                                value={selectedDateRange.start ? selectedDateRange.start.toLocaleDateString('nl-NL') : ''}
                                onChange={(e) => {
                                  // Parse Dutch date format
                                  const parts = e.target.value.split('-')
                                  if (parts.length === 3) {
                                    const date = new Date(parts[2], parts[1] - 1, parts[0])
                                    if (!isNaN(date)) {
                                      setCustomDateRange({...customDateRange, start: formatDateForInput(date)})
                                      setDateRange('custom')
                                    }
                                  }
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                              />
                            </div>
                            <div className="flex justify-center pb-1.5">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] font-medium text-gray-600 mb-1">{t('dashboard.filters.to')}</label>
                              <input
                                type="text"
                                placeholder="DD-MM-JJJJ"
                                value={selectedDateRange.end ? selectedDateRange.end.toLocaleDateString('nl-NL') : (selectedDateRange.start && !selectedDateRange.end ? selectedDateRange.start.toLocaleDateString('nl-NL') : '')}
                                onChange={(e) => {
                                  // Parse Dutch date format
                                  const parts = e.target.value.split('-')
                                  if (parts.length === 3) {
                                    const date = new Date(parts[2], parts[1] - 1, parts[0])
                                    if (!isNaN(date)) {
                                      setCustomDateRange({...customDateRange, end: formatDateForInput(date)})
                                      setDateRange('custom')
                                    }
                                  }
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                              />
                            </div>
                          </div>
                          
                          {/* Full Calendar */}
                          <div>
                            {/* Calendar Header with Navigation */}
                            <div className="flex items-center justify-between mb-3">
                              <button
                                onClick={() => {
                                  const newDate = new Date(calendarView)
                                  newDate.setMonth(newDate.getMonth() - 1)
                                  setCalendarView(newDate)
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              
                              <div className="flex-1 flex justify-between px-8">
                                <div className="text-left">
                                  <h3 className="text-xs font-semibold text-gray-700 capitalize">
                                    {new Date(calendarView.getFullYear(), calendarView.getMonth() - 1, 1).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
                                  </h3>
                                </div>
                                <div className="text-right">
                                  <h3 className="text-xs font-bold text-gray-900 capitalize">
                                    {calendarView.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
                                  </h3>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => {
                                  const newDate = new Date(calendarView)
                                  newDate.setMonth(newDate.getMonth() + 1)
                                  setCalendarView(newDate)
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Two Month Calendar Grid */}
                            <div className="flex gap-3">
                              {/* Previous Month */}
                              <div className="flex-1">
                                <table className="w-full">
                                  <thead>
                                    <tr className="text-[10px] text-gray-500">
                                      <th className="pb-1 font-normal">ma</th>
                                      <th className="pb-1 font-normal">di</th>
                                      <th className="pb-1 font-normal">wo</th>
                                      <th className="pb-1 font-normal">do</th>
                                      <th className="pb-1 font-normal">vr</th>
                                      <th className="pb-1 font-normal">za</th>
                                      <th className="pb-1 font-normal">zo</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[0, 1, 2, 3, 4, 5].map((weekIndex) => {
                                      const prevMonth = new Date(calendarView.getFullYear(), calendarView.getMonth() - 1, 1)
                                      const days = generateCalendarDays(prevMonth)
                                      const weekDays = days.slice(weekIndex * 7, (weekIndex + 1) * 7)
                                      
                                      return (
                                        <tr key={weekIndex}>
                                          {weekDays.map((day, dayIndex) => {
                                            const inMonth = isInCurrentMonth(day, prevMonth)
                                            const today = isToday(day)
                                            const selected = isSelected(day)
                                            
                                            return (
                                              <td key={dayIndex} className="p-0.5">
                                                {inMonth ? (
                                                  <button
                                                    onClick={() => handleDateSelect(day)}
                                                    className={`w-6 h-6 text-[10px] rounded transition-all ${
                                                      selected ? 'bg-emerald-100 text-emerald-700 font-medium' :
                                                      'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                  >
                                                    {day.getDate()}
                                                  </button>
                                                ) : (
                                                  <div className="w-6 h-6"></div>
                                                )}
                                              </td>
                                            )
                                          })}
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                              </div>
                              
                              {/* Current Month */}
                              <div className="flex-1">
                                <table className="w-full">
                                  <thead>
                                    <tr className="text-[10px] text-gray-500">
                                      <th className="pb-1 font-normal">ma</th>
                                      <th className="pb-1 font-normal">di</th>
                                      <th className="pb-1 font-normal">wo</th>
                                      <th className="pb-1 font-normal">do</th>
                                      <th className="pb-1 font-normal">vr</th>
                                      <th className="pb-1 font-bold text-gray-700">za</th>
                                      <th className="pb-1 font-bold text-gray-700">zo</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[0, 1, 2, 3, 4, 5].map((weekIndex) => {
                                      const days = generateCalendarDays(calendarView)
                                      const weekDays = days.slice(weekIndex * 7, (weekIndex + 1) * 7)
                                      
                                      return (
                                        <tr key={weekIndex}>
                                          {weekDays.map((day, dayIndex) => {
                                            const inMonth = isInCurrentMonth(day, calendarView)
                                            const today = isToday(day)
                                            const selected = isSelected(day)
                                            const futureDate = day > new Date()
                                            
                                            return (
                                              <td key={dayIndex} className="p-0.5">
                                                {inMonth ? (
                                                  <button
                                                    onClick={() => handleDateSelect(day)}
                                                    className={`w-6 h-6 text-[10px] rounded transition-all ${
                                                      futureDate ? 'text-gray-300 cursor-not-allowed' :
                                                      selected ? 'bg-emerald-100 text-emerald-700 font-medium' :
                                                      'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                    disabled={futureDate}
                                                  >
                                                    {day.getDate()}
                                                  </button>
                                                ) : (
                                                  <div className="w-6 h-6"></div>
                                                )}
                                              </td>
                                            )
                                          })}
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Apply/Cancel Buttons - Fixed at bottom */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedDateRange({ start: null, end: null })
                                setShowDatePicker(false)
                                setTempDateFilter(null)
                              }}
                              className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            >
                              {t('dashboard.filters.cancel')}
                            </button>
                            <button
                              onClick={() => {
                                if (selectedDateRange.start) {
                                  const today = new Date()
                                  today.setHours(0, 0, 0, 0)
                                  const startDate = new Date(selectedDateRange.start)
                                  startDate.setHours(0, 0, 0, 0)
                                  
                                  // Check for specific preset ranges
                                  if (!selectedDateRange.end || selectedDateRange.start.getTime() === selectedDateRange.end.getTime()) {
                                    // Single date selected
                                    if (startDate.getTime() === today.getTime()) {
                                      setDateRange('today')
                                      setCustomDateRange({ start: null, end: null })
                                    } else {
                                      // Check if it's yesterday
                                      const yesterday = new Date()
                                      yesterday.setDate(yesterday.getDate() - 1)
                                      yesterday.setHours(0, 0, 0, 0)
                                      
                                      if (startDate.getTime() === yesterday.getTime()) {
                                        setDateRange('yesterday')
                                        setCustomDateRange({ start: null, end: null })
                                      } else {
                                        // Custom single date
                                        setCustomDateRange({ 
                                          start: formatDateForInput(selectedDateRange.start), 
                                          end: formatDateForInput(selectedDateRange.start)
                                        })
                                        setDateRange('custom')
                                      }
                                    }
                                  } else {
                                    // Date range selected - check for preset ranges
                                    const endDate = new Date(selectedDateRange.end)
                                    endDate.setHours(0, 0, 0, 0)
                                    
                                    // Calculate days difference
                                    const daysDiff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))
                                    
                                    // Check for common ranges
                                    if (endDate.getTime() === today.getTime()) {
                                      // First check if a specific filter was selected
                                      if (tempDateFilter && ['lastWeek', 'lastMonth', 'lastQuarter', 'lastYear', 
                                                             'weekToDate', 'monthToDate', 'quarterToDate', 'yearToDate'].includes(tempDateFilter)) {
                                        // If a specific filter was selected, use it
                                        setDateRange(tempDateFilter)
                                        setCustomDateRange({ start: null, end: null })
                                      } else if (daysDiff === 6) {
                                        setDateRange('last7days')
                                        setCustomDateRange({ start: null, end: null })
                                      } else if (daysDiff === 29) {
                                        setDateRange('last30days')
                                        setCustomDateRange({ start: null, end: null })
                                      } else if (daysDiff === 89) {
                                        setDateRange('last90days')
                                        setCustomDateRange({ start: null, end: null })
                                      } else if (daysDiff === 364) {
                                        setDateRange('last365days')
                                        setCustomDateRange({ start: null, end: null })
                                      } else {
                                        // Custom range
                                        setCustomDateRange({ 
                                          start: formatDateForInput(selectedDateRange.start), 
                                          end: formatDateForInput(selectedDateRange.end)
                                        })
                                        setDateRange('custom')
                                      }
                                    } else {
                                      // Custom range
                                      setCustomDateRange({ 
                                        start: formatDateForInput(selectedDateRange.start), 
                                        end: formatDateForInput(selectedDateRange.end)
                                      })
                                      setDateRange('custom')
                                    }
                                  }
                                  setShowDatePicker(false)
                                  setTempDateFilter(null)
                                }
                              }}
                              className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                            >
                              {t('dashboard.filters.apply')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Restaurant Filter Dropdown */}
              <div className="relative" ref={restaurantDropdownRef}>
                <button
                  onClick={() => setShowRestaurantDropdown(!showRestaurantDropdown)}
                  className="px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer min-w-[150px] max-w-[200px] flex items-center justify-between"
                >
                  <span className="truncate">
                    {selectedStore === 'all' 
                      ? t('dashboard.filters.allRestaurants') 
                      : activeRestaurants.find(r => r.id === selectedStore)?.name || 'Selecteer'}
                  </span>
                  <svg className={`ml-2 h-4 w-4 transition-transform ${showRestaurantDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showRestaurantDropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedStore('all')
                        setShowRestaurantDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        selectedStore === 'all' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {t('dashboard.filters.allRestaurants')}
                    </button>
                    {activeRestaurants.map(restaurant => (
                      <button
                        key={restaurant.id}
                        onClick={() => {
                          setSelectedStore(restaurant.id)
                          setShowRestaurantDropdown(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          selectedStore === restaurant.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {restaurant.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Compare Toggle - Disabled */}
              <button
                disabled
                className="px-3 py-2 text-sm rounded-lg border transition-all flex items-center gap-2 bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t('dashboard.filters.compare')}
              </button>

              {/* Show All Button - only show when a metric is selected */}
              {selectedMetric && (
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="px-3 py-2 text-sm rounded-lg border transition-all flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-500 hover:from-emerald-600 hover:to-green-600 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {t('dashboard.filters.allStores')}
                </button>
              )}
            </div>
            
          </div>

          {/* Splitty Admin Stats Cards - Clean Design */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
            {stats.map((stat) => (
              <div 
                key={stat.id} 
                onClick={() => setSelectedMetric(stat.id)}
                className={`rounded-xl p-5 transition-all duration-200 hover:shadow-lg bg-white border cursor-pointer ${
                  selectedMetric === stat.id
                    ? 'border-emerald-400 shadow-lg ring-2 ring-emerald-200'
                    : stat.priority === 'primary' 
                      ? 'border-emerald-200 shadow-md' 
                      : 'border-gray-100 shadow-sm'
                }`}
              >
                {/* Simplified Card Content */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    {stat.icon && React.createElement(stat.icon, { className: `h-4 w-4 ${stat.iconColor}` })}
                  </div>
                  {stat.trend !== 'neutral' && (
                    <span className={`text-xs font-semibold ${stat.changeColor}`}>
                      {stat.change}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <p className={`font-bold text-gray-900 ${
                      stat.priority === 'primary' ? 'text-2xl' : 'text-xl'
                    }`}>
                      {stat.value}
                    </p>
                    {stat.subValue && (
                      <span className="text-xs text-gray-500">
                        {stat.subValue}
                      </span>
                    )}
                  </div>
                  {stat.description && (
                    <p className="text-xs text-gray-400 mt-1">
                      {stat.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Financial Overview */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.sections.financialOverview.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stripe Costs Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-orange-50">
                    <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full font-medium bg-orange-50 text-orange-700">
                    €0,29 {t('dashboard.sections.financialOverview.perTransaction')}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-2 text-orange-600">
                  -{formatCurrency(totalStripeCosts)}
                </div>
                <div className="text-sm text-[#6B7280] mb-2">
                  {t('dashboard.sections.financialOverview.stripeCosts')}
                </div>
                <div className="text-xs text-[#9CA3AF] mt-3 pt-3 border-t border-gray-100">
                  {t('dashboard.sections.financialOverview.transactionCosts')}
                </div>
              </div>

              {/* Net Profit Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-red-50">
                    <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${netProfit > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {netProfit > 0 ? t('dashboard.sections.financialOverview.profit') : t('dashboard.sections.financialOverview.loss')}
                  </div>
                </div>
                <div className={`text-2xl font-bold mb-2 ${netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netProfit > 0 ? '' : '-'}{formatCurrency(Math.abs(netProfit))}
                </div>
                <div className="text-sm text-[#6B7280] mb-2">
                  {t('dashboard.sections.financialOverview.netProfit')}
                </div>
                <div className="text-xs text-[#9CA3AF] mt-3 pt-3 border-t border-gray-100">
                  €{totalSplittyTransactions > 0 ? (Math.abs(netProfit) / totalSplittyTransactions).toFixed(2) : '0.00'} {netProfit > 0 ? t('dashboard.sections.financialOverview.profit').toLowerCase() : 'verlies'} {t('dashboard.sections.financialOverview.perTransaction')}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100/20 to-emerald-100/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {selectedMetric === 'splitty-omzet' ? `${t('dashboard.stats.splittyRevenue.title')} Overzicht` :
                       selectedMetric === 'verwerkte-betalingen' ? `${t('dashboard.stats.processedPayments.title')} Overzicht` :
                       selectedMetric === 'aantal-transacties' ? `${t('dashboard.stats.totalTransactions.title')} Overzicht` :
                       selectedMetric === 'gemiddeld-bedrag' ? `${t('dashboard.stats.averageAmount.title')} Overzicht` :
                       selectedMetric === 'actieve-restaurants' ? `Restaurant Portfolio Overzicht` :
                       selectedMetric === 'tafelgrootte' ? `${t('dashboard.stats.tableSize.title')} Analyse` :
                       t('dashboard.chart.title')}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200">
                        {selectedMetric ? stats.find(s => s.id === selectedMetric)?.title : t('dashboard.chart.allMetrics')}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>
                        {selectedMetric === 'actieve-restaurants' ? 
                          `${restaurants.filter(r => r.status === 'active' || r.status === 'live').length} actief, ${restaurants.filter(r => r.status !== 'active' && r.status !== 'live').length} in wachtrij` : 
                        selectedMetric === 'tafelgrootte' ?
                          (dateRange === 'today' ? t('dashboard.filters.today') :
                           dateRange === 'yesterday' ? t('dashboard.filters.yesterday') :
                           dateRange === 'last7days' ? t('dashboard.filters.last7days') :
                           dateRange === 'last30days' ? t('dashboard.filters.last30days') :
                           dateRange === 'last90days' ? t('dashboard.filters.last90days') :
                           dateRange === 'last365days' ? t('dashboard.filters.last365days') :
                           dateRange === 'lastWeek' ? 'Vorige week' :
                           dateRange === 'lastMonth' ? 'Vorige maand' :
                           dateRange === 'lastQuarter' ? 'Vorig kwartaal' :
                           dateRange === 'lastYear' ? 'Vorig jaar' :
                           dateRange === 'weekToDate' ? 'Deze week' :
                           dateRange === 'monthToDate' ? 'Deze maand' :
                           dateRange === 'quarterToDate' ? 'Dit kwartaal' :
                           dateRange === 'yearToDate' ? 'Dit jaar' : 'Periode') :
                        dateRange === 'today' ? t('dashboard.chart.perHour') : t('dashboard.chart.perDay')}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(!selectedMetric || selectedMetric === 'splitty-omzet') && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
                        <span className="text-xs font-medium text-gray-700">{t('dashboard.stats.splittyRevenue.title')}</span>
                      </div>
                    )}
                    {(!selectedMetric || selectedMetric === 'verwerkte-betalingen') && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                        <span className="text-xs font-medium text-gray-700">{t('dashboard.stats.processedPayments.title')}</span>
                      </div>
                    )}
                    {(!selectedMetric || selectedMetric === 'aantal-transacties') && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                        <span className="text-xs font-medium text-gray-700">{t('dashboard.stats.totalTransactions.title')}</span>
                      </div>
                    )}
                    {(!selectedMetric || selectedMetric === 'gemiddeld-bedrag') && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                        <span className="text-xs font-medium text-gray-700">{t('dashboard.stats.averageAmount.title')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur rounded-xl p-4">
                  {selectedMetric === 'tafelgrootte' ? (
                    // Table size metrics view
                    <div className="h-[320px] overflow-y-auto">
                      <div className="space-y-4">
                        {/* Main metric card */}
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-white rounded-lg shadow-sm">
                                <UserGroupIcon className="w-6 h-6 text-teal-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.tableSize.title')}</p>
                                <p className="text-3xl font-bold text-gray-900">4.2 <span className="text-lg font-normal text-gray-600">{t('dashboard.stats.tableSize.unit')}</span></p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-teal-600">+5.2%</span>
                              <p className="text-xs text-gray-500">vs. vorige maand</p>
                            </div>
                          </div>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Total Tables Served */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-teal-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-emerald-50 rounded-lg">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">Live data</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{Math.floor(totalSplittyTransactions / 4.2)}</p>
                            <p className="text-sm text-gray-600 mt-1">Tafels Bediend</p>
                            <p className="text-xs text-gray-400 mt-2">Totaal aantal tafels met Splitty betaling</p>
                          </div>

                          {/* Total Payments */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-teal-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <CreditCardIcon className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">Splitty payments</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{Math.round(totalSplittyTransactions)}</p>
                            <p className="text-sm text-gray-600 mt-1">Totale Betalingen</p>
                            <p className="text-xs text-gray-400 mt-2">Individuele Splitty transacties</p>
                          </div>

                          {/* Most Common Group Size */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-teal-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">Meest voorkomend</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">4 <span className="text-lg font-normal text-gray-600">{t('dashboard.stats.tableSize.unit')}</span></p>
                            <p className="text-sm text-gray-600 mt-1">Populairste Groepsgrootte</p>
                            <p className="text-xs text-gray-400 mt-2">32% van alle tafels</p>
                          </div>

                          {/* Average Payment per Person */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-teal-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-orange-50 rounded-lg">
                                <BanknotesIcon className="w-4 h-4 text-orange-600" />
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 font-medium">Per persoon</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">€{(avgTransactionAmount / 4.2).toFixed(2)}</p>
                            <p className="text-sm text-gray-600 mt-1">Gemiddeld per Persoon</p>
                            <p className="text-xs text-gray-400 mt-2">Bedrag per persoon aan tafel</p>
                          </div>
                        </div>

                        {/* Group Size Distribution */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">Verdeling Groepsgrootte</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-sm text-gray-600">1-2 {t('dashboard.stats.tableSize.unit')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">25%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                <span className="text-sm text-gray-600">3-4 {t('dashboard.stats.tableSize.unit')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">45%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-600">5-6 {t('dashboard.stats.tableSize.unit')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">20%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                <span className="text-sm text-gray-600">7+ {t('dashboard.stats.tableSize.unit')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">10%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedMetric === 'actieve-restaurants' ? (
                    // Restaurant list view
                    <div className="h-[320px] overflow-y-auto">
                      {/* Growth indicator */}
                      <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-gray-700">Portfolio Groei Deze Maand</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const now = new Date();
                              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                              const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                              const daysPassed = now.getDate();
                              
                              // Calculate growth based on active restaurants
                              const activeCount = restaurants.filter(r => r.status === 'active' && !r.deleted).length;
                              const expectedCount = Math.round((daysPassed / daysInMonth) * 10); // Target 10 restaurants per month
                              const growthPercentage = expectedCount > 0 ? ((activeCount / expectedCount) * 100 - 100).toFixed(1) : 0;
                              
                              // Simulated growth for demo (20% growth since start of month)
                              const demoGrowth = 20 + (daysPassed * 0.5); // Grows throughout the month
                              
                              return (
                                <>
                                  <span className={`text-lg font-bold ${demoGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    +{demoGrowth.toFixed(1)}%
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({daysPassed}/{daysInMonth} dagen)
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min(100, (new Date().getDate() / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Active Restaurants Column */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            {t('dashboard.stats.activeRestaurants.title')} ({restaurants.filter(r => r.status === 'active' && !r.deleted).length})
                          </h3>
                          <div className={restaurants.filter(r => r.status === 'active' && !r.deleted).length > 3 ? "max-h-[180px] overflow-y-auto pr-2 custom-scrollbar" : ""}>
                            {restaurants.filter(r => r.status === 'active' && !r.deleted).length > 0 ? (
                              restaurants.filter(r => r.status === 'active' && !r.deleted).map((restaurant, index) => (
                              <div key={restaurant.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-colors mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {restaurant.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{restaurant.name}</p>
                                    <p className="text-xs text-gray-500">{restaurant.location}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-medium text-gray-900">{restaurant.revenue || '€0'}</p>
                                  <p className="text-xs text-gray-500">{restaurant.totalOrders || 0} orders</p>
                                </div>
                              </div>
                            ))) : (
                              <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <p className="text-sm text-gray-500">Nog geen actieve restaurants</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* To Be Onboarded Column */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            Te Onboarden ({restaurants.filter(r => !r.isOnboarded && !r.deleted).length})
                          </h3>
                          <div className={restaurants.filter(r => !r.isOnboarded && !r.deleted).length > 3 ? "max-h-[180px] overflow-y-auto pr-2 custom-scrollbar" : ""}>
                            {restaurants.filter(r => !r.isOnboarded && !r.deleted).length > 0 ? (
                              restaurants.filter(r => !r.isOnboarded && !r.deleted).map((restaurant, index) => (
                              <div key={restaurant.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-amber-200 transition-colors mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {restaurant.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{restaurant.name}</p>
                                  <p className="text-xs text-gray-500">{restaurant.location}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  Wacht op onboarding
                                </span>
                              </div>
                            </div>
                            ))) : (
                              <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <p className="text-sm text-gray-500">Alle restaurants zijn onboarded</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <LazyDashboardAnalytics 
                      chartData={chartData} 
                      selectedMetric={selectedMetric} 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Best Performing Restaurants Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-100/20 to-amber-100/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {t('dashboard.sections.bestPerforming.title')}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200">
                        {t('dashboard.sections.bestPerforming.liveRankings')}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{t('dashboard.sections.bestPerforming.subtitle')}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-xs font-medium text-gray-700">
                      {t('dashboard.sections.bestPerforming.exportCSV')}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur rounded-xl overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                    {bestPerformingRestaurants.slice(0, 3).map((restaurant, index) => {
                      const medals = ['🥇', '🥈', '🥉'];
                      const borderColors = ['border-yellow-400', 'border-gray-400', 'border-orange-400'];
                      const bgColors = ['bg-gradient-to-br from-yellow-50 to-amber-50', 'bg-gradient-to-br from-gray-50 to-slate-50', 'bg-gradient-to-br from-orange-50 to-amber-50'];
                      
                      return (
                        <div 
                          key={restaurant.id}
                          className={`relative rounded-xl p-5 border-2 ${borderColors[index]} ${bgColors[index]} hover:shadow-lg transition-all duration-200`}
                        >
                          <div className="absolute top-3 right-3 text-2xl">{medals[index]}</div>
                          
                          <div className="mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{restaurant.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">#{index + 1} {t('dashboard.sections.bestPerforming.inRevenue')}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">{t('dashboard.chart.metrics.revenue')}</p>
                              <p className="text-xl font-bold text-emerald-600">{restaurant.revenue}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">{t('dashboard.sections.bestPerforming.columns.transactions')}</p>
                                <p className="font-semibold text-gray-900">{restaurant.transactions}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Rating</p>
                                <div className="flex items-center">
                                  <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="font-semibold text-gray-900 ml-1">{restaurant.rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Splitty Fee</span>
                                <span className="text-sm font-bold text-emerald-600">
                                  €{(restaurant.transactions * 0.70).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {bestPerformingRestaurants.length > 3 && (
                    <div className="border-t border-gray-100 px-4 py-3">
                      <button className="w-full text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                        {t('dashboard.sections.openQuotations.viewAll')} {bestPerformingRestaurants.length} restaurants →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
