import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import Breadcrumb from '../../../components/Breadcrumb'
import { useRestaurants } from '../../../contexts/RestaurantsContext'
import { useTranslation } from '../../../contexts/TranslationContext'
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  PhotoIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

const EditRestaurant: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { t } = useTranslation()
  const { getRestaurant, updateRestaurant } = useRestaurants()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'Netherlands',
    logo: null,
    logoPreview: null,
    banner: null,
    bannerPreview: null,
  })

  useEffect(() => {
    if (id) {
      const restaurant = getRestaurant(id)
      if (restaurant) {
        setFormData({
          name: restaurant.name || '',
          email: restaurant.email || '',
          phone: restaurant.phone || '',
          street: restaurant.address?.street || '',
          postalCode: restaurant.address?.postalCode || '',
          city: restaurant.address?.city || 'Amsterdam',
          country: restaurant.address?.country || 'Netherlands',
          logo: restaurant.logo,
          logoPreview: restaurant.logo,
          banner: restaurant.banner,
          bannerPreview: restaurant.banner,
        })
      }
    }
  }, [id, getRestaurant])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          banner: file,
          bannerPreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = t('restaurants.edit.validation.nameRequired')
    if (!formData.email.trim()) newErrors.email = t('restaurants.edit.validation.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('restaurants.edit.validation.invalidEmail')
    }
    if (!formData.phone.trim()) newErrors.phone = t('restaurants.edit.validation.phoneRequired')
    if (!formData.street.trim()) newErrors.street = t('restaurants.edit.validation.streetRequired')
    if (!formData.postalCode.trim()) newErrors.postalCode = t('restaurants.edit.validation.postalCodeRequired')
    if (!formData.city.trim()) newErrors.city = t('restaurants.edit.validation.cityRequired')
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          postalCode: formData.postalCode,
          city: formData.city,
          country: formData.country,
        },
        logo: formData.logoPreview || formData.logo,
        banner: formData.bannerPreview || formData.banner,
      }
      
      updateRestaurant(id, updatedData)
      router.push(`/restaurants/${id}`)
    } catch (error) {
      console.error('Error updating restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const restaurant = getRestaurant(id)
  if (!restaurant) {
    return (
      <Layout>
        <div className={`min-h-screen ${false ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'} flex items-center justify-center`}>
          <p className={false ? 'text-white' : 'text-[#111827]'}>{t('restaurants.notFound')}</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className={`min-h-screen ${false ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb items={[
              { label: 'Restaurants', href: '/restaurants' },
              { label: restaurant?.name || 'Restaurant', href: `/restaurants/${id}` },
              { label: t('restaurants.actions.edit') }
            ]} />
            
            {/* Back Button */}
            <Link
              href={`/restaurants/${id}`}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium mb-4 group ${
                false 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a] text-[#BBBECC] hover:text-white hover:bg-[#0A0B0F] hover:border-green-500' 
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-100 hover:border-green-300'
              }`}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('restaurants.backToProfile')}
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-2xl font-semibold ${false ? 'text-white' : 'text-[#111827]'} mb-1`}>
                {t('restaurants.edit.title')}
              </h1>
              <p className={false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>{t('restaurants.edit.subtitle')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className={`rounded-xl p-6 ${
                false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
              }`}>
                <h2 className={`text-xl font-semibold mb-6 flex items-center ${
                  false ? 'text-white' : 'text-[#111827]'
                }`}>
                  <BuildingStorefrontIcon className={`h-6 w-6 mr-2 ${
                    false ? 'text-[#2BE89A]' : 'text-green-500'
                  }`} />
                  {t('restaurants.edit.basicInfo')}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                      false ? 'text-[#BBBECC]' : 'text-[#6B7280]'
                    }`}>
                      {t('restaurants.edit.restaurantName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition ${
                        false
                          ? `bg-[#0A0B0F] border ${errors.name ? 'border-red-500' : 'border-[#2a2d3a]'} text-white placeholder-[#BBBECC] focus:ring-[#2BE89A]`
                          : `bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} text-gray-900 placeholder-gray-500 focus:ring-green-500 hover:border-gray-300`
                      }`}
                      placeholder={t('restaurants.edit.namePlaceholder')}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="logo" className={`block text-sm font-medium mb-2 ${
                      false ? 'text-[#BBBECC]' : 'text-[#6B7280]'
                    }`}>
                      {t('restaurants.edit.restaurantLogo')}
                    </label>
                    <div className="flex items-center space-x-6">
                      {formData.logoPreview && (
                        <div className={`h-20 w-20 rounded-lg overflow-hidden border-2 ${
                          false ? 'border-[#2a2d3a]' : 'border-gray-200'
                        }`}>
                          <img
                            src={formData.logoPreview}
                            alt="Logo preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="cursor-pointer">
                          <div className={`px-4 py-2.5 rounded-lg transition inline-flex items-center ${
                            false
                              ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-[#BBBECC] hover:bg-[#1c1e27]'
                              : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}>
                            <PhotoIcon className={`h-5 w-5 mr-2 ${false ? 'text-[#BBBECC]' : 'text-gray-500'}`} />
                            {formData.logoPreview ? t('restaurants.edit.changeLogo') : t('restaurants.edit.uploadLogo')}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                        <p className={`text-xs mt-2 ${false ? 'text-[#9CA3B5]' : 'text-gray-500'}`}>{t('restaurants.edit.imageRequirements')}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="banner" className={`block text-sm font-medium mb-2 ${
                      false ? 'text-[#BBBECC]' : 'text-[#6B7280]'
                    }`}>
                      {t('restaurants.edit.restaurantBanner')}
                    </label>
                    <div className="space-y-4">
                      {formData.bannerPreview && (
                        <div className={`w-full h-40 rounded-lg overflow-hidden border-2 ${
                          false ? 'border-[#2a2d3a]' : 'border-gray-200'
                        }`}>
                          <img
                            src={formData.bannerPreview}
                            alt="Banner preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <label className="cursor-pointer">
                        <div className={`px-4 py-2.5 rounded-lg transition inline-flex items-center ${
                          false
                            ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-[#BBBECC] hover:bg-[#1c1e27]'
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}>
                          <PhotoIcon className={`h-5 w-5 mr-2 ${false ? 'text-[#BBBECC]' : 'text-gray-500'}`} />
                          {formData.bannerPreview ? t('restaurants.edit.changeBanner') : t('restaurants.edit.uploadBanner')}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerChange}
                          className="hidden"
                        />
                      </label>
                      <p className={`text-xs ${false ? 'text-[#9CA3B5]' : 'text-gray-500'}`}>{t('restaurants.edit.bannerRequirements')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={`rounded-xl p-6 ${
                false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
              }`}>
                <h2 className={`text-xl font-semibold mb-6 flex items-center ${
                  false ? 'text-white' : 'text-[#111827]'
                }`}>
                  <EnvelopeIcon className={`h-6 w-6 mr-2 ${
                    false ? 'text-[#2BE89A]' : 'text-green-500'
                  }`} />
                  {t('restaurants.edit.contactInfo')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                      false ? 'text-[#BBBECC]' : 'text-[#6B7280]'
                    }`}>
                      {t('common.email')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className={`h-5 w-5 ${false ? 'text-[#BBBECC]' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition ${
                          false
                            ? `bg-[#0A0B0F] border ${errors.email ? 'border-red-500' : 'border-[#2a2d3a]'} text-white placeholder-[#BBBECC] focus:ring-[#2BE89A]`
                            : `bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} text-gray-900 placeholder-gray-500 focus:ring-green-500 hover:border-gray-300`
                        }`}
                        placeholder={t('restaurants.edit.emailPlaceholder')}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${
                      false ? 'text-[#BBBECC]' : 'text-[#6B7280]'
                    }`}>
                      {t('common.phone')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className={`h-5 w-5 ${false ? 'text-[#BBBECC]' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition ${
                          false
                            ? `bg-[#0A0B0F] border ${errors.phone ? 'border-red-500' : 'border-[#2a2d3a]'} text-white placeholder-[#BBBECC] focus:ring-[#2BE89A]`
                            : `bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-200'} text-gray-900 placeholder-gray-500 focus:ring-green-500 hover:border-gray-300`
                        }`}
                        placeholder="+31 20 123 4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className={`rounded-xl p-6 ${
                false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
              }`}>
                <h2 className={`text-xl font-semibold mb-6 flex items-center ${
                  false ? 'text-white' : 'text-[#111827]'
                }`}>
                  <MapPinIcon className={`h-6 w-6 mr-2 ${
                    false ? 'text-[#2BE89A]' : 'text-green-500'
                  }`} />
                  {t('restaurants.edit.addressInfo')}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="street" className={`block text-sm font-medium mb-2 ${
                      false ? 'text-[#BBBECC]' : 'text-[#6B7280]'
                    }`}>
                      {t('restaurants.edit.streetAndNumber')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      id="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition ${
                        false
                          ? `bg-[#0A0B0F] border ${errors.street ? 'border-red-500' : 'border-[#2a2d3a]'} text-white placeholder-[#BBBECC] focus:ring-[#2BE89A]`
                          : `bg-white border ${errors.street ? 'border-red-500' : 'border-gray-200'} text-gray-900 placeholder-gray-500 focus:ring-green-500 hover:border-gray-300`
                      }`}
                      placeholder="Herengracht 182"
                    />
                    {errors.street && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="postalCode" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-[#6B7280]'
                      }`}>
                        {t('restaurants.edit.postalCode')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition ${
                          false
                            ? `bg-[#0A0B0F] border ${errors.postalCode ? 'border-red-500' : 'border-[#2a2d3a]'} text-white placeholder-[#BBBECC] focus:ring-[#2BE89A]`
                            : `bg-white border ${errors.postalCode ? 'border-red-500' : 'border-gray-200'} text-gray-900 placeholder-gray-500 focus:ring-green-500 hover:border-gray-300`
                        }`}
                        placeholder="1016 BR"
                      />
                      {errors.postalCode && (
                        <p className="mt-2 text-sm text-red-500 flex items-center">
                          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                          {errors.postalCode}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="city" className={`block text-sm font-medium mb-2 ${
                        false ? 'text-[#BBBECC]' : 'text-[#6B7280]'
                      }`}>
                        {t('restaurants.edit.city')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition ${
                          false
                            ? `bg-[#0A0B0F] border ${errors.city ? 'border-red-500' : 'border-[#2a2d3a]'} text-white placeholder-[#BBBECC] focus:ring-[#2BE89A]`
                            : `bg-white border ${errors.city ? 'border-red-500' : 'border-gray-200'} text-gray-900 placeholder-gray-500 focus:ring-green-500 hover:border-gray-300`
                        }`}
                        placeholder="Amsterdam"
                      />
                      {errors.city && (
                        <p className="mt-2 text-sm text-red-500 flex items-center">
                          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className={`block text-sm font-medium mb-2 ${
                      false ? 'text-[#BBBECC]' : 'text-[#6B7280]'
                    }`}>
                      {t('restaurants.edit.country')}
                    </label>
                    <select
                      name="country"
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition ${
                        false
                          ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white focus:ring-[#2BE89A]'
                          : 'bg-white border border-gray-200 text-gray-900 focus:ring-green-500 hover:border-gray-300'
                      }`}
                    >
                      <option value="Netherlands">{t('restaurants.edit.countries.netherlands')}</option>
                      <option value="Belgium">{t('restaurants.edit.countries.belgium')}</option>
                      <option value="Germany">{t('restaurants.edit.countries.germany')}</option>
                      <option value="France">{t('restaurants.edit.countries.france')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <Link
                  href={`/restaurants/${id}`}
                  className={`px-4 py-2.5 font-medium rounded-lg transition-all ${
                    false
                      ? 'bg-[#1c1e27] border border-[#2a2d3a] text-white hover:bg-[#0A0B0F]'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('common.cancel')}
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {loading ? t('restaurants.edit.saving') : t('restaurants.edit.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default EditRestaurant
