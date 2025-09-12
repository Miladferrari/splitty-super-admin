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
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
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
  },
  {
    id: 6,
    name: 'telegram',
    description: 'telegram',
    icon: ChatBubbleLeftRightIcon,
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
                className="inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium mb-4 group bg-white border border-gray-200 text-gray-600 hover:text-gray-700 hover:shadow-sm hover:border-gray-300"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('restaurants.onboarding.backToRestaurants')}
              </Link>
              
              {/* Restaurant Info & Progress Combined */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-gray-900">{restaurant?.name}</h2>
                  <p className="text-xs text-gray-500">{t('restaurants.onboarding.restaurantOnboarding')}</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">
                      {t('restaurants.onboarding.progress')}
                    </span>
                    <span className="text-xs font-semibold text-[#2BE89A]">
                      {completedSteps.length}/5 voltooid
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2 bg-gray-100">
                    <div
                      className="bg-[#2BE89A] h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(completedSteps.filter(step => step <= 3).length / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Steps Section with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto mb-4 pr-1 scrollbar-thin">
              <div className="space-y-2 pr-1">
                {/* Welcome Card - Special Design */}
                <button
                  onClick={() => onStepChange && onStepChange(0)}
                  className={`w-full text-left rounded-lg transition-all duration-200 group ${
                    currentStep === 0
                      ? 'bg-gradient-to-r from-[#2BE89A]/10 to-[#4FFFB0]/10 border-2 border-[#2BE89A] shadow-sm cursor-pointer'
                      : 'bg-gradient-to-r from-gray-50 to-gray-50 border border-gray-200 hover:from-[#2BE89A]/5 hover:to-[#4FFFB0]/5 hover:border-[#2BE89A]/50 hover:shadow-sm cursor-pointer'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className={`p-1.5 rounded-md mr-2 ${
                        currentStep === 0
                          ? 'bg-[#2BE89A]'
                          : 'bg-[#2BE89A]/20'
                      }`}>
                        <RocketLaunchIcon className={`h-4 w-4 ${
                          currentStep === 0 
                            ? 'text-black' 
                            : 'text-[#2BE89A]'
                        }`} />
                      </div>
                      <h3 className={`font-semibold text-sm ${
                        currentStep === 0
                          ? 'text-gray-900' 
                          : 'text-gray-700'
                      }`}>
                        Welkom bij Onboarding
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">Start hier je restaurant setup</p>
                  </div>
                </button>
                
                {/* Divider */}
                <div className="my-3 px-2">
                  <div className="border-t border-gray-200"></div>
                </div>

                {/* Required Steps */}
                {OnboardingSteps.slice(0, 3).map((step) => {
                  const status = getStepStatus(step.id)
                  const isClickable = status !== 'locked'
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
                        status === 'current'
                          ? 'bg-white border-2 border-[#2BE89A] shadow-sm cursor-pointer'
                          : status === 'completed'
                          ? 'bg-white border border-gray-200 hover:border-[#2BE89A] hover:shadow-sm cursor-pointer'
                          : status === 'available'
                          ? 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer'
                          : 'bg-gray-50 border border-gray-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg mr-3 transition-all ${
                          status === 'current'
                            ? 'bg-[#2BE89A]'
                            : status === 'completed'
                            ? 'bg-[#2BE89A]/20'
                            : status === 'available'
                            ? 'bg-gray-100 group-hover:bg-gray-200'
                            : 'bg-gray-50'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircleIcon className="h-5 w-5 text-black" />
                          ) : (
                            <step.icon className={`h-5 w-5 ${
                              status === 'current' 
                                ? 'text-black' 
                                : status === 'completed'
                                ? 'text-[#2BE89A]'
                                : status === 'available' 
                                ? 'text-gray-600 group-hover:text-gray-700' 
                                : 'text-gray-400'
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
                                ? 'bg-[#2BE89A]'
                                : status === 'current'
                                ? 'bg-[#2BE89A]'
                                : status === 'available'
                                ? 'bg-gray-300'
                                : 'bg-gray-300'
                            }`} />
                          </div>
                          <p className="text-xs mt-1 text-gray-500">{t(`restaurants.onboarding.sidebar.steps.${step.description}.description`)}</p>
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
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
                        status === 'current'
                          ? 'bg-white border-2 border-[#2BE89A] shadow-sm cursor-pointer'
                          : status === 'completed'
                          ? 'bg-white border border-gray-200 hover:border-[#2BE89A] hover:shadow-sm cursor-pointer'
                          : status === 'available'
                          ? 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer'
                          : 'bg-gray-50 border border-gray-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg mr-3 transition-all ${
                          status === 'current'
                            ? 'bg-[#2BE89A]'
                            : status === 'completed'
                            ? 'bg-[#2BE89A]/20'
                            : status === 'available'
                            ? 'bg-gray-100 group-hover:bg-gray-200'
                            : 'bg-gray-50'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircleIcon className="h-5 w-5 text-black" />
                          ) : (
                            <step.icon className={`h-5 w-5 ${
                              status === 'current' 
                                ? 'text-black' 
                                : status === 'completed'
                                ? 'text-[#2BE89A]'
                                : status === 'available' 
                                ? 'text-gray-600 group-hover:text-gray-700' 
                                : 'text-gray-400'
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
                                ? 'bg-[#2BE89A]'
                                : status === 'current'
                                ? 'bg-[#2BE89A]'
                                : status === 'available'
                                ? 'bg-gray-300'
                                : 'bg-gray-300'
                            }`} />
                          </div>
                          <p className="text-xs mt-1 text-gray-500">{t(`restaurants.onboarding.sidebar.steps.${step.description}.description`)}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fixed Bottom Section - Help & Delete */}
            <div className="space-y-3 flex-shrink-0">
              <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                <div className="flex items-start">
                  <div className="p-2 bg-[#2BE89A]/10 rounded-lg mr-3">
                    <svg className="h-4 w-4 text-[#2BE89A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1 text-gray-900">{t('restaurants.onboarding.sidebar.guide.title')}</h4>
                    <p className="text-xs mb-2 text-gray-500">
                      {t('restaurants.onboarding.sidebar.guide.description')}
                    </p>
                    <Link
                      href="/restaurants"
                      className="inline-flex items-center px-3 py-1.5 bg-[#2BE89A] text-black text-xs font-medium rounded-md hover:bg-[#2BE89A]/90 transition-all group"
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
                  className="w-full p-3 text-xs font-medium rounded-lg transition-all border flex items-center justify-center bg-white text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border-gray-200"
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
                            <p className="text-xs mt-1 text-gray-500">{t(`restaurants.onboarding.sidebar.steps.${step.description}.description`)}</p>
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