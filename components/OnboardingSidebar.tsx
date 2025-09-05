import React, { useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTranslation } from '../contexts/TranslationContext'
import {
  UserGroupIcon,
  CreditCardIcon,
  WifiIcon,
  StarIcon,
  QrCodeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import RestaurantDeleteModal from './RestaurantDeleteModal'
import { useRestaurants } from '../contexts/RestaurantsContext'
import { Restaurant, OnboardingData } from '../types'

interface OnboardingStep {
  id: number
  name: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}


interface OnboardingSidebarProps {
  currentStep: number
  completedSteps?: number[]
  onStepChange?: (stepId: number) => void
  restaurant?: Restaurant
  children: ReactNode
}

type StepStatus = 'completed' | 'current' | 'available' | 'locked'

const OnboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    name: 'personnel',
    description: 'personnel',
    icon: UserGroupIcon,
  },
  {
    id: 2,
    name: 'stripe',
    description: 'stripe',
    icon: CreditCardIcon,
  },
  {
    id: 3,
    name: 'posApi',
    description: 'posApi',
    icon: WifiIcon,
  },
  {
    id: 4,
    name: 'qrHolders',
    description: 'qrHolders',
    icon: QrCodeIcon,
  },
  {
    id: 5,
    name: 'googleReviews',
    description: 'googleReviews',
    icon: StarIcon,
  }
]

