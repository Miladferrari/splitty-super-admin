import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import { useUsers } from '../../../contexts/UsersContext'
import { useTranslation } from '../../../contexts/TranslationContext'
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  UserIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  KeyIcon,
  ClipboardDocumentCheckIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  ChevronRightIcon,
  HomeIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import { BuildingOfficeIcon as BuildingOfficeIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid'

const RestaurantStaffManagement: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'staff'
  })
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'staff',
    isActive: true
  })
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const { restaurantUsers, refreshRestaurantUsers } = useUsers()

  // Mock data - in real app this would come from API
  const restaurantName = id === '15' ? 'Loetje' : id === '16' ? 'Splitty' : id === '6' ? 'Limon B.V.' : 'Restaurant'
  
  // Get staff members for this restaurant
  const staffMembers = restaurantUsers[id] || []
  
  // Refresh on mount and when ID changes
  useEffect(() => {
    if (id) {
      refreshRestaurantUsers()
    }
  }, [id])

  // Lock body scroll when modals are open
  useEffect(() => {
    if (showAddModal || showEditModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showAddModal, showEditModal])

  const filteredStaff = staffMembers.filter((member) => {
    const fullName = `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase()
    const email = (member.email || '').toLowerCase()
    const searchLower = searchQuery.toLowerCase()
    
    const matchesSearch = 
      fullName.includes(searchLower) ||
      email.includes(searchLower)
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  const rolePermissions = {
    admin: [
      { icon: ShieldCheckIcon, permission: t('restaurants.staff.permissions.admin.fullAccess') },
      { icon: UserGroupIcon, permission: t('restaurants.staff.permissions.admin.manageStaff') },
      { icon: ChartBarIcon, permission: t('restaurants.staff.permissions.admin.viewAnalytics') },
      { icon: CogIcon, permission: t('restaurants.staff.permissions.admin.configureIntegrations') },
    ],
    staff: [
      { icon: ClipboardDocumentCheckIcon, permission: t('restaurants.staff.permissions.staff.viewOrders') },
      { icon: UserIcon, permission: t('restaurants.staff.permissions.staff.updateProfile') },
      { icon: ChartBarIcon, permission: t('restaurants.staff.permissions.staff.viewBasicStats') },
    ],
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
                    {restaurantName}
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span className="ml-1 font-medium text-gray-900" aria-current="page">
                    {t('restaurants.staff.title')}
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
              {t('restaurants.staff.backToRestaurant', { name: restaurantName })}
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">{t('restaurants.staff.title')}</h1>
                <p className="text-gray-600">{t('restaurants.staff.subtitle', { name: restaurantName })}</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                {t('restaurants.staff.addStaff')}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">{t('restaurants.staff.stats.total')}</p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">{staffMembers.length}</p>
                <p className="text-xs text-gray-500 mt-1">{t('restaurants.staff.stats.members')}</p>
              </div>
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">{t('restaurants.staff.stats.admins')}</p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {staffMembers.filter(m => m.role === 'admin').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t('restaurants.staff.roles.restaurantAdmin')}</p>
              </div>
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">{t('restaurants.staff.stats.staff')}</p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {staffMembers.filter(m => m.role === 'staff').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t('restaurants.staff.roles.restaurantStaff')}</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none"
                    placeholder={t('restaurants.staff.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 focus:outline-none"
                >
                  <option value="all">{t('restaurants.staff.filters.allRoles')}</option>
                  <option value="admin">{t('restaurants.staff.roles.restaurantAdmin')}</option>
                  <option value="staff">{t('restaurants.staff.roles.restaurantStaff')}</option>
                </select>
              </div>
            </div>

            {filteredStaff.length === 0 ? (
              <>
                {/* Empty State */}
                <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="text-center py-20">
                    <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <UserGroupIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('restaurants.staff.empty.title')}</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">{t('restaurants.staff.empty.description')}</p>
                    <div className="mt-8">
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                      >
                        <UserPlusIcon className="h-5 w-5 mr-2" />
                        {t('restaurants.staff.empty.addFirst')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Admin Role */}
                  <div className="rounded-xl bg-white shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                        <BuildingOfficeIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('restaurants.staff.roles.restaurantAdmin')}</h3>
                        <p className="text-sm text-gray-500">{t('restaurants.staff.roles.adminDescription')}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {rolePermissions.admin.map((perm, index) => (
                        <div key={index} className="flex items-start bg-gray-50 rounded-lg p-3">
                          {perm.icon && React.createElement(perm.icon, { className: "h-5 w-5 text-green-600 mr-3 mt-0.5" })}
                          <span className="text-sm text-gray-700">{perm.permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staff Role */}
                  <div className="rounded-xl bg-white shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('restaurants.staff.roles.restaurantStaff')}</h3>
                        <p className="text-sm text-gray-500">{t('restaurants.staff.roles.staffDescription')}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {rolePermissions.staff.map((perm, index) => (
                        <div key={index} className="flex items-start bg-gray-50 rounded-lg p-3">
                          {perm.icon && React.createElement(perm.icon, { className: "h-5 w-5 text-green-600 mr-3 mt-0.5" })}
                          <span className="text-sm text-gray-700">{perm.permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Staff List */}
                <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="border-b bg-gray-50 border-gray-200">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            {t('restaurants.staff.table.user')}
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            {t('restaurants.staff.table.role')}
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            {t('common.status')}
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            {t('restaurants.staff.table.lastActivity')}
                          </th>
                          <th scope="col" className="relative px-6 py-4">
                            <span className="sr-only">{t('common.actions')}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredStaff.map((member) => (
                          <tr key={member.id} className="transition-colors hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full flex items-center justify-center font-semibold bg-green-100 text-green-700">
                                  {`${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{`${member.firstName || ''} ${member.lastName || ''}`}</div>
                                  <div className="text-sm text-gray-500">{member.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {member.role === 'admin' ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700">
                                  {t('restaurants.staff.roles.restaurantAdmin')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-50 text-cyan-700">
                                  {t('restaurants.staff.roles.restaurantStaff')}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                                {t('common.active')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{member.lastActive}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => {
                                    setEditFormData({
                                      firstName: member.firstName || '',
                                      lastName: member.lastName || '',
                                      email: member.email,
                                      phone: member.phone || '',
                                      role: member.role,
                                      isActive: member.status === 'active'
                                    })
                                    setSelectedUser(member)
                                    setShowEditModal(true)
                                  }}
                                  className="text-sm font-medium transition-colors text-green-600 hover:text-green-700"
                                >
                                  {t('common.edit')}
                                </button>
                                <span className="text-gray-300">•</span>
                                <button className="text-sm font-medium transition-colors text-red-600 hover:text-red-700">
                                  {t('common.delete')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Footer */}
                  <div className="px-6 py-4 border-t bg-gray-50 border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-gray-900">{filteredStaff.length}</span> {t('restaurants.staff.table.usersFound')}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full p-8 border border-gray-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('restaurants.staff.modal.editTitle')}</h3>
                <p className="text-gray-600">{t('restaurants.staff.modal.editSubtitle', { name: `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}` })}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setShowPasswordSection(false)
                  setNewPassword('')
                  setConfirmNewPassword('')
                }}
                className="text-gray-600 hover:text-gray-900 transition p-2"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-900">Gebruiker gegevens bewerken</h4>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission here
                console.log('Edit form submitted:', editFormData);
                setShowEditModal(false);
                setSelectedUser(null);
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.firstName')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.lastName')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.email')}</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.phone')}</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('restaurants.staff.modal.phonePlaceholder')}
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">{t('restaurants.staff.modal.role')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="relative">
                      <input 
                        type="radio" 
                        name="edit-role" 
                        value="staff" 
                        className="sr-only peer" 
                        checked={editFormData.role === 'staff'}
                        onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                      />
                      <div className="p-4 rounded-lg border-2 transition-all bg-gray-50 border-gray-200 peer-checked:bg-blue-50 peer-checked:border-blue-400 cursor-pointer">
                        <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
                        <p className="font-medium text-center">{t('restaurants.staff.modal.staff')}</p>
                        <p className="text-xs mt-1 text-center opacity-75">{t('restaurants.staff.modal.basicAccess')}</p>
                      </div>
                    </label>
                    <label className="relative">
                      <input 
                        type="radio" 
                        name="edit-role" 
                        value="admin" 
                        className="sr-only peer" 
                        checked={editFormData.role === 'admin'}
                        onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                      />
                      <div className="p-4 rounded-lg border-2 transition-all bg-gray-50 border-gray-200 peer-checked:bg-blue-50 peer-checked:border-blue-400 cursor-pointer">
                        <ShieldCheckIcon className="h-6 w-6 mx-auto mb-2" />
                        <p className="font-medium text-center">{t('restaurants.staff.modal.manager')}</p>
                        <p className="text-xs mt-1 text-center opacity-75">{t('restaurants.staff.modal.fullAccess')}</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Password Change Section */}
                <div className="border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordSection(!showPasswordSection)
                      setNewPassword('')
                      setConfirmNewPassword('')
                    }}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-4"
                  >
                    <KeyIcon className="h-4 w-4 mr-2" />
                    {showPasswordSection ? 'Annuleer wachtwoord wijzigen' : 'Wachtwoord wijzigen'}
                  </button>
                  
                  {showPasswordSection && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Nieuw wachtwoord</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                            placeholder={t('restaurants.staff.modal.passwordPlaceholder')}
                            minLength="8"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                          >
                            {showNewPassword ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Bevestig nieuw wachtwoord</label>
                        <div className="relative">
                          <input
                            type={showConfirmNewPassword ? "text" : "password"}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                            placeholder={t('restaurants.staff.modal.confirmPasswordPlaceholder')}
                            minLength="8"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                          >
                            {showConfirmNewPassword ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Wijzigingen Opslaan
                </button>
              </form>
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="text-green-500 font-medium">Tip:</span> Wijzigingen aan gebruikersgegevens worden direct toegepast na het opslaan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full p-8 border border-gray-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('restaurants.staff.modal.addTitle')}</h3>
                <p className="text-gray-600">{t('restaurants.staff.modal.addSubtitle', { name: restaurantName })}</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-600 hover:text-gray-900 transition p-2"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-900">{t('restaurants.staff.modal.addNewUser')}</h4>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission here
                console.log('Form submitted:', formData);
                setShowAddModal(false);
                // Reset form
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: '',
                  role: 'staff'
                });
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.firstName')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('restaurants.staff.modal.firstNamePlaceholder')}
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.lastName')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('restaurants.staff.modal.lastNamePlaceholder')}
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.email')}</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('restaurants.staff.modal.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.phone')}</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('restaurants.staff.modal.phonePlaceholder')}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.password')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                      placeholder={t('restaurants.staff.modal.passwordPlaceholder')}
                      minLength="8"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.staff.modal.confirmPassword')}</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                      placeholder={t('restaurants.staff.modal.confirmPasswordPlaceholder')}
                      minLength="8"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">{t('restaurants.staff.modal.role')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="relative">
                      <input 
                        type="radio" 
                        name="role" 
                        value="staff" 
                        className="sr-only peer" 
                        checked={formData.role === 'staff'}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      />
                      <div className="p-4 rounded-lg border-2 transition-all bg-gray-50 border-gray-200 peer-checked:bg-blue-50 peer-checked:border-blue-400 cursor-pointer">
                        <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
                        <p className="font-medium text-center">{t('restaurants.staff.modal.staff')}</p>
                        <p className="text-xs mt-1 text-center opacity-75">{t('restaurants.staff.modal.basicAccess')}</p>
                      </div>
                    </label>
                    <label className="relative">
                      <input 
                        type="radio" 
                        name="role" 
                        value="admin" 
                        className="sr-only peer" 
                        checked={formData.role === 'admin'}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      />
                      <div className="p-4 rounded-lg border-2 transition-all bg-gray-50 border-gray-200 peer-checked:bg-blue-50 peer-checked:border-blue-400 cursor-pointer">
                        <ShieldCheckIcon className="h-6 w-6 mx-auto mb-2" />
                        <p className="font-medium text-center">{t('restaurants.staff.modal.manager')}</p>
                        <p className="text-xs mt-1 text-center opacity-75">{t('restaurants.staff.modal.fullAccess')}</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition"
                >
                  {t('restaurants.staff.modal.addUser')}
                </button>
              </form>
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="text-green-500 font-medium">{t('restaurants.staff.modal.tip')}</span> {t('restaurants.staff.modal.tipMessage')}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
export default RestaurantStaffManagement
