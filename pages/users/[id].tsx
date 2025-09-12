import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useUsers } from '../../contexts/UsersContext'
import {
  ArrowLeftIcon,
  UserIcon,
  LockClosedIcon,
  KeyIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CodeBracketIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

const EditUser: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { getCompanyUser, deleteCompanyUser } = useUsers()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    is_active: true,
    role: '',
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  
  // Mock current user role - in real app this would come from auth context
  const currentUserRole = 'ceo' // can be 'ceo', 'admin', 'account_manager', 'support', 'developer'
  const canDelete = ['ceo', 'admin'].includes(currentUserRole)

  // Fetch user data from context
  useEffect(() => {
    if (id) {
      const user = getCompanyUser(id)
      if (user) {
        const [firstName, ...lastNameParts] = user.name.split(' ')
        setFormData({
          first_name: firstName,
          last_name: lastNameParts.join(' '),
          email: user.email,
          phone: user.phone,
          department: user.department,
          role: user.role,
          is_active: user.status === 'active',
        })
      }
    }
    
    // Check if delete parameter is present
    if (router.query.delete === 'true' && canDelete) {
      setShowDeleteModal(true)
    }
  }, [id, router.query.delete, canDelete, getCompanyUser])

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
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updating user:', formData)
    router.push('/users')
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Wachtwoorden komen niet overeen')
      return
    }
    console.log('Changing password for user:', id)
    setShowPasswordModal(false)
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleDelete = () => {
    // Check if user is trying to delete themselves
    const currentUserId = localStorage.getItem('userId')
    if (currentUserId && parseInt(currentUserId) === parseInt(id)) {
      alert('Je kunt jezelf niet verwijderen!')
      return
    }
    
    const expectedName = `${formData.first_name} ${formData.last_name}`.toLowerCase()
    if (deleteConfirmation.toLowerCase() === expectedName) {
      deleteCompanyUser(id)
      router.push('/users')
    } else {
      alert('De naam komt niet overeen. Verwijdering geannuleerd.')
    }
  }

  // Lock body scroll when modals are open
  useEffect(() => {
    if (showPasswordModal || showDeleteModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showPasswordModal, showDeleteModal])

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

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ceo': return 'CEO'
      case 'admin': return 'Administrator'
      case 'account_manager': return 'Account Manager'
      case 'support': return 'Support'
      case 'developer': return 'Developer'
      default: return role
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
                Terug naar team overzicht
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${
                      false 
                        ? 'bg-green-500/20'
                        : 'bg-green-100'
                    }`}>
                      <UserIcon className={`h-6 w-6 ${
                        false ? 'text-green-400' : 'text-green-600'
                      }`} />
                    </div>
                    <h1 className={`text-xl font-semibold ml-3 ${
                      false ? 'text-white' : 'text-gray-900'
                    }`}>Medewerker Bewerken</h1>
                  </div>
                  {canDelete && id !== '1' && ( // Don't allow deleting CEO account
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className={`inline-flex items-center px-4 py-2 rounded-lg transition ${
                        false
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Verwijderen
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className={`text-lg font-semibold ${
                    false ? 'text-white' : 'text-gray-900'
                  }`}>Persoonlijke Gegevens</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        Voornaam <span className={false ? 'text-red-400' : 'text-red-500'}>*</span>
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
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="last_name" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        Achternaam <span className={false ? 'text-red-400' : 'text-red-500'}>*</span>
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
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        E-mailadres <span className={false ? 'text-red-400' : 'text-red-500'}>*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className={`h-5 w-5 ${
                            false ? 'text-[#BBBECC]' : 'text-gray-400'
                          }`} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                            false
                              ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                          }`}
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-gray-700'
                      }`}>
                        Telefoonnummer
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className={`h-5 w-5 ${
                            false ? 'text-[#BBBECC]' : 'text-gray-400'
                          }`} />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                            false
                              ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                          }`}
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role & Department */}
                <div className="space-y-4">
                  <h2 className={`text-lg font-semibold ${
                    false ? 'text-white' : 'text-gray-900'
                  }`}>Rol & Afdeling</h2>
                  
                  {/* Role Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${
                      false ? 'text-[#BBBECC]' : 'text-gray-700'
                    }`}>Rol</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: 'ceo', label: 'CEO', desc: 'Volledige toegang tot alle functies', icon: ShieldCheckIcon },
                        { value: 'admin', label: 'Administrator', desc: 'Systeem beheer en configuratie', icon: ShieldCheckIcon },
                        { value: 'account_manager', label: 'Account Manager', desc: 'Restaurant relaties beheren', icon: UserGroupIcon },
                        { value: 'support', label: 'Support', desc: 'Klantondersteuning', icon: UserIcon },
                        { value: 'developer', label: 'Developer', desc: 'Technische ontwikkeling', icon: CodeBracketIcon },
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
                      Afdeling
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingOfficeIcon className={`h-5 w-5 ${
                          false ? 'text-[#BBBECC]' : 'text-gray-400'
                        }`} />
                      </div>
                      <select
                        id="department"
                        name="department"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 appearance-none transition ${
                          false
                            ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white focus:ring-[#2BE89A] focus:border-transparent'
                            : 'bg-white border-gray-200 text-gray-900 focus:ring-green-500 focus:border-transparent'
                        }`}
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selecteer een afdeling</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
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
                        }`}>Actieve medewerker</span>
                        <p className={`text-xs ${
                          false ? 'text-[#BBBECC]' : 'text-gray-500'
                        }`}>Inactieve medewerkers kunnen niet inloggen</p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className={`flex justify-between pt-6 border-t ${
                  false ? 'border-[#2a2d3a]' : 'border-gray-200'
                }`}>
                  <div className="flex space-x-3">
                    <Link
                      href="/users"
                      className={`px-6 py-2.5 font-medium rounded-lg transition ${
                        false
                          ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white hover:bg-[#1a1c25]'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Annuleren
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className={`inline-flex items-center px-6 py-2.5 font-medium rounded-lg transition ${
                        false
                          ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white hover:bg-[#1a1c25]'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <KeyIcon className="h-5 w-5 mr-2" />
                      Wachtwoord Wijzigen
                    </button>
                  </div>
                  <button
                    type="submit"
                    className={`px-6 py-2.5 font-medium rounded-lg transition ${
                      false
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Opslaan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 max-w-md w-full mx-4 ${
            false 
              ? 'bg-[#1c1e27] border border-[#2a2d3a]'
              : 'bg-white shadow-2xl'
          }`}>
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-lg ${
                false 
                  ? 'bg-green-500/20'
                  : 'bg-green-100'
              }`}>
                <LockClosedIcon className={`h-6 w-6 ${
                  false ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold ml-3 ${
                false ? 'text-white' : 'text-gray-900'
              }`}>Wachtwoord Wijzigen</h3>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="new_password" className={`block text-sm font-medium mb-2 ${
                  false ? 'text-[#BBBECC]' : 'text-gray-700'
                }`}>
                  Nieuw Wachtwoord
                </label>
                <input
                  type="password"
                  id="new_password"
                  required
                  minLength="8"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                    false
                      ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                  }`}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="confirm_new_password" className={`block text-sm font-medium mb-2 ${
                  false ? 'text-[#BBBECC]' : 'text-gray-700'
                }`}>
                  Bevestig Nieuw Wachtwoord
                </label>
                <input
                  type="password"
                  id="confirm_new_password"
                  required
                  className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                    false
                      ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                  }`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  className={`px-6 py-2.5 font-medium rounded-lg transition ${
                    false
                      ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white hover:bg-[#1a1c25]'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 font-medium rounded-lg transition ${
                    false
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Wachtwoord Wijzigen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 max-w-md w-full mx-4 ${
            false 
              ? 'bg-[#1c1e27] border border-[#2a2d3a]'
              : 'bg-white shadow-2xl'
          }`}>
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-lg ${
                false ? 'bg-red-500/20' : 'bg-red-100'
              }`}>
                <TrashIcon className={`h-6 w-6 ${
                  false ? 'text-red-400' : 'text-red-600'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold ml-3 ${
                false ? 'text-white' : 'text-gray-900'
              }`}>Medewerker Verwijderen</h3>
            </div>
            
            <div className={`rounded-lg p-4 mb-6 ${
              false 
                ? 'bg-red-500/10 border border-red-500/30'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-medium mb-1 ${
                false ? 'text-red-400' : 'text-red-600'
              }`}>⚠️ Let op!</p>
              <p className={`text-sm ${
                false ? 'text-[#BBBECC]' : 'text-gray-700'
              }`}>
                Je staat op het punt om <span className={`font-medium ${
                  false ? 'text-white' : 'text-gray-900'
                }`}>{formData.first_name} {formData.last_name}</span> permanent te verwijderen. 
                Deze medewerker zal geen toegang meer hebben tot het Splitty platform.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="delete_confirmation" className={`block text-sm font-medium mb-2 ${
                false ? 'text-[#BBBECC]' : 'text-gray-700'
              }`}>
                Type de volledige naam van de medewerker om te bevestigen:
              </label>
              <input
                type="text"
                id="delete_confirmation"
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                  false
                    ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-red-500 focus:border-transparent'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-red-500 focus:border-transparent'
                }`}
                placeholder={`${formData.first_name} ${formData.last_name}`}
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />
              <p className={`text-xs mt-2 ${
                false ? 'text-[#BBBECC]' : 'text-gray-600'
              }`}>
                Verwachte invoer: <span className={`font-mono ${
                  false ? 'text-white' : 'text-gray-900'
                }`}>{formData.first_name} {formData.last_name}</span>
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                className={`px-6 py-2.5 font-medium rounded-lg transition ${
                  false
                    ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white hover:bg-[#1a1c25]'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteConfirmation.toLowerCase() !== `${formData.first_name} ${formData.last_name}`.toLowerCase()}
                className={`px-6 py-2.5 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  false
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Permanent Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
export default EditUser