const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({ 
  currentStep, 
  completedSteps = [], 
  onStepChange, 
  restaurant,
  children 
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { deleteRestaurant } = useRestaurants()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  const getStepStatus = (stepId: number): StepStatus => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (stepId === currentStep) return 'current'
    
    // For archived restaurants, check what was previously accessible
    if (restaurant?.deleted) {
      // Check localStorage to see which steps were visited
      const savedData = typeof window !== 'undefined' 
        ? localStorage.getItem(`onboarding_${restaurant?.id}`)
        : null
      
      if (savedData) {
        try {
          const parsedData: OnboardingData = JSON.parse(savedData)
          
          // Check if this step has any data
          if (stepId === 1 && parsedData.personnelData) return 'available'
          if (stepId === 2 && parsedData.stripeData) return 'available'
          if (stepId === 3 && parsedData.posData) return 'available'
          if (stepId === 4 && parsedData.qrStandData) return 'available'
          if (stepId === 5 && parsedData.googleReviewData) return 'available'
        } catch (e) {
          // Invalid JSON, fall through to locked
        }
      }
      
      return 'locked'
    }
    
    // For active restaurants: all steps are available
    // Users can complete them in any order they prefer
    return 'available'
  }

  const handleStepClick = (stepId: number): void => {
    const status = getStepStatus(stepId)
    if (status !== 'locked' && onStepChange) {
      onStepChange(stepId)
    }
  }

  const handleDeleteConfirm = (): void => {
    if (restaurant) {
      deleteRestaurant(restaurant.id)
      router.push('/restaurants')
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-gray-200 border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="mr-3 p-2 rounded-lg transition bg-gray-50 text-gray-900 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{restaurant?.name} Onboarding</h1>
              <p className="text-sm text-gray-600">{t('restaurants.onboarding.step')} {currentStep} {t('restaurants.onboarding.of')} 4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 bg-white border-gray-200 border-r fixed h-screen overflow-y-auto">
          <div className="p-6 flex flex-col h-full">
            {/* Header */}
            <div className="mb-6">
              <Link
                href="/restaurants"
                className="inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium mb-4 group bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-100 hover:border-green-300"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('restaurants.onboarding.backToRestaurants')}
              </Link>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{restaurant?.name}</h2>
                <p className="text-sm text-gray-600">{t('restaurants.onboarding.restaurantOnboarding')}</p>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="mb-6 rounded-xl p-4 border bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  {t('restaurants.onboarding.progress')}
                </span>
                <span className="text-xs font-medium text-green-600">
                  {completedSteps.length}/5
                </span>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden shadow-inner bg-gray-50">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative"
                  style={{ width: `${(completedSteps.filter(step => step <= 3).length / 3) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-green-200/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Scrollable Steps Section */}
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              <div className="space-y-2">
                {/* Required Steps */}
                {OnboardingSteps.slice(0, 3).map((step) => {
                  const status = getStepStatus(step.id)
                  const isClickable = status !== 'locked'
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                        status === 'current'
                          ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 shadow-lg shadow-green-200 cursor-pointer'
                          : status === 'completed'
                          ? 'bg-gray-50 border border-green-300 hover:bg-gray-100 hover:border-green-400 cursor-pointer'
                          : status === 'available'
                          ? 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-green-300 cursor-pointer'
                          : 'bg-gray-50/50 border border-gray-200/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2.5 rounded-lg mr-3 transition-all ${
                          status === 'current'
                            ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-md'
                            : status === 'completed'
                            ? 'bg-green-500'
                            : status === 'available'
                            ? 'bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-green-50 group-hover:to-green-100'
                            : 'bg-white/50'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircleIcon className="h-5 w-5 text-black" />
                          ) : (
                            <step.icon className={`h-5 w-5 ${
                              status === 'current' 
                                ? 'text-black' 
                                : status === 'available' 
                                ? 'text-gray-900 group-hover:text-green-600' 
                                : 'text-gray-600/50'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${
                              status === 'current' || status === 'completed' 
                                ? 'text-gray-900' 
                                : 'text-gray-600'
                            }`}>
                              {t(`restaurants.onboarding.sidebar.steps.${step.name}.name`)}
                            </h3>
                            <div className={`w-2 h-2 rounded-full ${
                              status === 'completed'
                                ? 'bg-green-500'
                                : status === 'current'
                                ? 'bg-blue-400'
                                : status === 'available'
                                ? 'bg-yellow-400'
                                : 'bg-gray-300'
                            }`} />
                          </div>
                          <p className="text-sm mt-1 text-gray-600">{t(`restaurants.onboarding.sidebar.steps.${step.description}.description`)}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}

                {/* Optional Section Separator */}
                <div className="py-4">
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-xs font-medium rounded-full text-yellow-600 bg-yellow-50">
                      {t('restaurants.onboarding.sidebar.optionalLater')}
                    </span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                </div>

                {/* Optional Steps */}
                {OnboardingSteps.slice(3).map((step) => {
                  const status = getStepStatus(step.id)
                  const isClickable = status !== 'locked'
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                        status === 'current'
                          ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 shadow-lg shadow-green-200 cursor-pointer'
                          : status === 'completed'
                          ? 'bg-gray-50 border border-green-300 hover:bg-gray-100 hover:border-green-400 cursor-pointer'
                          : status === 'available'
                          ? 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-green-300 cursor-pointer'
                          : 'bg-gray-50/50 border border-gray-200/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2.5 rounded-lg mr-3 transition-all ${
                          status === 'current'
                            ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-md'
                            : status === 'completed'
                            ? 'bg-green-500'
                            : status === 'available'
                            ? 'bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-green-50 group-hover:to-green-100'
                            : 'bg-white/50'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircleIcon className="h-5 w-5 text-black" />
                          ) : (
                            <step.icon className={`h-5 w-5 ${
                              status === 'current' 
                                ? 'text-black' 
                                : status === 'available' 
                                ? 'text-gray-900 group-hover:text-green-600' 
                                : 'text-gray-600/50'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${
                              status === 'current' || status === 'completed' 
                                ? 'text-gray-900' 
                                : 'text-gray-600'
                            }`}>
                              {t(`restaurants.onboarding.sidebar.steps.${step.name}.name`)}
                            </h3>
                            <div className={`w-2 h-2 rounded-full ${
                              status === 'completed'
                                ? 'bg-green-500'
                                : status === 'current'
                                ? 'bg-blue-400'
                                : status === 'available'
                                ? 'bg-yellow-400'
                                : 'bg-gray-300'
                            }`} />
                          </div>
                          <p className="text-sm mt-1 text-gray-600">{t(`restaurants.onboarding.sidebar.steps.${step.description}.description`)}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fixed Bottom Section - Help & Delete */}
            <div className="space-y-3 flex-shrink-0">
              <div className="p-4 rounded-xl border backdrop-blur-sm bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-200">
                <div className="flex items-start">
                  <div className="p-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg mr-3 shadow-lg">
                    <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold mb-1 text-gray-900">{t('restaurants.onboarding.sidebar.guide.title')}</h4>
                    <p className="text-xs mb-3 text-gray-600">
                      {t('restaurants.onboarding.sidebar.guide.description')}
                    </p>
                    <Link
                      href="/restaurants"
                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black text-xs font-medium rounded-lg hover:opacity-90 transition-all group"
                    >
                      {t('restaurants.onboarding.sidebar.guide.viewGuide')}
                      <svg className="h-3 w-3 ml-1.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Delete button for non-onboarded restaurants (not shown if archived) */}
              {restaurant && !restaurant.isOnboarded && !restaurant.deleted && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full p-2.5 text-xs font-medium rounded-lg transition-colors border flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  {t('restaurants.onboarding.sidebar.deleteRestaurant')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-gray-900/50" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="relative w-80 h-full overflow-y-auto bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{t('restaurants.onboarding.sidebar.mobileTitle')}</h2>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-2 rounded-lg transition bg-gray-50 text-gray-600 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Progress Overview */}
                <div className="mb-6 rounded-lg p-4 border bg-gray-50 border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{t('restaurants.onboarding.progress')}</span>
                    <span className="text-xs font-medium text-green-600">
                      {completedSteps.length}/5
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2 bg-white">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedSteps.filter(step => step <= 3).length / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Mobile Steps */}
                <div className="space-y-2">
                  {OnboardingSteps.map((step) => {
                    const status = getStepStatus(step.id)
                    const isClickable = status !== 'locked'
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => {
                          handleStepClick(step.id)
                          setIsMobileSidebarOpen(false)
                        }}
                        disabled={!isClickable}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          status === 'current'
                            ? 'bg-gradient-to-r from-green-500/20 to-green-400/20 border-2 border-green-400'
                            : status === 'completed'
                            ? 'bg-gray-50 border border-gray-200'
                            : status === 'available'
                            ? 'bg-gray-50 border border-gray-200 cursor-pointer'
                            : 'bg-gray-50 border border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            status === 'current'
                              ? 'bg-gradient-to-r from-green-500 to-green-400'
                              : status === 'completed'
                              ? 'bg-green-500'
                              : 'bg-white'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircleIcon className="h-5 w-5 text-black" />
                            ) : (
                              <step.icon className={`h-5 w-5 ${
                                status === 'current' ? 'text-black' : 'text-gray-600'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              status === 'current' || status === 'completed' 
                                ? 'text-gray-900' 
                                : 'text-gray-600'
                            }`}>
                              {t(`restaurants.onboarding.sidebar.steps.${step.name}.name`)}
                            </h3>
                            <p className="text-sm mt-1 text-gray-600">{t(`restaurants.onboarding.sidebar.steps.${step.description}.description`)}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen ml-80">
          <div className="w-full h-full flex items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-4xl">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && restaurant && (
        <RestaurantDeleteModal
          restaurant={restaurant}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  )
}

export default OnboardingSidebar