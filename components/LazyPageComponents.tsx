import dynamic from 'next/dynamic'
import React from 'react'

// Loading component for heavy pages
const PageLoader = ({ message = 'Loading page...' }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-lg text-gray-600 dark:text-gray-300">{message}</p>
      <div className="flex space-x-1">
        <div className="animate-bounce h-2 w-2 bg-blue-600 rounded-full delay-0"></div>
        <div className="animate-bounce h-2 w-2 bg-blue-600 rounded-full delay-150"></div>
        <div className="animate-bounce h-2 w-2 bg-blue-600 rounded-full delay-300"></div>
      </div>
    </div>
  </div>
)

// Lazy load heavy page components
export const LazyDashboard = dynamic(
  () => import('../pages/dashboard'),
  {
    loading: () => <PageLoader message="Loading Dashboard..." />,
    ssr: false
  }
)

export const LazyRestaurants = dynamic(
  () => import('../pages/restaurants'),
  {
    loading: () => <PageLoader message="Loading Restaurants..." />,
    ssr: false
  }
)

export const LazySettings = dynamic(
  () => import('../pages/settings'),
  {
    loading: () => <PageLoader message="Loading Settings..." />,
    ssr: false
  }
)

export const LazyOrders = dynamic(
  () => import('../pages/orders'),
  {
    loading: () => <PageLoader message="Loading Orders..." />,
    ssr: false
  }
)

export const LazyPayments = dynamic(
  () => import('../pages/payments'),
  {
    loading: () => <PageLoader message="Loading Payments..." />,
    ssr: false
  }
)

export const LazyUsers = dynamic(
  () => import('../pages/users'),
  {
    loading: () => <PageLoader message="Loading Users..." />,
    ssr: false
  }
)

export const LazyTables = dynamic(
  () => import('../pages/tables'),
  {
    loading: () => <PageLoader message="Loading Tables..." />,
    ssr: false
  }
)

export const LazyPOS = dynamic(
  () => import('../pages/pos'),
  {
    loading: () => <PageLoader message="Loading POS System..." />,
    ssr: false
  }
)