import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../../components/Layout'
import { useUsers } from '../../../../contexts/UsersContext'
import {
  ArrowLeftIcon,
  UserPlusIcon,
  LockClosedIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'

const NewRestaurantUser: NextPage = () => {
  const router = useRouter()
  const { id: restaurantId } = router.query
  const { addRestaurantUser, restaurantUsers, companyUsers } = useUsers()
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    is_active: true,
    role: 'staff', // 'restaurant_admin' or 'staff'
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Mock restaurant name - in real app this would come from API
  const restaurantName = restaurantId === '6' ? 'Limon B.V.' : 
                        restaurantId === '15' ? 'Loetje' : 
                        restaurantId === '16' ? 'Splitty' : 
                        'Restaurant'

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
      case 0: return { text: 'Zeer zwak', color: 'bg-red-500' }
      case 1: return { text: 'Zwak', color: 'bg-orange-500' }
      case 2: return { text: 'Matig', color: 'bg-yellow-500' }
      case 3: return { text: 'Sterk', color: 'bg-green-500' }
      case 4: return { text: 'Zeer sterk', color: 'bg-[#2BE89A]' }
      default: return { text: '', color: '' }
    }
  }

  const validateUniqueFields = () => {
    let isValid = true
    setEmailError('')
    setPhoneError('')
    
    // Check email uniqueness across all users
    const allUsers = [
      ...companyUsers,
      ...Object.values(restaurantUsers).flat()
    ]
    
    const emailExists = allUsers.some(user => 
      user.email && user.email.toLowerCase() === formData.email.toLowerCase()
    )
    
    if (emailExists) {
      setEmailError('Dit e-mailadres is al in gebruik')
      isValid = false
    }
    
    // Check phone uniqueness if provided
    if (formData.phone) {
      const phoneExists = allUsers.some(user => 
        user.phone && user.phone.replace(/\s+/g, '') === formData.phone.replace(/\s+/g, '')
      )
      
      if (phoneExists) {
        setPhoneError('Dit telefoonnummer is al in gebruik')
        isValid = false
      }
    }
    
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.password !== confirmPassword) {
      alert('Wachtwoorden komen niet overeen')
      return
    }
    
    // Validate unique fields
    if (!validateUniqueFields()) {
      return
    }
    
    // Create new user data
    const newUser = {
      name: `${formData.first_name} ${formData.last_name}`,
      email: formData.email,
      phone: formData.phone,
      role: formData.role === 'restaurant_admin' ? 'admin' : 'staff',
      isActive: formData.is_active,
      password: formData.password // In real app, this would be hashed
    }
    
    // Add user to restaurant
    addRestaurantUser(restaurantId, newUser)
    
    // Navigate back to users page
    router.push(`/restaurants/${restaurantId}/users`)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Link
                href={`/restaurants/${restaurantId}/users`}
                className="inline-flex items-center text-[#BBBECC] hover:text-white transition"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Terug naar personeel beheer
              </Link>
            </div>

            {/* Form Card */}
            <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                    <UserPlusIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-semibold text-white">Nieuw Personeelslid Toevoegen</h1>
                    <p className="text-sm text-[#BBBECC] mt-1">{restaurantName}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Persoonlijke Gegevens</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Voornaam
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        required
                        className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Achternaam
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        required
                        className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        E-mailadres
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-[#BBBECC]" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          className={`w-full pl-10 pr-4 py-3 bg-[#0A0B0F] border rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent ${
                            emailError ? 'border-red-500' : 'border-[#2a2d3a]'
                          }`}
                          placeholder="john.doe@restaurant.nl"
                          value={formData.email}
                          onChange={(e) => {
                            handleInputChange(e)
                            setEmailError('') // Clear error on change
                          }}
                        />
                      </div>
                      {emailError && (
                        <p className="mt-2 text-sm text-red-400">{emailError}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Telefoonnummer
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-[#BBBECC]" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          required
                          className={`w-full pl-10 pr-4 py-3 bg-[#0A0B0F] border rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent ${
                            phoneError ? 'border-red-500' : 'border-[#2a2d3a]'
                          }`}
                          placeholder="+31 6 12345678"
                          value={formData.phone}
                          onChange={(e) => {
                            handleInputChange(e)
                            setPhoneError('') // Clear error on change
                          }}
                        />
                      </div>
                      {phoneError && (
                        <p className="mt-2 text-sm text-red-400">{phoneError}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <LockClosedIcon className="h-5 w-5 mr-2 text-[#BBBECC]" />
                    Beveiliging
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Wachtwoord
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        minLength="8"
                        className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-[#BBBECC]">Wachtwoord sterkte</span>
                            <span className={`text-xs font-medium ${getPasswordStrengthText().color.replace('bg-', 'text-')}`}>
                              {getPasswordStrengthText().text}
                            </span>
                          </div>
                          <div className="w-full bg-[#0A0B0F] rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthText().color}`}
                              style={{ width: `${(passwordStrength / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Bevestig Wachtwoord
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        required
                        className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {confirmPassword && formData.password && (
                        <p className={`mt-2 text-xs flex items-center ${confirmPassword === formData.password ? 'text-[#2BE89A]' : 'text-red-400'}`}>
                          {confirmPassword === formData.password ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Wachtwoorden komen overeen
                            </>
                          ) : (
                            'Wachtwoorden komen niet overeen'
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Rol & Toegang</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#BBBECC] mb-3">Selecteer Rol</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { 
                          value: 'restaurant_admin', 
                          label: 'Restaurant Admin', 
                          desc: 'Volledige toegang tot restaurant functies', 
                          icon: BuildingOfficeIcon, 
                          color: 'from-[#667EEA] to-[#764BA2]' 
                        },
                        { 
                          value: 'staff', 
                          label: 'Restaurant Staff', 
                          desc: 'Bestellingen beheren en basis toegang', 
                          icon: UserIcon, 
                          color: 'from-[#4ECDC4] to-[#44A08D]' 
                        },
                      ].map((role) => (
                        <label
                          key={role.value}
                          className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all ${
                            formData.role === role.value
                              ? 'bg-[#0A0B0F] border-[#2BE89A]'
                              : 'bg-[#0A0B0F] border-[#2a2d3a] hover:border-[#2BE89A]/50'
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
                              <div className={`p-2 bg-gradient-to-r ${role.color} rounded-lg`}>
{role.icon && React.createElement(role.icon, { className: "h-5 w-5 text-white" })}
                              </div>
                              <span className="ml-3 text-sm font-medium text-white">{role.label}</span>
                            </div>
                            <p className="text-xs text-[#BBBECC]">{role.desc}</p>
                          </div>
                          {formData.role === role.value && (
                            <CheckCircleIcon className="absolute top-4 right-4 h-5 w-5 text-[#2BE89A]" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="bg-[#0A0B0F] rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        className="h-4 w-4 text-[#2BE89A] focus:ring-[#2BE89A] border-[#2a2d3a] rounded bg-[#0A0B0F]"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="is_active" className="ml-3">
                        <span className="text-sm font-medium text-white">Actieve gebruiker</span>
                        <p className="text-xs text-[#BBBECC]">Inactieve gebruikers kunnen niet inloggen</p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-between pt-6 border-t border-[#2a2d3a]">
                  <Link
                    href={`/restaurants/${restaurantId}/users`}
                    className="px-6 py-3 bg-[#0A0B0F] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition"
                  >
                    Annuleren
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg"
                  >
                    Personeelslid Toevoegen
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
export default NewRestaurantUser
