import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import db from '../utils/database'
import { Restaurant, StaffMember } from '../types'

interface RestaurantsContextValue {
  restaurants: Restaurant[]
  addRestaurant: (restaurantData: Partial<Restaurant>) => Restaurant
  updateRestaurant: (restaurantId: number | string, updates: Partial<Restaurant>) => void
  updateRestaurantStaff: (restaurantId: number | string, staff: StaffMember[]) => void
  deleteRestaurant: (restaurantId: number | string) => boolean
  deleteRestaurantPermanently: (restaurantId: number | string) => boolean
  restoreRestaurant: (restaurantId: number | string) => boolean
  getRestaurant: (restaurantId: number | string) => Restaurant | undefined
  getActiveRestaurants: () => Restaurant[]
  getDeletedRestaurants: () => Restaurant[]
}

const RestaurantsContext = createContext<RestaurantsContextValue | undefined>(undefined)

export function useRestaurants(): RestaurantsContextValue {
  const context = useContext(RestaurantsContext)
  if (!context) {
    throw new Error('useRestaurants must be used within a RestaurantsProvider')
  }
  return context
}

interface RestaurantsProviderProps {
  children: ReactNode
}

export function RestaurantsProvider({ children }: RestaurantsProviderProps) {
  // Initialize with default restaurants - Only Limon B.V. and Splitty
  const defaultRestaurants: Restaurant[] = [
    {
      id: 6,
      name: 'Limon B.V.',
      location: 'Amsterdam, Netherlands',
      status: 'active' as const,
      deleted: false,
      logo: 'https://res.cloudinary.com/dylmngivm/image/upload/v1746460172/restaurant_logos/wihua9omfsnhbqbrcfji.png',
      email: 'info@limon.nl',
      phone: '+31 20 555 1234',
      tables: 20,
      revenue: '€156,890',
      activeOrders: 15,
      totalOrders: 1567,
      created: new Date('2024-01-01'),
      isOnboarded: true,
    },
    {
      id: 16,
      name: 'Splitty',
      location: 'Amsterdam, Netherlands',
      status: 'active' as const,
      deleted: false,
      logo: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753701510/restaurant_logos/k9up5gzm7mzv0zze1mg4.png',
      email: 'contact@splitty.com',
      phone: '+31 20 123 4567',
      tables: 30,
      revenue: '€98,760',
      activeOrders: 8,
      totalOrders: 956,
      created: new Date('2024-02-01'),
      isOnboarded: true,
    },
  ]

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  // Load restaurants from localStorage on mount
  useEffect(() => {
    const storedRestaurants = db.getRestaurants()
    
    // Force reset to only keep Limon B.V. and Splitty
    // Remove this condition after first load if you want to preserve changes
    const shouldReset = storedRestaurants && storedRestaurants.some(r => 
      r.name === 'Loetje' ||
      r.name === 'Restaurant Stefan' || 
      r.name === 'Aldenaire catering' ||
      r.name === 'Viresh Kewalbansing' ||
      r.name === 'Anatolii Restaurant' ||
      r.deleted === true
    )
    
    if (shouldReset || !storedRestaurants || storedRestaurants.length === 0) {
      // Initialize with default restaurants (Only Limon B.V. and Splitty)
      db.setRestaurants(defaultRestaurants)
      setRestaurants(defaultRestaurants)
    } else {
      setRestaurants(storedRestaurants)
    }
  }, [])

  // Save to localStorage whenever restaurants change
  useEffect(() => {
    if (restaurants.length > 0) {
      db.setRestaurants(restaurants)
    }
  }, [restaurants])

  const deleteRestaurant = (restaurantId: number | string): boolean => {
    console.log('Deleting restaurant with ID:', restaurantId)
    const id = typeof restaurantId === 'string' ? parseInt(restaurantId) : restaurantId
    const restaurant = restaurants.find(r => r.id === id)
    console.log('Found restaurant:', restaurant)
    
    if (!restaurant) {
      return false
    }
    
    // Check if restaurant has started onboarding
    let hasStartedOnboarding = false
    if (!restaurant.isOnboarded && typeof window !== 'undefined') {
      const savedData = localStorage.getItem(`onboarding_${restaurantId}`)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        // Check if any step has been completed (currentStep > 1 or any staff added)
        hasStartedOnboarding = (parsed.currentStep && parsed.currentStep > 1) || 
                               (parsed.staff && parsed.staff.length > 0)
      }
    }
    
    // If restaurant is not onboarded AND has not started onboarding, delete permanently
    if (!restaurant.isOnboarded && !hasStartedOnboarding) {
      console.log('Restaurant has not started onboarding, deleting permanently')
      setRestaurants(prev => prev.filter(r => r.id !== id))
      // Also clean up any onboarding data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`onboarding_${restaurantId}`)
      }
      return true
    } else {
      console.log('Restaurant is onboarded or has started onboarding, archiving')
      // Otherwise, archive it
      setRestaurants(prev => prev.map(r => 
        r.id === id 
          ? { ...r, deleted: true, deletedAt: new Date() }
          : r
      ))
      return true
    }
  }
  
  const deleteRestaurantPermanently = (restaurantId: number | string): boolean => {
    const id = typeof restaurantId === 'string' ? parseInt(restaurantId) : restaurantId
    setRestaurants(prev => prev.filter(restaurant => 
      restaurant.id !== id
    ))
    // Also clean up any onboarding data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`onboarding_${restaurantId}`)
    }
    return true
  }

  const restoreRestaurant = (restaurantId: number | string): boolean => {
    const id = typeof restaurantId === 'string' ? parseInt(restaurantId) : restaurantId
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === id
        ? { ...restaurant, deleted: false, deletedAt: null }
        : restaurant
    ))
    return true
  }

  const addRestaurant = (restaurantData: Partial<Restaurant>): Restaurant => {
    const newRestaurant: Restaurant = {
      name: '',
      status: 'pending' as const,
      ...restaurantData,
      id: Math.max(...restaurants.map(r => r.id), 0) + 1,
      deleted: false,
      created: new Date(),
      revenue: '€0',
      activeOrders: 0,
      totalOrders: 0,
      isOnboarded: false,
      onboardingStep: 0,
    }
    setRestaurants(prev => [...prev, newRestaurant])
    return newRestaurant
  }

  const getRestaurant = (restaurantId: number | string): Restaurant | undefined => {
    const id = typeof restaurantId === 'string' ? parseInt(restaurantId) : restaurantId
    return restaurants.find(restaurant => restaurant.id === id)
  }

  const getActiveRestaurants = () => {
    return restaurants.filter(restaurant => !restaurant.deleted)
  }

  const getDeletedRestaurants = () => {
    return restaurants.filter(restaurant => restaurant.deleted === true)
  }

  const updateRestaurant = (restaurantId: number | string, updates: Partial<Restaurant>): void => {
    const id = typeof restaurantId === 'string' ? parseInt(restaurantId) : restaurantId
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === id
        ? { ...restaurant, ...updates }
        : restaurant
    ))
  }

  const updateRestaurantStaff = (restaurantId: number | string, staff: StaffMember[]) => {
    const id = typeof restaurantId === 'string' ? parseInt(restaurantId) : restaurantId
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === id
        ? { ...restaurant, staff: staff }
        : restaurant
    ))
  }

  return (
    <RestaurantsContext.Provider value={{
      restaurants,
      deleteRestaurant,
      deleteRestaurantPermanently,
      restoreRestaurant,
      addRestaurant,
      getRestaurant,
      getActiveRestaurants,
      getDeletedRestaurants,
      updateRestaurant,
      updateRestaurantStaff,
    }}>
      {children}
    </RestaurantsContext.Provider>
  )
}