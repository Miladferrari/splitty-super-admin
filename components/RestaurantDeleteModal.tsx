import React, { useState, ChangeEvent } from 'react'
import {
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Restaurant, OnboardingData } from '../types'

interface FormData {
  restaurantName: string
  ownerTalked: boolean
  qrReturned: boolean
  paymentsSettled: boolean
}

interface RestaurantDeleteModalProps {
  restaurant: Restaurant
  onClose: () => void
  onConfirm: () => void
}

const RestaurantDeleteModal: React.FC<RestaurantDeleteModalProps> = ({ 
  restaurant, 
  onClose, 
  onConfirm 
}) => {
  const [step, setStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>({
    restaurantName: '',
    ownerTalked: false,
    qrReturned: false,
    paymentsSettled: false,
  })
  
  // Check if restaurant is not fully onboarded (show simple delete for any non-onboarded restaurant)
  const isNotOnboarded = !restaurant.isOnboarded
  
  // Check if onboarding has started
  let hasStartedOnboarding = false
  if (isNotOnboarded && typeof window !== 'undefined') {
    const savedData = localStorage.getItem(`onboarding_${restaurant.id}`)
    if (savedData) {
      try {
        const parsed: OnboardingData = JSON.parse(savedData)
        hasStartedOnboarding = (parsed.currentStep && parsed.currentStep > 1) || 
                              ((parsed as any).staff && (parsed as any).staff.length > 0)
      } catch (e) {
        // Invalid JSON, keep hasStartedOnboarding as false
      }
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return formData.restaurantName.toLowerCase() === restaurant.name.toLowerCase()
      case 2:
        return formData.ownerTalked
      case 3:
        return formData.qrReturned
      case 4:
        return formData.paymentsSettled
      default:
        return false
    }
  }

  const handleNext = (): void => {
    if (isStepValid()) {
      if (step < 4) {
        setStep(step + 1)
      } else {
        // All verifications complete, proceed with deletion
        onConfirm()
      }
    }
  }

  const handlePrevious = (): void => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const renderStepContent = (): React.ReactElement | null => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Bevestig Restaurant</h4>
              <p className="text-sm text-gray-600">
                Type de naam van het restaurant om door te gaan.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Te verwijderen restaurant:</p>
              <p className="text-base font-medium text-gray-900">{restaurant.name}</p>
            </div>
            
            <div>
              <input
                type="text"
                name="restaurantName"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={`Type "${restaurant.name}"`}
                value={formData.restaurantName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Contact met Eigenaar</h4>
              <p className="text-sm text-gray-600">
                Bevestig contact met de restaurant eigenaar.
              </p>
            </div>
            
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <p className="text-orange-400 text-sm font-medium mb-1">Belangrijk</p>
              <p className="text-xs text-gray-600">
                De eigenaar moet op de hoogte zijn van het beëindigen van de diensten.
              </p>
            </div>
            
            <label className="flex items-start bg-gray-50 rounded-lg p-3 cursor-pointer border border-gray-200 hover:border-green-300 transition">
              <input
                type="checkbox"
                name="ownerTalked"
                className="h-4 w-4 text-green-600 mt-0.5 focus:ring-green-500 border-gray-200 rounded bg-gray-50"
                checked={formData.ownerTalked}
                onChange={handleInputChange}
              />
              <div className="ml-2.5">
                <span className="text-sm text-gray-900 font-medium">Eigenaar is geïnformeerd</span>
                <p className="text-xs text-gray-600 mt-0.5">
                  Ik heb contact gehad met de eigenaar/manager
                </p>
              </div>
            </label>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">QR Code Materialen</h4>
              <p className="text-sm text-gray-600">
                Bevestig terugontvangst van alle materialen.
              </p>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-400 text-sm font-medium mb-1">QR Materialen</p>
              <p className="text-xs text-gray-600">
                QR houders, stickers en andere materialen moeten retour.
              </p>
            </div>
            
            <label className="flex items-start bg-gray-50 rounded-lg p-3 cursor-pointer border border-gray-200 hover:border-green-300 transition">
              <input
                type="checkbox"
                name="qrReturned"
                className="h-4 w-4 text-green-600 mt-0.5 focus:ring-green-500 border-gray-200 rounded bg-gray-50"
                checked={formData.qrReturned}
                onChange={handleInputChange}
              />
              <div className="ml-2.5">
                <span className="text-sm text-gray-900 font-medium">Materialen terugontvangen</span>
                <p className="text-xs text-gray-600 mt-0.5">
                  Alle QR materialen zijn retour
                </p>
              </div>
            </label>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Financiële Afhandeling</h4>
              <p className="text-sm text-gray-600">
                Bevestig afhandeling van alle betalingen.
              </p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-400 text-sm font-medium mb-1">Checklist</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                <li>• Stripe uitbetalingen verwerkt</li>
                <li>• Geen openstaande facturen</li>
                <li>• Transacties afgerond</li>
              </ul>
            </div>
            
            <label className="flex items-start bg-gray-50 rounded-lg p-3 cursor-pointer border border-gray-200 hover:border-green-300 transition">
              <input
                type="checkbox"
                name="paymentsSettled"
                className="h-4 w-4 text-green-600 mt-0.5 focus:ring-green-500 border-gray-200 rounded bg-gray-50"
                checked={formData.paymentsSettled}
                onChange={handleInputChange}
              />
              <div className="ml-2.5">
                <span className="text-sm text-gray-900 font-medium">Financiën afgehandeld</span>
                <p className="text-xs text-gray-600 mt-0.5">
                  Alle betalingen zijn verwerkt
                </p>
              </div>
            </label>
          </div>
        )
      
      default:
        return null
    }
  }

  // Simple delete modal for non-onboarded restaurants
  if (isNotOnboarded) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3">Restaurant Verwijderen</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-white transition"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-medium mb-1">Weet je het zeker?</p>
            <p className="text-sm text-gray-600">
              Je staat op het punt om <span className="font-semibold text-gray-900">{restaurant.name}</span> {hasStartedOnboarding ? 'te archiveren' : 'permanent te verwijderen'}.
            </p>
            {hasStartedOnboarding && (
              <p className="text-xs text-gray-600 mt-2">
                Dit restaurant heeft al onboarding stappen voltooid en wordt gearchiveerd in plaats van permanent verwijderd.
              </p>
            )}
          </div>

          {/* Name confirmation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Type de restaurant naam ter bevestiging
            </label>
            <input
              type="text"
              name="restaurantName"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                formData.restaurantName && formData.restaurantName.toLowerCase() !== restaurant.name.toLowerCase()
                  ? 'border-red-500'
                  : 'border-gray-200'
              }`}
              placeholder={restaurant.name}
              value={formData.restaurantName}
              onChange={handleInputChange}
            />
            {formData.restaurantName && formData.restaurantName.toLowerCase() !== restaurant.name.toLowerCase() && (
              <p className="mt-2 text-sm text-red-400">
                De naam komt niet overeen. Type exact: "{restaurant.name}"
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-50 border border-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Annuleren
            </button>
            <button
              onClick={onConfirm}
              disabled={formData.restaurantName.toLowerCase() !== restaurant.name.toLowerCase()}
              className="flex-1 px-6 py-3 bg-red-500 text-gray-900 font-medium rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasStartedOnboarding ? 'Archiveren' : 'Verwijderen'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Full delete modal for onboarded restaurants
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 ml-3">Restaurant Verwijderen</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-white transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((i, index) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      i < step
                        ? 'bg-green-500 text-black'
                        : i === step
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {i < step ? <CheckCircleIcon className="h-5 w-5" /> : i}
                  </div>
                  <span className={`text-xs mt-2 transition-colors ${
                    i <= step ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {['Naam', 'Contact', 'QR', 'Financieel'][index]}
                  </span>
                </div>
                {i < 4 && (
                  <div className={`flex-1 h-0.5 mx-2 -mt-5 transition-all ${
                    i < step ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Only show warning on first step */}
        {step === 1 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-yellow-400 font-medium mb-1">Let op!</p>
                <p className="text-sm text-gray-600">
                  Dit restaurant wordt gearchiveerd. Je kunt het later permanent verwijderen vanuit het archief.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-6">
          {renderStepContent()}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Vorige
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex-1 px-4 py-2.5 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              step === 4
                ? 'bg-red-500 text-gray-900 hover:bg-red-600'
                : 'bg-green-500 text-black hover:bg-green-600'
            }`}
          >
            {step === 4 ? 'Verwijderen' : 'Volgende'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDeleteModal