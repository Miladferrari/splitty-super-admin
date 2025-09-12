import { useState, useEffect, ReactNode, MouseEvent, memo, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTheme } from '../contexts/ThemeContext'
import { useRestaurants } from '../contexts/RestaurantsContext'
import { useTranslation } from '../contexts/TranslationContext'
import {
  HomeIcon,
  BuildingStorefrontIcon,
  BeakerIcon,
  UsersIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline'

interface OnboardingData {
  posData?: {
    posType?: string
  }
}

interface LayoutProps {
  children: ReactNode
}

type UserRole = 'ceo' | 'admin' | 'account_manager' | 'support' | 'developer' | 'staff'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  roles: UserRole[]
  submenu?: SubMenuItem[]
}

interface SubMenuItem {
  name: string
  href: string
  roles: UserRole[]
}

interface ExpandedMenus {
  [key: string]: boolean
}

// POS Status Indicator Component
const POSStatusIndicator: React.FC = (): React.ReactElement | null => {
  const [hasIssues, setHasIssues] = useState<boolean>(false)
  const { restaurants } = useRestaurants()
  
  useEffect(() => {
    const checkPOSStatus = (): void => {
      let issuesFound = false
      
      if (restaurants) {
        restaurants.forEach(restaurant => {
          if (!restaurant.deleted) {
            const onboardingData = localStorage.getItem(`onboarding_${restaurant.id}`)
            if (onboardingData) {
              try {
                const parsed: OnboardingData = JSON.parse(onboardingData)
                if (!parsed.posData || !parsed.posData.posType) {
                  issuesFound = true
                }
              } catch (e) {
                issuesFound = true
              }
            } else {
              issuesFound = true
            }
          }
        })
      }
      
      setHasIssues(issuesFound)
    }
    
    checkPOSStatus()
    const interval = setInterval(checkPOSStatus, 30000) // Check every 30 seconds
    
    return () => clearInterval(interval)
  }, [restaurants])
  
  if (!hasIssues) return null
  
  return (
    <span className="inline-flex items-center ml-auto">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
    </span>
  )
}

// Navigation configuration moved inside component to access translations

