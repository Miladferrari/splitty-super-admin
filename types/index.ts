// Shared type definitions for Super Admin panel
import React from 'react'

// User types
export interface User {
  id: number
  email: string
  password: string
  name: string
  role: 'ceo' | 'admin' | 'account_manager' | 'support' | 'developer' | 'staff'
  lastLogin: Date | string | null
  created: Date | string
  avatar?: string
  restaurantId?: number
  permissions?: string[]
  isActive?: boolean
}

// Restaurant types
export interface Restaurant {
  id: number
  name: string
  location?: string
  status: 'active' | 'inactive' | 'pending'
  deleted: boolean
  logo?: string
  email?: string
  phone?: string
  tables?: number
  revenue?: string
  activeOrders?: number
  totalOrders?: number
  created: Date | string
  isOnboarded?: boolean
  address?: string
  city?: string
  postalCode?: string
  contactPerson?: string
  stripeConnected?: boolean
  posSystem?: string
  averageOrderValue?: number
  deletedAt?: Date | null
  staff?: StaffMember[]
  onboardingStep?: number
}

// Staff/Personnel types
export interface StaffMember {
  id?: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'manager' | 'admin' | 'staff'
  lastActive?: string
  status?: 'active' | 'inactive'
}

// Order types
export interface Order {
  id: number
  restaurantId?: number
  restaurantName?: string
  restaurant?: string // For compatibility with RecentOrdersTable
  tableNumber?: number
  table?: string // For compatibility with RecentOrdersTable
  status: 'pending' | 'in-progress' | 'in_progress' | 'completed' | 'cancelled'
  totalAmount?: string | number
  amount?: number // For compatibility with RecentOrdersTable
  paid?: number // For compatibility with RecentOrdersTable
  customerName?: string
  orderTime?: string
  created?: Date // For compatibility with RecentOrdersTable
  completedTime?: string
  items?: OrderItem[]
  paymentMethod?: string
  progress?: number
  isSplit?: boolean // For compatibility with RecentOrdersTable
}

export interface OrderItem {
  id: number
  name: string
  quantity: number
  price: number
}

// Payment types
export interface Payment {
  id: number
  orderId?: number
  restaurantId?: number
  restaurantName?: string
  restaurant?: string // For RecentPaymentsTable compatibility
  amount: string | number
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  method: 'card' | 'cash' | 'ideal' | 'paypal' | string
  customerName?: string
  date: string | Date // For RecentPaymentsTable compatibility
  transactionId?: string
  fee?: number
  net?: number
}

// Onboarding types
export interface OnboardingData {
  currentStep?: number
  restaurantId?: string | number
  basicInfo?: {
    name?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    postalCode?: string
    contactPerson?: string
  }
  personnelData?: StaffMember[]
  stripeData?: {
    accountId?: string
    connected?: boolean
    chargesEnabled?: boolean
  }
  posData?: {
    posType?: string
    apiKey?: string
    integrated?: boolean
  }
  qrStandData?: {
    quantity?: number
    deliveryAddress?: string
    ordered?: boolean
  }
  googleReviewData?: {
    placeId?: string
    enabled?: boolean
  }
}

// Chart/Analytics types
export interface ChartDataPoint {
  name: string
  value: number
  date?: string
  revenue?: number
  orders?: number
  payments?: number
}

export interface DateRange {
  start: Date
  end: Date
}

// Status configuration types
export interface StatusConfig {
  label?: string
  bgColor?: string
  textColor?: string
  dotColor?: string
  // For RecentOrdersTable compatibility
  color?: string
  icon?: React.ComponentType<{ className: string }>
  text?: string
}

export type StatusConfigMap<T extends string> = Record<T, StatusConfig>

// Language types
export interface Language {
  code: string
  name: string
  flag?: string
}

// Navigation types
export type UserRole = 'ceo' | 'admin' | 'account_manager' | 'support' | 'developer' | 'staff'

export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  roles: UserRole[]
  badge?: number | string
  children?: NavigationItem[]
}

// Form types
export interface FormData {
  [key: string]: string | number | boolean | undefined
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}