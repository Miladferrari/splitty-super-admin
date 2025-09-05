import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useUsers } from '../contexts/UsersContext'
import { useTheme } from '../contexts/ThemeContext'
import { useTranslation } from '../contexts/TranslationContext'
import db from '../utils/database'
import {
  Cog6ToothIcon,
  BellIcon,
  CreditCardIcon,
  KeyIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  CheckIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

const Settings: NextPage = () => {
  const { t } = useTranslation()
  const { darkMode } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [profileFormData, setProfileFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  useEffect(() => {
    // Check for tab query parameter
    if (router.query.tab) {
      const tabMap = {
        'profiel': 'profile',
        'algemeen': 'general',
        'profile': 'profile',
        'general': 'general',
        'notifications': 'notifications',
        'notificaties': 'notifications'
      }
      const mappedTab = tabMap[router.query.tab] || router.query.tab
      setActiveTab(mappedTab)
    }
  }, [router.query.tab])
  
  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      // Get current user data from database
      const userId = localStorage.getItem('userId')
      if (userId) {
        const users = db.getUsers()
        const user = users.find(u => u.id === parseInt(userId))
        if (user) {
          setCurrentUser(user)
          // Parse name into first and last
          const nameParts = user.name.split(' ')
          setProfileFormData({
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            bio: user.bio || ''
          })
          // Set avatar if exists
          if (user.avatar) {
            setAvatarPreview(user.avatar)
          }
        }
      }
    }
  }, [])

  const tabs = [
    { id: 'profile', name: t('settings.tabs.profile'), icon: UserCircleIcon, description: t('settings.profile.title') },
    { id: 'general', name: t('settings.tabs.general'), icon: Cog6ToothIcon, description: t('settings.general.title') },
    { id: 'notifications', name: t('settings.tabs.notifications'), icon: BellIcon, description: t('settings.notifications.title') },
    { id: 'payment', name: t('settings.tabs.billing'), icon: CreditCardIcon, description: t('settings.billing.title') },
    { id: 'security', name: t('settings.tabs.security'), icon: KeyIcon, description: t('settings.security.title') },
    { id: 'api', name: t('settings.tabs.integrations'), icon: GlobeAltIcon, description: t('settings.integrations.title') },
    { id: 'legal', name: t('settings.legal.title'), icon: DocumentTextIcon, description: t('settings.legal.description') },
  ]

  // Format role display
  const getRoleDisplay = (role) => {
    switch(role) {
      case 'ceo': return t('users.roles.ceo')
      case 'admin': return t('users.roles.admin')
      case 'account_manager': return t('users.roles.accountManager')
      case 'support': return t('users.roles.support')
      case 'developer': return t('users.roles.developer')
      default: return role
    }
  }

  const handleSave = () => {
    if (activeTab === 'profile' && currentUser) {
      // Update user profile
      const updatedUser = {
        ...currentUser,
        name: `${profileFormData.first_name} ${profileFormData.last_name}`.trim(),
        email: profileFormData.email,
        phone: profileFormData.phone,
        bio: profileFormData.bio,
        avatar: avatarPreview
      }
      
      db.updateUser(currentUser.id, updatedUser)
      
      // Update localStorage
      localStorage.setItem('userName', updatedUser.name)
      localStorage.setItem('userEmail', updatedUser.email)
      localStorage.setItem('userAvatar', updatedUser.avatar || '')
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
      // Trigger storage event to update Layout component
      window.dispatchEvent(new Event('storage'))
    } else if (activeTab === 'security' && currentUser) {
      // Handle password change
      if (passwordData.currentPassword && passwordData.newPassword) {
        if (passwordData.currentPassword !== currentUser.password) {
          alert(t('settings.security.incorrectPassword'))
          return
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert(t('settings.security.passwordMismatch'))
          return
        }
        
        // Update password
        db.updateUser(currentUser.id, { password: passwordData.newPassword })
        
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  // Drag and drop handlers for avatar
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true)
    }
  }

  const handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert(t('settings.profile.invalidFileType'))
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('settings.profile.fileTooLarge'))
      return
    }
    
    setAvatar(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteAvatar = () => {
    setAvatarPreview(null)
    setAvatar(null)
  }

  const renderProfileSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-[#111827]">{t('settings.profile.title')}</h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          {t('settings.profile.personalInfo')}
        </p>
      </div>

      {/* Avatar Upload Section */}
      <div className="p-6 rounded-xl bg-gray-50">
        <label className="block text-sm font-medium mb-4 text-gray-700">
          {t('settings.profile.profilePhoto')}
        </label>
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Current Avatar */}
          <div className="relative">
            {avatarPreview ? (
              <div className="relative group">
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="h-32 w-32 rounded-xl object-cover border-2 border-gray-200"
                />
                <button
                  onClick={handleDeleteAvatar}
                  className="absolute -bottom-2 -right-2 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-lg bg-red-600 hover:bg-red-700"
                  title={t('settings.profile.removePhoto')}
                >
                  <TrashIcon className="h-4 w-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="h-32 w-32 rounded-xl bg-green-500 flex items-center justify-center text-white font-bold text-3xl">
                {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
            )}
          </div>

          {/* Upload Area */}
          <div className="flex-1">
            <div
              className={`relative flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl transition-all ${
                dragActive 
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-green-400'
              }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                onChange={handleFileChange}
                className="sr-only"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center"
              >
                <CloudArrowUpIcon className={`h-8 w-8 mb-2 ${
                  dragActive 
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`} />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{t('settings.profile.clickToUpload')}</span> {t('settings.profile.orDragHere')}
                </p>
                <p className="text-xs mt-1 text-gray-400">{t('settings.profile.fileFormats')}</p>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <h4 className="text-sm font-medium text-gray-700">
          {t('settings.profile.personalInfo')}
        </h4>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-first-name" className="block text-sm font-medium mb-2 text-gray-700">
              {t('settings.profile.firstName')}
            </label>
            <input
              type="text"
              name="profile-first-name"
              id="profile-first-name"
              value={profileFormData.first_name}
              onChange={(e) => setProfileFormData(prev => ({ ...prev, first_name: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="profile-last-name" className="block text-sm font-medium mb-2 text-gray-700">
              {t('settings.profile.lastName')}
            </label>
            <input
              type="text"
              name="profile-last-name"
              id="profile-last-name"
              value={profileFormData.last_name}
              onChange={(e) => setProfileFormData(prev => ({ ...prev, last_name: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium mb-2 text-gray-700">
              {t('common.email')}
            </label>
            <input
              type="email"
              name="profile-email"
              id="profile-email"
              value={profileFormData.email}
              onChange={(e) => setProfileFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="profile-phone" className="block text-sm font-medium mb-2 text-gray-700">
              {t('common.phone')}
            </label>
            <input
              type="tel"
              name="profile-phone"
              id="profile-phone"
              value={profileFormData.phone}
              onChange={(e) => setProfileFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="profile-role" className="block text-sm font-medium mb-2 text-gray-700">
              {t('settings.profile.role')}
            </label>
            <input
              type="text"
              name="profile-role"
              id="profile-role"
              value={getRoleDisplay(currentUser?.role || '')}
              disabled
              className="w-full px-4 py-3 rounded-lg border cursor-not-allowed opacity-75 bg-gray-50 border-gray-200 text-gray-500"
            />
          </div>

          <div>
            <label htmlFor="profile-department" className="block text-sm font-medium mb-2 text-gray-700">
              {t('common.department')}
            </label>
            <input
              type="text"
              name="profile-department"
              id="profile-department"
              value={currentUser?.department || ''}
              disabled
              className="w-full px-4 py-3 rounded-lg border cursor-not-allowed opacity-75 bg-gray-50 border-gray-200 text-gray-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="profile-bio" className="block text-sm font-medium mb-2 text-gray-700">
            {t('settings.profile.bio')}
          </label>
          <textarea
            id="profile-bio"
            name="profile-bio"
            rows={4}
            value={profileFormData.bio}
            onChange={(e) => setProfileFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder={t('settings.profile.bioPlaceholder')}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none transition ${
              darkMode
                ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
            }`}
          />
        </div>
      </div>
    </div>
  )

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-[#111827]">{t('settings.general.companyInfo')}</h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          {t('settings.general.companyInfoDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium mb-2 text-gray-700">
            {t('settings.general.companyName')}
          </label>
          <input
            type="text"
            name="company-name"
            id="company-name"
            defaultValue="Splitty B.V."
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
            {t('settings.general.contactEmail')}
          </label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue="contact@splitty.com"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-700">
            {t('settings.general.phone')}
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            defaultValue="+31 20 123 4567"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-2 text-gray-700">
            {t('settings.general.website')}
          </label>
          <input
            type="url"
            name="website"
            id="website"
            defaultValue="https://splitty.com"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="kvk-number" className="block text-sm font-medium mb-2 text-gray-700">
            {t('settings.general.kvkNumber')}
          </label>
          <input
            type="text"
            name="kvk-number"
            id="kvk-number"
            defaultValue="85291234"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="btw-number" className="block text-sm font-medium mb-2 text-gray-700">
            {t('settings.general.vatNumber')}
          </label>
          <input
            type="text"
            name="btw-number"
            id="btw-number"
            defaultValue="NL003456789B01"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Address Fields */}
      <div>
        <h4 className="text-lg font-medium mb-4 text-gray-900">
          {t('settings.general.address')}
        </h4>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="street-address" className="block text-sm font-medium mb-2 text-gray-700">
              {t('settings.general.streetAddress')}
            </label>
            <input
              type="text"
              name="street-address"
              id="street-address"
              defaultValue="Herengracht 182"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="postal-code" className="block text-sm font-medium mb-2 text-gray-700">
              {t('settings.general.postalCode')}
            </label>
            <input
              type="text"
              name="postal-code"
              id="postal-code"
              defaultValue="1016 BR"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2 text-gray-700">
              {t('settings.general.city')}
            </label>
            <input
              type="text"
              name="city"
              id="city"
              defaultValue="Amsterdam"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="country" className="block text-sm font-medium mb-2 text-gray-700">
              {t('settings.general.country')}
            </label>
            <select
              id="country"
              name="country"
              defaultValue="Netherlands"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition bg-white border-gray-200 text-gray-900 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Netherlands">{t('settings.general.countries.netherlands')}</option>
              <option value="Belgium">{t('settings.general.countries.belgium')}</option>
              <option value="Germany">{t('settings.general.countries.germany')}</option>
              <option value="France">{t('settings.general.countries.france')}</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium mb-2 text-gray-700">
          {t('settings.general.timezone')}
        </label>
        <select
          id="timezone"
          name="timezone"
          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition ${
            darkMode
              ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white focus:ring-[#2BE89A] focus:border-transparent'
              : 'bg-white border-gray-200 text-gray-900 focus:ring-green-500 focus:border-transparent'
          }`}
          defaultValue="Europe/Amsterdam"
        >
          <option value="Europe/Amsterdam">Europe/Amsterdam (CET)</option>
          <option value="Europe/London">Europe/London (GMT)</option>
          <option value="America/New_York">America/New York (EST)</option>
          <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
        </select>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-[#111827]">{t('settings.notifications.emailNotifications')}</h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          {t('settings.notifications.emailNotificationsDesc')}
        </p>
      </div>

      <div className="rounded-xl p-6 bg-gray-50">
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'new-orders', label: t('settings.notifications.newOrders'), description: t('settings.notifications.newOrdersDesc'), checked: true, category: 'critical' },
            { id: 'payment-received', label: t('settings.notifications.paymentReceived'), description: t('settings.notifications.paymentReceivedDesc'), checked: true, category: 'critical' },
            { id: 'payout-sent', label: t('settings.notifications.payoutSent'), description: t('settings.notifications.payoutSentDesc'), checked: true, category: 'important' },
            { id: 'low-inventory', label: t('settings.notifications.lowInventory'), description: t('settings.notifications.lowInventoryDesc'), checked: false, category: 'optional' },
            { id: 'new-reviews', label: t('settings.notifications.newReviews'), description: t('settings.notifications.newReviewsDesc'), checked: false, category: 'optional' },
            { id: 'marketing', label: t('settings.notifications.marketingUpdates'), description: t('settings.notifications.marketingUpdatesDesc'), checked: false, category: 'optional' },
          ].map((item) => (
            <div key={item.id} className={`flex items-start p-4 rounded-xl border transition-all duration-200 ${
              darkMode 
                ? 'bg-[#1c1e27] border-[#2a2d3a] hover:border-green-500/30' 
                : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-sm'
            }`}>
              <div className="flex h-6 items-center">
                <input
                  id={item.id}
                  name={item.id}
                  type="checkbox"
                  defaultChecked={item.checked}
                  className={`h-5 w-5 rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                    darkMode
                      ? 'border-[#2a2d3a] bg-[#0A0B0F] text-green-500 focus:ring-green-500/50 focus:ring-offset-[#1c1e27]'
                      : 'border-gray-300 bg-white text-green-600 focus:ring-green-500/30 focus:ring-offset-white'
                  }`}
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <label htmlFor={item.id} className={`text-base font-medium cursor-pointer ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </label>
                  {item.category === 'critical' && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {t('settings.notifications.labels.important')}
                    </span>
                  )}
                  {item.category === 'important' && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {t('settings.notifications.labels.recommended')}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`border-t pt-8 ${darkMode ? 'border-[#2a2d3a]' : 'border-gray-200'}`}>
        <div className="mb-6">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('settings.notifications.pushNotifications')}</h3>
          <p className={`mt-1 text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
            {t('settings.notifications.pushNotificationsDesc')}
          </p>
        </div>

        <div className={`rounded-xl p-6 ${
          darkMode ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50'
        }`}>
          <div className="space-y-4">
            {[
              { id: 'push-orders', label: t('settings.notifications.orderUpdates'), description: t('settings.notifications.orderUpdatesDesc'), checked: true },
              { id: 'push-payments', label: t('settings.notifications.paymentAlerts'), description: t('settings.notifications.paymentAlertsDesc'), checked: true },
              { id: 'push-staff', label: t('settings.notifications.staffMessages'), description: t('settings.notifications.staffMessagesDesc'), checked: false },
            ].map((item) => (
              <div key={item.id} className={`flex items-start p-4 rounded-lg border transition-all duration-200 ${
                darkMode 
                  ? 'bg-[#1c1e27] border-[#2a2d3a] hover:border-green-500/30' 
                  : 'bg-white border-gray-200 hover:border-green-300'
              }`}>
                <div className="flex h-6 items-center">
                  <input
                    id={item.id}
                    name={item.id}
                    type="checkbox"
                    defaultChecked={item.checked}
                    className={`h-4 w-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                      darkMode
                        ? 'border-[#2a2d3a] bg-[#0A0B0F] text-green-500 focus:ring-green-500/50 focus:ring-offset-[#1c1e27]'
                        : 'border-gray-300 bg-white text-green-600 focus:ring-green-500/30 focus:ring-offset-white'
                    }`}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <label htmlFor={item.id} className={`text-sm font-medium cursor-pointer ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </label>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'}`}>{t('settings.billing.paymentMethods')}</h3>
        <p className={`mt-1 text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
          {t('settings.billing.paymentMethodsDesc')}
        </p>
      </div>

      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <CreditCardIcon className={`h-7 w-7 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div className="ml-4">
              <h4 className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('settings.billing.stripeTitle')}</h4>
              <p className={`text-sm mt-0.5 ${
                darkMode ? 'text-[#BBBECC]' : 'text-gray-600'
              }`}>{t('settings.billing.stripeDesc')}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
            darkMode 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            <CheckIcon className="h-4 w-4 mr-1.5" />
            {t('settings.billing.connected')}
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="stripe-key" className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
            }`}>
              {t('settings.billing.publishableKey')}
            </label>
            <input
              type="text"
              name="stripe-key"
              id="stripe-key"
              defaultValue="pk_test_your_stripe_publishable_key_here"
              disabled
              className={`w-full px-4 py-3 rounded-lg border cursor-not-allowed opacity-75 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'
            }`}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('settings.billing.payoutSettings')}</h3>
        <p className={`mt-1 text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
          {t('settings.billing.payoutSettingsDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="payout-frequency" className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
          }`}>
            {t('settings.billing.payoutFrequency')}
          </label>
          <select
            id="payout-frequency"
            name="payout-frequency"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white focus:ring-[#2BE89A]'
                : 'bg-white border-gray-200 text-gray-900 focus:ring-green-500'
            }`}
            defaultValue="weekly"
          >
            <option value="daily">{t('settings.billing.frequencies.daily')}</option>
            <option value="weekly">{t('settings.billing.frequencies.weekly')}</option>
            <option value="biweekly">{t('settings.billing.frequencies.biweekly')}</option>
            <option value="monthly">{t('settings.billing.frequencies.monthly')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="minimum-payout" className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
          }`}>
            {t('settings.billing.minimumPayout')}
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
            </div>
            <input
              type="number"
              name="minimum-payout"
              id="minimum-payout"
              defaultValue="50.00"
              className={`w-full pl-7 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white focus:ring-[#2BE89A]'
                  : 'bg-white border-gray-200 text-gray-900 focus:ring-green-500'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'}`}>{t('settings.security.securitySettings')}</h3>
        <p className={`mt-1 text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
          {t('settings.security.securitySettingsDesc')}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="current-password" className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
          }`}>
            {t('settings.security.currentPassword')}
          </label>
          <input
            type="password"
            name="current-password"
            id="current-password"
            placeholder="••••••••"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="new-password" className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
          }`}>
            {t('settings.security.newPassword')}
          </label>
          <input
            type="password"
            name="new-password"
            id="new-password"
            placeholder="••••••••"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
          }`}>
            {t('settings.security.confirmPassword')}
          </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder="••••••••"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className={`border-t pt-6 ${darkMode ? 'border-[#2a2d3a]' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-medium leading-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('settings.security.twoFactorAuth')}</h3>
        <p className={`mt-1 text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
          {t('settings.security.twoFactorAuthDesc')}
        </p>
      </div>

      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheckIcon className={`h-8 w-8 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <div className="ml-4">
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('settings.security.twoFactorEnabled')}
              </p>
              <p className={`text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
                {t('settings.security.twoFactorEnabledDesc')}
              </p>
            </div>
          </div>
          <button className={`text-sm font-medium ${
            darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
          }`}>
            {t('settings.security.disable')}
          </button>
        </div>
      </div>

      <div className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-medium leading-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('settings.security.loginSessions')}</h3>
        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('settings.security.loginSessionsDesc')}
        </p>
      </div>

      <div className="space-y-3">
        {[
          { device: 'MacBook Pro - Chrome', location: 'Amsterdam, NL', current: true },
          { device: 'iPhone 13 - App', location: 'Amsterdam, NL', current: false },
          { device: 'iPad Pro - Safari', location: 'Rotterdam, NL', current: false },
        ].map((session, index) => (
          <div key={index} className={`rounded-lg p-4 flex items-center justify-between border ${
            darkMode 
              ? 'bg-[#0A0B0F] border-[#2a2d3a]' 
              : 'bg-white border-gray-200'
          }`}>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {session.device}
              </p>
              <p className={`text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
                {session.location}
              </p>
            </div>
            {session.current ? (
              <span className={`text-sm ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>{t('settings.security.currentSession')}</span>
            ) : (
              <button className={`text-sm ${
                darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
              }`}>{t('settings.security.revoke')}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-medium leading-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>API Keys</h3>
        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your API keys for third-party integrations
        </p>
      </div>

      <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Production API Key</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Created on Jan 15, 2025</p>
          </div>
          <button className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}>Delete</button>
        </div>
        <div className={`rounded p-3 font-mono text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
          sk_test_your_stripe_secret_key_here
        </div>
      </div>

      <button className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        darkMode
          ? 'text-white bg-green-500 hover:bg-green-600 focus:ring-green-500'
          : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-600'
      }`}>
        Generate New API Key
      </button>

      <div className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-medium leading-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Webhooks</h3>
        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Configure webhook endpoints for real-time updates
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="webhook-url" className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
          }`}>
            Webhook URL
          </label>
          <input
            type="url"
            name="webhook-url"
            id="webhook-url"
            placeholder="https://your-domain.com/webhooks/splitty"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white focus:ring-[#2BE89A]'
                : 'bg-white border-gray-200 text-gray-900 focus:ring-green-500'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Webhook Events
          </label>
          <div className="space-y-2">
            {['order.created', 'payment.succeeded', 'payout.sent', 'restaurant.updated'].map((event) => (
              <div key={event} className="flex items-center">
                <input
                  id={event}
                  name={event}
                  type="checkbox"
                  className={`h-4 w-4 rounded focus:ring-2 ${
                  darkMode
                    ? 'border-gray-600 bg-gray-700 text-green-400 focus:ring-green-400'
                    : 'border-gray-300 bg-white text-green-600 focus:ring-green-500'
                }`}
                />
                <label htmlFor={event} className={`ml-2 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {event}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderLegalSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-medium leading-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal Documents</h3>
        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your legal documents and compliance
        </p>
      </div>

      <div className="space-y-4">
        {[
          { name: 'Terms of Service', lastUpdated: 'Jan 1, 2025', status: 'active' },
          { name: 'Privacy Policy', lastUpdated: 'Jan 1, 2025', status: 'active' },
          { name: 'Cookie Policy', lastUpdated: 'Dec 15, 2024', status: 'active' },
          { name: 'Data Processing Agreement', lastUpdated: 'Nov 20, 2024', status: 'active' },
        ].map((doc) => (
          <div key={doc.name} className={`rounded-lg p-4 flex items-center justify-between ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className="flex items-center">
              <DocumentTextIcon className={`h-6 w-6 mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.name}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last updated: {doc.lastUpdated}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
              }`}>
                Active
              </span>
              <button className={`text-sm ${
                darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
              }`}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      <div className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-medium leading-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Compliance</h3>
        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          GDPR and data protection settings
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="gdpr-consent"
              name="gdpr-consent"
              type="checkbox"
              defaultChecked
              className={`h-4 w-4 rounded focus:ring-2 ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-green-400 focus:ring-green-400'
                  : 'border-gray-300 bg-white text-green-600 focus:ring-green-500'
              }`}
            />
          </div>
          <div className="ml-3">
            <label htmlFor="gdpr-consent" className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              GDPR Compliant
            </label>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Enable GDPR compliance features</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="data-retention"
              name="data-retention"
              type="checkbox"
              defaultChecked
              className={`h-4 w-4 rounded focus:ring-2 ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-green-400 focus:ring-green-400'
                  : 'border-gray-300 bg-white text-green-600 focus:ring-green-500'
              }`}
            />
          </div>
          <div className="ml-3">
            <label htmlFor="data-retention" className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Automatic Data Retention
            </label>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Delete old data according to retention policy</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings()
      case 'general':
        return renderGeneralSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'payment':
        return renderPaymentSettings()
      case 'security':
        return renderSecuritySettings()
      case 'api':
        return renderAPISettings()
      case 'legal':
        return renderLegalSettings()
      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('settings.title') }]} />

            {/* Header with User Info Card */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#111827] mb-1">{t('settings.title')}</h1>
                <p className="text-[#6B7280]">
                  {t('settings.subtitle')}
                </p>
              </div>
              {currentUser && (
                <div className="mt-4 lg:mt-0 flex items-center space-x-4 px-5 py-3 rounded-xl bg-white shadow-sm">
                    <div className="flex-shrink-0">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar" 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                          {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRoleDisplay(currentUser.role)}
                      </p>
                    </div>
                </div>
              )}
            </div>

            {/* Tab Navigation as Cards - Sticky */}
            <div className="sticky top-0 z-30 bg-[#F9FAFB] pb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-green-50 border-green-500 shadow-md'
                        : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2.5 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-green-100'
                          : 'bg-gray-50 group-hover:bg-green-50'
                      }`}>
                        {tab.icon && React.createElement(tab.icon, { className: `h-6 w-6 transition-colors ${
                          activeTab === tab.id
                            ? 'text-green-600'
                            : 'text-gray-500 group-hover:text-green-600'
                        }` })}
                      </div>
                      <div>
                        <p className={`text-xs font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'text-green-600'
                            : 'text-gray-900 group-hover:text-green-600'
                        }`}>
                          {tab.name}
                        </p>
                        <p className="text-[10px] mt-0.5 hidden sm:block text-gray-400">
                          {tab.description}
                        </p>
                      </div>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute -bottom-px left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full bg-green-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}

            <div className="flex flex-col gap-6">
              {/* Content */}
              <div className="flex-1">
                <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="p-8">
                    {renderContent()}
                  </div>
                  <div className="px-8 py-6 flex justify-between items-center border-t bg-gray-50 border-gray-200">
                    <div className="flex items-center space-x-2">
                      {saved && (
                        <div className="flex items-center space-x-2 text-green-500">
                          <CheckIcon className="h-5 w-5" />
                          <span className="text-sm font-medium">{t('settings.changesSaved')}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-6 py-2.5 font-medium rounded-lg transition border bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                        {t('common.cancel')}
                      </button>
                      <button
                        onClick={handleSave}
                        className={`inline-flex items-center px-6 py-2.5 font-medium rounded-lg transition ${
                          saved
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        disabled={saved}
                      >
                        {saved ? t('settings.saved') : t('settings.saveChanges')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Settings
