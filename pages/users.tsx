import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useUsers } from '../contexts/UsersContext'
import { useTranslation } from '../contexts/TranslationContext'
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

const Users: NextPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentUserRole, setCurrentUserRole] = useState('support')
  const [canDelete, setCanDelete] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { companyUsers } = useUsers()
  
  useEffect(() => {
    // Get current user role from localStorage (set during login)
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole') || 'support'
      setCurrentUserRole(role)
      setCanDelete(['ceo', 'admin'].includes(role))
      setMounted(true)
    }
  }, [])

  const filteredUsers = companyUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const formatDate = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} ${t('common.time')} ${t('common.ago')}`
    if (diffHours < 24) return `${diffHours} ${t('common.hours')} ${t('common.ago')}`
    if (diffDays < 7) return `${diffDays} ${t('common.days')} ${t('common.ago')}`
    
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  // Removed icon and style functions as we're using inline styles now

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ceo':
        return t('users.roles.ceo')
      case 'admin':
        return t('users.roles.admin')
      case 'account_manager':
        return t('users.roles.accountManager')
      case 'support':
        return t('users.roles.support')
      case 'developer':
        return t('users.roles.developer')
      default:
        return role
    }
  }

  const stats = [
    { 
      label: 'Totaal Medewerkers', 
      value: companyUsers.length, 
      icon: UsersIcon, 
      color: 'from-[#2BE89A] to-[#4FFFB0]' 
    },
    { 
      label: 'Actief', 
      value: companyUsers.filter(u => u.status === 'active').length, 
      icon: CheckCircleIcon, 
      color: 'from-[#4ECDC4] to-[#44A08D]' 
    },
    { 
      label: 'Administrators', 
      value: companyUsers.filter(u => u.role === 'admin' || u.role === 'ceo').length, 
      icon: ShieldCheckIcon, 
      color: 'from-[#667EEA] to-[#764BA2]' 
    },
    { 
      label: 'Support Team', 
      value: companyUsers.filter(u => u.role === 'support' || u.role === 'account_manager').length, 
      icon: UserGroupIcon, 
      color: 'from-[#FF6B6B] to-[#FF8E53]' 
    },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('users.title') }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  {t('users.title')}
                </h1>
                <p className="text-gray-600">
                  {t('users.subtitle')}
                </p>
              </div>
              <Link
                href="/users/new"
                className="inline-flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                {t('users.newUser')}
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">
                  {t('users.stats.totalUsers')}
                </p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {mounted ? companyUsers.length : 0}
                </p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">
                  {t('users.stats.activeUsers')}
                </p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {mounted ? companyUsers.filter(u => u.status === 'active').length : 0}
                </p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">
                  {t('users.stats.adminUsers')}
                </p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {mounted ? companyUsers.filter(u => u.role === 'admin' || u.role === 'ceo').length : 0}
                </p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">
                  {t('users.stats.supportTeam')}
                </p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {mounted ? companyUsers.filter(u => u.role === 'support' || u.role === 'account_manager').length : 0}
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none"
                    placeholder={t('users.search')}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 focus:outline-none"
                >
                  <option value="all">{t('common.all')} {t('users.table.role')}</option>
                  <option value="ceo">{t('users.roles.ceo')}</option>
                  <option value="admin">{t('users.roles.admin')}</option>
                  <option value="account_manager">{t('users.roles.accountManager')}</option>
                  <option value="support">{t('users.roles.support')}</option>
                  <option value="developer">{t('users.roles.developer')}</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 focus:outline-none"
                >
                  <option value="all">{t('common.all')} {t('common.status')}</option>
                  <option value="active">{t('users.status.active')}</option>
                  <option value="inactive">{t('users.status.inactive')}</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b bg-gray-50 border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('users.table.name')}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('common.department')}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('users.table.role')}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('users.table.status')}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {t('users.table.lastLogin')}
                      </th>
                      <th scope="col" className="relative px-6 py-4">
                        <span className="sr-only">{t('users.table.actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center font-semibold bg-green-100 text-green-700">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm flex items-center mt-1 text-gray-500">
                                <EnvelopeIcon className="h-3.5 w-3.5 mr-1" />
                                {user.email}
                              </div>
                              <div className="text-sm flex items-center mt-0.5 text-gray-500">
                                <PhoneIcon className="h-3.5 w-3.5 mr-1" />
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {user.department}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            user.role === 'ceo' 
                              ? 'bg-purple-50 text-purple-700'
                              : user.role === 'admin'
                              ? 'bg-blue-50 text-blue-700'
                              : user.role === 'account_manager'
                              ? 'bg-cyan-50 text-cyan-700'
                              : user.role === 'support'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                              {t('users.status.active')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700">
                              <XCircleIcon className="h-3.5 w-3.5 mr-1" />
                              {t('users.status.inactive')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-1.5" />
                            {formatDate(user.lastLogin)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/users/${user.id}`}
                              className="text-sm font-medium transition-colors text-green-600 hover:text-green-700"
                            >
                              {t('common.edit')}
                            </Link>
                            {canDelete && user.role !== 'ceo' && (
                              <>
                                <span className="text-gray-300">•</span>
                                <Link
                                  href={`/users/${user.id}?delete=true`}
                                  className="text-sm font-medium transition-colors text-red-600 hover:text-red-700"
                                >
                                  {t('common.delete')}
                                </Link>
                              </>
                            )}
                          </div>
                        </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              {filteredUsers.length > 0 && (
                <div className="px-6 py-4 border-t bg-gray-50 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{filteredUsers.length}</span> {t('users.foundResults')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="rounded-xl p-12 text-center bg-white shadow-sm">
                <UserGroupIcon className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 text-gray-900">{t('users.noResults')}</h3>
                <p className="text-gray-600">
                  {t('users.adjustFilters')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Users
