import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Loading component for charts
const ChartLoader = () => (
  <div className="flex items-center justify-center h-80 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading chart...</p>
    </div>
  </div>
)

// Note: Recharts components are now lazy-loaded at the component level
// rather than individual component level to avoid TypeScript complexity

// Lazy load the existing chart components
export const LazyRevenueChart = dynamic(
  () => import('./RevenueChart'),
  {
    loading: () => <ChartLoader />,
    ssr: false
  }
)

export const LazyPaymentMethodsChart = dynamic(
  () => import('./PaymentMethodsChart'),
  {
    loading: () => <ChartLoader />,
    ssr: false
  }
)

// Note: SendbirdSupport requires the 'sendbird' package to be installed
// Uncomment when sendbird package is added to the project
// export const LazySendbirdSupport = dynamic(
//   () => import('./SendbirdSupport'),
//   {
//     loading: () => (
//       <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-lg">
//         <div className="flex flex-col items-center gap-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="text-lg text-gray-600 dark:text-gray-300">Loading Support Chat...</p>
//           <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment</p>
//         </div>
//       </div>
//     ),
//     ssr: false
//   }
// )

// Lazy load the entire dashboard analytics section
export const LazyDashboardAnalytics = dynamic(
  () => import('./DashboardAnalytics'),
  {
    loading: () => <ChartLoader />,
    ssr: false
  }
)

// Table loading component
const TableLoader = () => (
  <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading table data...</p>
    </div>
  </div>
)

// Lazy load table components
export const LazyRecentOrdersTable = dynamic(
  () => import('./RecentOrdersTable'),
  {
    loading: () => <TableLoader />,
    ssr: false
  }
)

export const LazyRecentPaymentsTable = dynamic(
  () => import('./RecentPaymentsTable'),
  {
    loading: () => <TableLoader />,
    ssr: false
  }
)