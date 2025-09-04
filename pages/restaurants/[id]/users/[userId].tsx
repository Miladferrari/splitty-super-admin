import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../../components/Layout'
import { useUsers } from '../../../../contexts/UsersContext'
import {
  ArrowLeftIcon,
  UserIcon,
  LockClosedIcon,
  KeyIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

const EditRestaurantUser: NextPage = () => {
  const router = useRouter()
  const { id: restaurantId, userId } = router.query
  const { getRestaurantUser, deleteRestaurantUser } = useUsers()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    is_active: true,
    role: 'staff',
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  
  // Mock current user role - in real app this would come from auth context
  const currentUserRole = 'restaurant_admin' // can be 'restaurant_admin' or 'staff'
  const canDelete = currentUserRole === 'restaurant_admin'

  // Mock restaurant name - in real app this would come from API
  const restaurantName = restaurantId === '6' ? 'Limon B.V.' : 
                        restaurantId === '15' ? 'Loetje' : 
                        restaurantId === '16' ? 'Splitty' : 
                        'Restaurant'

  // Fetch user data from context
  useEffect(() => {
    if (userId && restaurantId) {
      const user = getRestaurantUser(restaurantId, userId)
      if (user) {
        const [firstName, ...lastNameParts] = user.name.split(' ')
        setFormData({
          first_name: firstName,
          last_name: lastNameParts.join(' '),
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          is_active: user.status === 'active',
        })
      }
    }
  }, [userId, restaurantId, getRestaurantUser])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updating restaurant user:', formData)
    router.push(`/restaurants/${restaurantId}/users`)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Wachtwoorden komen niet overeen')
      return
    }
    console.log('Changing password for user:', userId)
    setShowPasswordModal(false)
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleDelete = () => {
    const expectedName = `${formData.first_name} ${formData.last_name}`.toLowerCase()
    if (deleteConfirmation.toLowerCase() === expectedName) {
      deleteRestaurantUser(restaurantId, userId)
      router.push(`/restaurants/${restaurantId}/users`)
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

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Link */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href={`/restaurants/${restaurantId}/users`}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Terug naar personeel beheer
              </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Personeelslid Bewerken</h3>
                  <p className="text-gray-600">Bewerk gegevens voor {restaurantName}</p>
                </div>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Verwijderen
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">Gebruiker gegevens bewerken</h4>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-600 mb-2">
                        Voornaam
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-600 mb-2">
                        Achternaam
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>

                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-2">
                      Telefoon (optioneel)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+31 6 12345678"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-3">Rol</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative">
                        <input 
                          type="radio" 
                          name="role" 
                          value="staff" 
                          className="sr-only peer" 
                          checked={formData.role === 'staff'}
                          onChange={handleInputChange}
                        />
                        <div className="p-4 rounded-lg border-2 transition-all bg-gray-50 border-gray-200 peer-checked:bg-blue-50 peer-checked:border-blue-400 cursor-pointer">
                          <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-medium text-center">Personeel</p>
                          <p className="text-xs mt-1 text-center opacity-75">Basis toegang</p>
                        </div>
                      </label>
                      <label className="relative">
                        <input 
                          type="radio" 
                          name="role" 
                          value="admin" 
                          className="sr-only peer" 
                          checked={formData.role === 'admin'}
                          onChange={handleInputChange}
                        />
                        <div className="p-4 rounded-lg border-2 transition-all bg-gray-50 border-gray-200 peer-checked:bg-blue-50 peer-checked:border-blue-400 cursor-pointer">
                          <ShieldCheckIcon className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-medium text-center">Manager</p>
                          <p className="text-xs mt-1 text-center opacity-75">Volledige toegang</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center">
                      <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="is_active" className="ml-3">
                        <span className="text-sm font-medium text-gray-900">Actieve gebruiker</span>
                        <p className="text-xs text-gray-600">Inactieve gebruikers kunnen niet inloggen</p>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      <KeyIcon className="h-4 w-4 mr-2" />
                      Wachtwoord Wijzigen
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition"
                    >
                      Wijzigingen Opslaan
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="text-green-500 font-medium">Tip:</span> Wijzigingen aan gebruikersgegevens worden direct toegepast na het opslaan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <LockClosedIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3">Wachtwoord Wijzigen</h3>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nieuw Wachtwoord
                </label>
                <input
                  type="password"
                  id="new_password"
                  required
                  minLength="8"
                  className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="confirm_new_password" className="block text-sm font-medium text-gray-700 mb-2">
                  Bevestig Nieuw Wachtwoord
                </label>
                <input
                  type="password"
                  id="confirm_new_password"
                  required
                  className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
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
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition"
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3">Gebruiker Verwijderen</h3>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm font-medium mb-1">⚠️ Let op!</p>
              <p className="text-gray-700 text-sm">
                Je staat op het punt om <span className="text-gray-900 font-medium">{formData.first_name} {formData.last_name}</span> permanent te verwijderen. 
                Deze actie kan niet ongedaan worden gemaakt.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="delete_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                Type de volledige naam van de gebruiker om te bevestigen:
              </label>
              <input
                type="text"
                id="delete_confirmation"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={`${formData.first_name} ${formData.last_name}`}
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />
              <p className="text-xs text-gray-600 mt-2">
                Verwachte invoer: <span className="text-gray-900 font-mono">{formData.first_name} {formData.last_name}</span>
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                className="px-6 py-3 bg-[#0A0B0F] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition"
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteConfirmation.toLowerCase() !== `${formData.first_name} ${formData.last_name}`.toLowerCase()}
                className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
export default EditRestaurantUser