const Layout: React.FC<LayoutProps> = ({ children }): React.ReactElement => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const { darkMode } = useTheme()
  const { language, setLanguage, t } = useTranslation()
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState<boolean>(false)
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>(() => {
    // First try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('expanded-menus')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          // If parsing fails, continue with default logic
        }
      }
      
      // Fallback: Initialize with Restaurants menu expanded if on any of its pages
      const initialExpanded: ExpandedMenus = {}
      const restaurantPaths = ['/restaurants', '/pos', '/payments/payouts']
      if (restaurantPaths.includes(window.location.pathname)) {
        initialExpanded['Restaurants'] = true
      }
      return initialExpanded
    }
    return {}
  })
  
  // Navigation configuration - memoized to prevent recreation on language change
  const allNavigation: NavigationItem[] = useMemo(() => [
    { name: t('sidebar.menu.dashboard'), href: '/dashboard', icon: HomeIcon, roles: ['ceo', 'admin', 'account_manager', 'support', 'developer'] },
    { 
      name: t('sidebar.menu.restaurants'), 
      href: '/restaurants', 
      icon: BuildingStorefrontIcon, 
      roles: ['ceo', 'admin', 'account_manager'],
      submenu: [
        { name: t('sidebar.menu.allRestaurants'), href: '/restaurants', roles: ['ceo', 'admin', 'account_manager'] },
        { name: t('sidebar.menu.posConnections'), href: '/pos', roles: ['ceo', 'admin', 'developer'] },
        { name: t('sidebar.menu.payouts'), href: '/payments/payouts', roles: ['ceo', 'admin'] },
      ]
    },
    { name: t('sidebar.menu.allSplittys'), href: '/orders', icon: ArrowsRightLeftIcon, roles: ['ceo', 'admin', 'account_manager', 'support'] },
    { name: t('sidebar.menu.testOrder'), href: '/test-order', icon: BeakerIcon, roles: ['ceo', 'admin', 'developer'] },
    { name: t('sidebar.menu.splittyTeam'), href: '/users', icon: UsersIcon, roles: ['ceo', 'admin'] },
    { name: t('sidebar.menu.settings'), href: '/settings', icon: Cog6ToothIcon, roles: ['ceo', 'admin', 'account_manager', 'support', 'developer'] },
  ], [language, t])
  const router = useRouter()
  
  // Initialize user data with default values
  const [userName, setUserName] = useState<string>('User')
  const [userRole, setUserRole] = useState<UserRole>('ceo')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userAvatar, setUserAvatar] = useState<string>('')
  // Memoize filtered navigation based on user role
  const navigation = useMemo(() => {
    const roleToUse: UserRole = userRole || 'ceo'
    const validRoles: UserRole[] = ['ceo', 'admin', 'account_manager', 'support', 'developer', 'staff']
    
    if (!validRoles.includes(roleToUse)) {
      return allNavigation
    }
    
    return allNavigation.filter(item => 
      item.roles && item.roles.includes(roleToUse)
    ).map(item => {
      if (item.submenu) {
        return {
          ...item,
          submenu: item.submenu?.filter(subItem => 
            subItem.roles && subItem.roles.includes(roleToUse)
          )
        }
      }
      return item
    })
  }, [allNavigation, userRole])
  
  // Load user data from localStorage after mount
  useEffect(() => {
    const loadUserData = (): void => {
      const storedUserName = localStorage.getItem('userName')
      const storedUserRole = localStorage.getItem('userRole') as UserRole | null
      const storedUserEmail = localStorage.getItem('userEmail')
      const storedUserAvatar = localStorage.getItem('userAvatar')
      
      // Debug logging
      console.log('Loading user data:', {
        userName: storedUserName,
        userRole: storedUserRole,
        userEmail: storedUserEmail
      })
      
      setUserName(storedUserName || 'User')
      setUserRole(storedUserRole || 'ceo')
      setUserEmail(storedUserEmail || '')
      setUserAvatar(storedUserAvatar || '')
    }
    
    // Initial load
    loadUserData()
    
    // Listen for storage events to update user data
    window.addEventListener('storage', loadUserData)
    
    return () => {
      window.removeEventListener('storage', loadUserData)
    }
  }, [])

  // Format role display
  const getRoleDisplay = (role: UserRole): string => {
    switch(role) {
      case 'ceo': return t('sidebar.user.role')
      case 'admin': return 'Administrator'
      case 'account_manager': return 'Account Manager'
      case 'support': return 'Support'
      case 'developer': return 'Developer'
      default: return role
    }
  }

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated && router.pathname !== '/login') {
      router.push('/login')
    }
  }, [router.pathname, router])

  // Load saved preferences once on mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed')
    if (savedCollapsed === 'true') {
      setSidebarCollapsed(true)
    }
  }, []) // Empty dependency array - only run once on mount

  // Initialize expanded menus based on current page
  useEffect(() => {
    if (navigation && navigation.length > 0 && !sidebarCollapsed) {
      const initialExpanded: { [key: string]: boolean } = {};
      
      navigation.forEach(item => {
        // Check if we're currently on any of the submenu pages
        const isOnSubmenuPage = item.submenu && item.submenu?.some(sub => router.pathname === sub.href)
        
        if (isOnSubmenuPage) {
          initialExpanded[item.href] = true;
        }
      })
      
      // Set initial state
      if (Object.keys(initialExpanded).length > 0) {
        setExpandedMenus(prev => ({ ...prev, ...initialExpanded }))
      }
    }
  }, []) // Only run on mount
  
  // Keep expanded state when navigating between submenu items
  useEffect(() => {
    if (navigation && navigation.length > 0 && !sidebarCollapsed) {
      let shouldUpdate = false
      const updates: ExpandedMenus = { ...expandedMenus }
      
      navigation.forEach(item => {
        const isOnSubmenuPage = item.submenu && item.submenu?.some(sub => router.pathname === sub.href)
        
        // If we're on a submenu page and the menu isn't expanded, expand it
        if (isOnSubmenuPage && !expandedMenus[item.href]) {
          updates[item.href] = true
          shouldUpdate = true
        }
      })
      
      if (shouldUpdate) {
        setExpandedMenus(updates)
        // Save to localStorage for persistence
        localStorage.setItem('expanded-menus', JSON.stringify(updates))
      }
    }
  }, [router.pathname]) // React to route changes but don't reset existing expanded menus

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      // Close language menu if clicking outside
      if (!target.closest('.language-selector-sidebar') && languageMenuOpen) {
        setLanguageMenuOpen(false)
      }
      // Close user menu if clicking outside
      if (!target.closest('.user-menu-sidebar') && userMenuOpen) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside as any)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any)
    }
  }, [languageMenuOpen, userMenuOpen])

  const toggleSidebar = (): void => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', newState.toString())
  }

  const toggleSubmenu = (itemHref: string, forceOpen?: boolean): void => {
    setExpandedMenus(prev => {
      const newState = {
        ...prev,
        [itemHref]: forceOpen !== undefined ? forceOpen : !prev[itemHref]
      }
      // Save to localStorage for persistence
      localStorage.setItem('expanded-menus', JSON.stringify(newState))
      return newState
    })
  }

  const handleNavItemClick = (item: NavigationItem): void => {
    // If this item has a submenu (Restaurants)
    if (item.submenu && item.submenu.length > 0) {
      // Toggle the submenu and navigate to the first item
      const isCurrentlyExpanded = expandedMenus[item.href]
      if (!isCurrentlyExpanded) {
        // If opening, navigate to first submenu item
        toggleSubmenu(item.href, true)
        router.push(item.submenu[0].href)
      } else {
        // If already open, just toggle it
        toggleSubmenu(item.href, false)
      }
    } else {
      // For non-submenu items, close all submenus
      setExpandedMenus({})
      localStorage.setItem('expanded-menus', JSON.stringify({}))
      router.push(item.href)
    }
  }

  const handleLogout = (): void => {
    // Clear authentication
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    
    // Redirect to login page
    router.push('/login')
  }

  return (
    <div className="h-screen overflow-hidden flex transition-colors duration-300 bg-[#F9FAFB] text-[#111827]">
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-in-out lg:transform-none lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} flex flex-col bg-white border-r border-gray-200`}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute right-0 top-0 p-4">
          <button
            type="button"
            className="transition-colors duration-200 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="border-b border-gray-100">
          <div className="px-6 py-6">
            <div className="group flex items-center justify-between">
              {!sidebarCollapsed ? (
                <>
                  <Link href="/dashboard" className="flex items-center flex-1">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 group-hover:border-green-200 transition-all duration-200 shadow-sm flex items-center justify-center">
                      <Image
                        src="/favicon-splitty.png"
                        alt="Splitty Logo"
                        width={32}
                        height={32}
                        priority
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {t('sidebar.company')}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t('sidebar.subtitle')}
                      </p>
                    </div>
                  </Link>
                  {/* Collapse button - aligned to the right */}
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex-shrink-0"
                    title={t('sidebar.collapse')}
                  >
                    <svg 
                      className="h-4 w-4"
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                </>
              ) : (
                <button 
                  onClick={toggleSidebar}
                  className="flex items-center justify-center w-full"
                  title="Uitklappen"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:border-green-200 transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer">
                    <Image
                      src="/favicon-splitty.png"
                      alt="Splitty Logo"
                      width={32}
                      height={32}
                      priority
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto overscroll-none">
          {navigation.map((item) => {
            const isActive = (router.pathname === item.href && !item.submenu) || 
                           (item.submenu && item.submenu?.some(sub => router.pathname === sub.href))
            const isExpanded = expandedMenus[item.href]
            const hasSubmenu = item.submenu && item.submenu?.length > 0

            return (
              <div key={item.href} className="relative mb-1">
                {hasSubmenu ? (
                  <div className="px-2">
                  <button
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      // If sidebar is collapsed, expand it and then open submenu
                      if (sidebarCollapsed) {
                        setSidebarCollapsed(false)
                        localStorage.setItem('sidebar-collapsed', 'false')
                        // Use setTimeout to allow sidebar animation to start, then expand submenu
                        setTimeout(() => {
                          handleNavItemClick(item)
                        }, 100)
                      } else {
                        // If sidebar is already open, handle the navigation
                        handleNavItemClick(item)
                      }
                    }}
                    className={`
                    w-full group flex items-center justify-between py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive && item.submenu && item.submenu?.some(sub => router.pathname === sub.href)
                        ? '-ml-4 mr-0 pl-9 pr-5 bg-green-50 text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-5'
                    }
                  `}
                  >
                    <div className="flex items-center">
                      {!sidebarCollapsed && (
                        <div className="w-4 mr-2" />
                      )}
                      <item.icon
                        className={`h-5 w-5 transition-all duration-200 ${
                          isActive && hasSubmenu && item.submenu?.some(sub => router.pathname === sub.href) 
                            ? 'text-gray-900' 
                            : isActive 
                              ? 'text-gray-900' 
                              : 'text-gray-500'
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="ml-3 transition-all duration-200">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <ChevronRightIcon 
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                        strokeWidth={1.5}
                      />
                    )}
                  </button>
                  </div>
                ) : (
                  <div className="px-2">
                  <Link
                    href={item.href}
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Close all submenus when clicking on a non-submenu item
                      setExpandedMenus({})
                      localStorage.setItem('expanded-menus', JSON.stringify({}))
                      
                      // If sidebar is collapsed, expand it smoothly without any submenu effects
                      if (sidebarCollapsed) {
                        // Don't prevent default - let the navigation happen immediately
                        // This updates the route and green background instantly
                        setSidebarCollapsed(false)
                        localStorage.setItem('sidebar-collapsed', 'false')
                      }
                      // Navigation happens immediately in all cases
                    }}
                    className={`
                    group flex items-center py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? '-ml-4 mr-0 pl-9 pr-5 bg-green-50 text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-5'
                    }
                  `}
                  >
                    <div className="flex items-center">
                      {!sidebarCollapsed && (
                        <div className="w-4 mr-2" />
                      )}
                      <item.icon
                        className={`h-5 w-5 transition-all duration-200 ${
                          isActive && hasSubmenu && item.submenu && item.submenu?.some(sub => router.pathname === sub.href) 
                            ? 'text-gray-900' 
                            : isActive 
                              ? 'text-gray-900' 
                              : 'text-gray-500'
                        }`}
                      />
                    </div>
                    {!sidebarCollapsed && (
                      <span className="flex-1 ml-3 transition-all duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                  </div>
                )}

                {/* Submenu */}
                {hasSubmenu && !sidebarCollapsed && (
                  <div className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? 'mt-1' : ''
                  }`}>
                    <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      isExpanded ? 'max-h-40' : 'max-h-0'
                    }`}>
                      {item.submenu && item.submenu?.map((subItem) => {
                        const isSubActive = router.pathname === subItem.href
                        return (
                          <div key={subItem.href} className="px-2 mb-1">
                            <Link
                              href={subItem.href}
                              className={`
                              group flex items-center py-3 text-sm font-medium rounded-lg transition-all duration-200
                              ${
                                isSubActive
                                  ? '-ml-4 mr-0 pl-9 pr-5 bg-green-50 text-gray-900 font-medium'
                                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-5'
                              }
                            `}
                            >
                              <div className="flex items-center">
                                <div className="w-4 mr-2" /> {/* Spacer for chevron */}
                                <div className="w-5" /> {/* Spacer for icon */}
                              </div>
                              <span className="flex-1 ml-3 flex items-center justify-between">
                                <span>{subItem.name}</span>
                                {subItem.href === '/pos' && (
                                  <POSStatusIndicator />
                                )}
                              </span>
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-gray-200 space-y-3">
            {/* Notifications */}
            <button 
              onClick={() => {
                // Navigate immediately to show active state
                router.push('/settings?tab=notifications')
                // If sidebar is collapsed, expand it smoothly
                if (sidebarCollapsed) {
                  setSidebarCollapsed(false)
                  localStorage.setItem('sidebar-collapsed', 'false')
                }
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 mr-3 text-gray-500" />
                {!sidebarCollapsed && (
                  <span>{t('sidebar.notifications')}</span>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center bg-green-500 text-white">
                  3
                </div>
              )}
            </button>

            {/* Language Selector */}
            {!sidebarCollapsed && (
              <div className="relative language-selector-sidebar">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <span>{language === 'en' ? t('sidebar.language.english') : t('sidebar.language.dutch')}</span>
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${languageMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {languageMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg bg-white border border-gray-200 shadow-lg py-1">
                    <button
                      onClick={() => {
                        setLanguage('en')
                        setLanguageMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-2 ${
                        language === 'en' 
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      {t('sidebar.language.english')}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('nl')
                        setLanguageMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-2 ${
                        language === 'nl' 
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      {t('sidebar.language.dutch')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 pt-3">
            {/* User menu */}
              <div className="relative user-menu-sidebar">
                <button
                  onClick={() => {
                    // If sidebar is collapsed, just expand it smoothly without opening dropdown
                    if (sidebarCollapsed) {
                      setSidebarCollapsed(false)
                      localStorage.setItem('sidebar-collapsed', 'false')
                      // Don't open the dropdown when expanding sidebar
                    } else {
                      // Only toggle dropdown if sidebar is already open
                      setUserMenuOpen(!userMenuOpen)
                    }
                  }}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-all duration-200 group bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100`}
                >
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName} 
                      className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10 mr-3'} rounded-full object-cover border-2 border-gray-200 flex-shrink-0`}
                    />
                  ) : (
                    <div className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10 mr-3'} rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-br from-green-500 to-emerald-500 text-white flex-shrink-0`}>
                      {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                  )}
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="font-semibold truncate">{userName || 'User'}</div>
                        <div className="text-xs opacity-75">{getRoleDisplay(userRole || 'ceo')}</div>
                      </div>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                
                {/* User Dropdown Menu */}
                {userMenuOpen && !sidebarCollapsed && (
                  <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg bg-white border border-gray-200 shadow-lg py-1">
                    <button
                      onClick={() => {
                        router.push('/settings?tab=profiel')
                        setUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <UsersIcon className="h-4 w-4 inline mr-2" />
                      {t('sidebar.user.myProfile')}
                    </button>
                    <button
                      onClick={() => {
                        router.push('/settings?tab=algemeen')
                        setUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Cog6ToothIcon className="h-4 w-4 inline mr-2" />
                      {t('sidebar.user.accountSettings')}
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 inline mr-2" />
                      {t('sidebar.user.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Mobile Header Only */}
        <header className="lg:hidden fixed top-0 left-0 right-0 transition-all duration-300 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6">
            <div className="flex justify-between items-center h-[72px]">
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                  type="button"
                  className="p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>

                {/* Logo for mobile */}
                <Image
                  src="/logo-trans.webp"
                  alt="Splitty"
                  width={100}
                  height={35}
                  className="h-[35px] w-auto"
                />
              </div>

              {/* Simple mobile user avatar */}
              <div className="flex items-center">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overscroll-none transition-colors duration-300 lg:pt-0 pt-[72px] bg-[#F9FAFB]">
          {children}
        </main>
      </div>
    </div>
  )
}

export default memo(Layout)