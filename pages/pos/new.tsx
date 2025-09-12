import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  CpuChipIcon,
  UserIcon,
  KeyIcon,
  GlobeAltIcon,
  BeakerIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const NewPOSIntegration: NextPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    restaurant: '',
    posType: 'untill',
    username: '',
    password: '',
    baseUrl: '',
    environment: 'production',
    isActive: true,
  })

  const restaurants = [
    { id: 15, name: 'Loetje' },
    { id: 16, name: 'Splitty' },
    { id: 10, name: 'Restaurant Stefan' },
    { id: 11, name: 'Aldenaire catering' },
    { id: 6, name: 'Limon B.V.' },
    { id: 7, name: 'Viresh Kewalbansing' },
    { id: 17, name: 'Anatolii Restaurant' },
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
    console.log('Creating POS integration:', formData)
    router.push('/pos')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[
              { label: 'POS Integratie', href: '/pos' },
              { label: 'Nieuwe Integratie' }
            ]} />

            {/* Back Button */}
            <div className="flex items-center">
              <Link
                href="/pos"
                className="inline-flex items-center text-[#BBBECC] hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Terug naar POS Integraties
              </Link>
            </div>

            <div className="md:grid md:grid-cols-3 md:gap-8">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <CpuChipIcon className="h-8 w-8 mr-3 text-[#2BE89A]" />
                    Nieuwe POS Integratie
                  </h3>
                  <p className="mt-3 text-[#BBBECC]">
                    Configureer een nieuwe kassa integratie voor een restaurant.
                  </p>
                  <div className="mt-6 p-4 bg-[#1c1e27] rounded-lg border border-[#2a2d3a]">
                    <p className="text-sm text-[#BBBECC]">
                      <strong className="text-white">Let op:</strong> Je hebt de inloggegevens van het POS systeem nodig.
                    </p>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-[#2BE89A] mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Veilige Verbinding</h4>
                        <p className="text-xs text-[#BBBECC] mt-1">Alle gegevens worden versleuteld opgeslagen</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-[#2BE89A] mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Real-time Synchronisatie</h4>
                        <p className="text-xs text-[#BBBECC] mt-1">Direct verbonden met je kassasysteem</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-[#2BE89A] mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-white">24/7 Monitoring</h4>
                        <p className="text-xs text-[#BBBECC] mt-1">Automatische foutdetectie en meldingen</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit}>
                  <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
                    <div className="px-6 py-6 space-y-6">
                      {/* Restaurant Selection */}
                      <div>
                        <label htmlFor="restaurant" className="block text-sm font-medium text-[#BBBECC] mb-2">
                          <BuildingStorefrontIcon className="inline h-4 w-4 mr-1" />
                          Restaurant <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="restaurant"
                          name="restaurant"
                          className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
                          required
                          value={formData.restaurant}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecteer een restaurant</option>
                          {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>
                              {restaurant.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* POS Type */}
                      <div>
                        <label htmlFor="posType" className="block text-sm font-medium text-[#BBBECC] mb-2">
                          <CpuChipIcon className="inline h-4 w-4 mr-1" />
                          POS Type <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="posType"
                          name="posType"
                          className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
                          required
                          value={formData.posType}
                          onChange={handleInputChange}
                        >
                          <option value="untill">Untill</option>
                          <option value="lightspeed">Lightspeed</option>
                          <option value="epos">EPOS Now</option>
                          <option value="other">Anders</option>
                        </select>
                      </div>

                      {/* Credentials */}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-[#BBBECC] mb-2">
                            <UserIcon className="inline h-4 w-4 mr-1" />
                            Gebruikersnaam <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                            required
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="pos_gebruiker"
                          />
                        </div>

                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-[#BBBECC] mb-2">
                            <KeyIcon className="inline h-4 w-4 mr-1" />
                            Wachtwoord <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      {/* Base URL */}
                      <div>
                        <label htmlFor="baseUrl" className="block text-sm font-medium text-[#BBBECC] mb-2">
                          <GlobeAltIcon className="inline h-4 w-4 mr-1" />
                          Base URL <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="baseUrl"
                          id="baseUrl"
                          placeholder="https://jouw-untill-server.com"
                          className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                          required
                          value={formData.baseUrl}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Environment */}
                      <div>
                        <label htmlFor="environment" className="block text-sm font-medium text-[#BBBECC] mb-2">
                          <BeakerIcon className="inline h-4 w-4 mr-1" />
                          Omgeving
                        </label>
                        <select
                          id="environment"
                          name="environment"
                          className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
                          value={formData.environment}
                          onChange={handleInputChange}
                        >
                          <option value="production">Productie</option>
                          <option value="staging">Staging</option>
                          <option value="development">Ontwikkeling</option>
                          <option value="test">Test</option>
                        </select>
                      </div>

                      {/* Active Checkbox */}
                      <div className="bg-[#0A0B0F] rounded-lg p-4 border border-[#2a2d3a]">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="isActive"
                              name="isActive"
                              type="checkbox"
                              className="h-4 w-4 text-[#2BE89A] focus:ring-[#2BE89A] border-[#2a2d3a] rounded bg-[#0A0B0F]"
                              checked={formData.isActive}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="isActive" className="font-medium text-white">
                              Actief
                            </label>
                            <p className="text-sm text-[#BBBECC]">Schakel deze integratie direct in</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="px-6 py-4 bg-[#0A0B0F] border-t border-[#2a2d3a] flex justify-end space-x-3">
                      <Link
                        href="/pos"
                        className="px-6 py-3 border border-[#2a2d3a] rounded-lg text-white bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200"
                      >
                        Annuleren
                      </Link>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
                      >
                        Integratie Toevoegen
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default NewPOSIntegration
