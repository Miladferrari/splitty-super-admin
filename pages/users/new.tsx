import type { NextPage } from 'next'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useUsers } from '../../contexts/UsersContext'
import { useTranslation } from '../../contexts/TranslationContext'
import {
  ArrowLeftIcon,
  UserPlusIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  UserIcon,
  UserGroupIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline'

const NewUser: NextPage = () => {
  const router = useRouter()
  const { addCompanyUser } = useUsers()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    is_active: true,
    role: 'support', // default to support role
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const departments = [
    'Executive',
    'Operations',
    'Sales',
    'Customer Success',
    'Engineering',
    'Marketing',
    'Finance',
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Update password strength
    if (name === 'password') {
      const strength = calculatePasswordStrength(value)
      setPasswordStrength(strength)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    return strength
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return { text: t('team.new.passwordStrengthLevels.veryWeak'), color: 'bg-red-500' }
      case 1: return { text: t('team.new.passwordStrengthLevels.weak'), color: 'bg-orange-500' }
      case 2: return { text: t('team.new.passwordStrengthLevels.fair'), color: 'bg-yellow-500' }
      case 3: return { text: t('team.new.passwordStrengthLevels.strong'), color: 'bg-green-500' }
      case 4: return { text: t('team.new.passwordStrengthLevels.veryStrong'), color: 'bg-[#2BE89A]' }
      default: return { text: '', color: '' }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.password !== confirmPassword) {
      alert(t('team.new.passwordValidationError'))
      return
    }
    
    // Create the new user
    const userData = {
      name: `${formData.first_name} ${formData.last_name}`,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || '',
      role: formData.role,
      department: formData.department,
      status: formData.is_active ? 'active' : 'inactive',
    }
    
    addCompanyUser(userData)
    router.push('/users')
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ceo': return ShieldCheckIcon
      case 'admin': return ShieldCheckIcon
      case 'account_manager': return UserGroupIcon
      case 'support': return UserIcon
      case 'developer': return CodeBracketIcon
      default: return UserIcon
    }
  }

  return (
    <Layout>
      <div className={`min-h-screen ${false ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Link
                href="/users"
                className={`inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium mb-4 group ${
                  false 
                    ? 'bg-[#1c1e27] border border-[#2a2d3a] text-[#BBBECC] hover:text-white hover:bg-[#252833] hover:border-green-500/50'
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-100 hover:border-green-300'
                }`}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('team.new.backToTeam')}
              </Link>
            </div>

            {/* Form Card */}
            <div className={`rounded-xl overflow-hidden ${
              false 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                : 'bg-white shadow-sm'
            }`}>
              <div className={`px-6 py-4 border-b ${
                false ? 'border-[#2a2d3a]' : 'border-gray-200'
              }`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    false 
                      ? 'bg-green-500/20'
                      : 'bg-green-100'
                  }`}>
                    <UserPlusIcon className={`h-6 w-6 ${
                      false ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                  <h1 className={`text-xl font-semibold ml-3 ${
                    false ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('team.new.addNewEmployee')}
                  </h1>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className={`text-lg font-semibold ${
                    false ? 'text-white' : 'text-gray-900'
                  }`}>{t('team.new.personalInfo')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        {t('team.new.firstName')}
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                          false
                            ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                        }`}
                        placeholder={t('team.new.placeholders.firstName')}
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="last_name" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        {t('team.new.lastName')}
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                          false
                            ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                        }`}
                        placeholder={t('team.new.placeholders.lastName')}
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        {t('team.new.email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                          false
                            ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                        }`}
                        placeholder={t('team.new.placeholders.email')}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        {t('team.new.phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                          false
                            ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                        }`}
                        placeholder={t('team.new.placeholders.phone')}
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4">
                  <h2 className={`text-lg font-semibold flex items-center ${
                    false ? 'text-white' : 'text-gray-900'
                  }`}>
                    <LockClosedIcon className={`h-5 w-5 mr-2 ${
                      false ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`} />
                    {t('team.new.security')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        {t('team.new.password')}
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        minLength="8"
                        className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                          false
                            ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                        }`}
                        placeholder={t('team.new.placeholders.password')}
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs ${
                              false ? 'text-[#BBBECC]' : 'text-gray-500'
                            }`}>{t('team.new.passwordStrength')}</span>
                            <span className={`text-xs font-medium ${getPasswordStrengthText().color.replace('bg-', 'text-')}`}>
                              {getPasswordStrengthText().text}
                            </span>
                          </div>
                          <div className={`w-full rounded-full h-2 ${
                            false ? 'bg-[#0A0B0F]' : 'bg-gray-200'
                          }`}>
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthText().color}`}
                              style={{ width: `${(passwordStrength / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirm_password" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        {t('team.new.confirmPassword')}
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                          false
                            ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                        }`}
                        placeholder={t('team.new.placeholders.password')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {confirmPassword && formData.password && (
                        <p className={`mt-2 text-xs flex items-center ${confirmPassword === formData.password ? 'text-[#2BE89A]' : 'text-red-400'}`}>
                          {confirmPassword === formData.password ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              {t('team.new.passwordsMatch')}
                            </>
                          ) : (
                            t('team.new.passwordsNoMatch')
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role & Restaurant */}
                <div className="space-y-4">
                  <h2 className={`text-lg font-semibold ${
                    false ? 'text-white' : 'text-gray-900'
                  }`}>{t('team.new.roleAccess')}</h2>
                  
                  {/* Role Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${
                      false ? 'text-[#BBBECC]' : 'text-gray-700'
                    }`}>{t('team.new.selectRole')}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: 'ceo', label: t('team.new.roles.ceo.label'), desc: t('team.new.roles.ceo.description'), icon: ShieldCheckIcon },
                        { value: 'admin', label: t('team.new.roles.admin.label'), desc: t('team.new.roles.admin.description'), icon: ShieldCheckIcon },
                        { value: 'account_manager', label: t('team.new.roles.accountManager.label'), desc: t('team.new.roles.accountManager.description'), icon: UserGroupIcon },
                        { value: 'support', label: t('team.new.roles.support.label'), desc: t('team.new.roles.support.description'), icon: UserIcon },
                        { value: 'developer', label: t('team.new.roles.developer.label'), desc: t('team.new.roles.developer.description'), icon: CodeBracketIcon },
                      ].map((role) => (
                        <label
                          key={role.value}
                          className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all ${
                            formData.role === role.value
                              ? false 
                                ? 'bg-[#0A0B0F] border-green-500'
                                : 'bg-green-50 border-green-500'
                              : false
                                ? 'bg-[#0A0B0F] border-[#2a2d3a] hover:border-[#2BE89A]/50'
                                : 'bg-white border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role.value}
                            checked={formData.role === role.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className="flex flex-col w-full">
                            <div className="flex items-center mb-2">
                              <div className={`p-2 rounded-lg ${
                                false 
                                  ? 'bg-gray-700'
                                  : 'bg-gray-100'
                              }`}>
{role.icon && React.createElement(role.icon, { className: `h-5 w-5 ${formData.role === role.value ? 'text-green-500' : false ? 'text-gray-400' : 'text-gray-600'}` })}
                              </div>
                              <span className={`ml-3 text-sm font-medium ${
                                false ? 'text-white' : 'text-gray-900'
                              }`}>{role.label}</span>
                            </div>
                            <p className={`text-xs ${
                              false ? 'text-[#BBBECC]' : 'text-gray-500'
                            }`}>{role.desc}</p>
                          </div>
                          {formData.role === role.value && (
                            <CheckCircleIcon className={`absolute top-4 right-4 h-5 w-5 ${
                              false ? 'text-[#2BE89A]' : 'text-green-500'
                            }`} />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Department Selection */}
                  <div>
                    <label htmlFor="department" className={`block text-sm font-medium mb-2 ${
                      false ? 'text-[#BBBECC]' : 'text-gray-700'
                    }`}>
                      {t('team.new.department')}
                    </label>
                    <select
                      id="department"
                      name="department"
                      className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                        false
                          ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white focus:ring-[#2BE89A] focus:border-transparent'
                          : 'bg-white border-gray-200 text-gray-900 focus:ring-green-500 focus:border-transparent'
                      }`}
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{t('team.new.selectDepartment')}</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Active Status */}
                  <div className={`rounded-lg p-4 ${
                    false 
                      ? 'bg-[#0A0B0F]'
                      : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center">
                      <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        className={`h-4 w-4 rounded focus:ring-2 ${
                          false
                            ? 'text-[#2BE89A] focus:ring-[#2BE89A] border-[#2a2d3a] bg-[#0A0B0F]'
                            : 'text-green-600 focus:ring-green-500 border-gray-300 bg-white'
                        }`}
                        checked={formData.is_active}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="is_active" className="ml-3">
                        <span className={`text-sm font-medium ${
                          false ? 'text-white' : 'text-gray-900'
                        }`}>{t('team.new.activeEmployee')}</span>
                        <p className={`text-xs ${
                          false ? 'text-[#BBBECC]' : 'text-gray-500'
                        }`}>{t('team.new.inactiveEmployeeNote')}</p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className={`flex justify-between pt-6 border-t ${
                  false ? 'border-[#2a2d3a]' : 'border-gray-200'
                }`}>
                  <Link
                    href="/users"
                    className={`px-6 py-2.5 font-medium rounded-lg transition ${
                      false
                        ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white hover:bg-[#1a1c25]'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('team.new.cancel')}
                  </Link>
                  <button
                    type="submit"
                    className={`px-6 py-2.5 font-medium rounded-lg transition ${
                      false
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {t('team.new.addEmployee')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default NewUser
