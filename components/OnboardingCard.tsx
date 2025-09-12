import React, { useEffect, useState } from 'react'
import { Language } from '../types/translations'
import {
  RocketLaunchIcon,
  UserGroupIcon,
  CreditCardIcon,
  WifiIcon,
  StarIcon,
  QrCodeIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const OnboardingCard: React.FC = () => {
  const [language, setLanguage] = useState<Language>('nl')
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'nl' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header with gradient background */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-transparent to-blue-100"></div>
              <div className="relative px-8 py-10 lg:py-12 xl:py-14 2xl:py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-full mb-4 lg:mb-5 xl:mb-6 animate-pulse">
                  <RocketLaunchIcon className="h-8 w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 text-black" />
                </div>
                <h1 className="text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 lg:mb-3 xl:mb-4">
                  {language === 'en' 
                    ? 'Welcome to Splitty Onboarding!' 
                    : 'Welkom bij Splitty Onboarding!'}
                </h1>
                <p className="text-lg lg:text-lg xl:text-xl text-gray-600 mb-0 max-w-3xl mx-auto">
                  {language === 'en'
                    ? "Let's get your restaurant ready for the future of payments"
                    : "Laten we uw restaurant klaar maken voor de toekomst van restaurant betalingen"}
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="p-8">
              {/* Feature cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                {/* Staff card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all group">
                  <UserGroupIcon className="h-10 w-10 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Staff' : 'Personeel'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? 'Configure access for the restaurant team'
                      : 'Configureer toegang voor het restaurant team'}
                  </p>
                </div>

                {/* Payments card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-green-400 transition-all group">
                  <CreditCardIcon className="h-10 w-10 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Payments' : 'Betalingen'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'en'
                      ? 'Set up Stripe for the restaurant'
                      : 'Stel Stripe in voor het restaurant'}
                  </p>
                </div>

                {/* POS System card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-400 transition-all group">
                  <WifiIcon className="h-10 w-10 text-gray-600 mb-4 group-hover:text-gray-900 transition-all" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'POS System' : 'POS Systeem'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'en'
                      ? 'Connect the POS system'
                      : 'Koppel het kassasysteem'}
                  </p>
                </div>

                {/* Reviews card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-yellow-400 transition-all group">
                  <StarIcon className="h-10 w-10 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Reviews' : 'Reviews'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'en'
                      ? 'Configure customer feedback'
                      : 'Configureer klantfeedback'}
                  </p>
                </div>

                {/* QR Stands card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all group">
                  <QrCodeIcon className="h-10 w-10 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'QR Stands' : 'QR Stands'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'en'
                      ? 'Table QR codes and layout'
                      : 'Tafel QR codes en indeling'}
                  </p>
                </div>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Time card */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <ClockIcon className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-900 font-medium">
                    {language === 'en' ? '10-15 minutes' : '10-15 minuten'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'en' ? 'Estimated time' : 'Geschatte tijd'}
                  </p>
                </div>

                {/* Auto-save card */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <ShieldCheckIcon className="h-6 w-6 text-gray-900 mx-auto mb-2" />
                  <p className="text-sm text-gray-900 font-medium">
                    {language === 'en' ? 'Auto-saved' : 'Automatisch opgeslagen'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'en' ? 'Continue later' : 'Ga later verder'}
                  </p>
                </div>

                {/* Instant active card */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <SparklesIcon className="h-6 w-6 text-gray-900 mx-auto mb-2" />
                  <p className="text-sm text-gray-900 font-medium">
                    {language === 'en' ? 'Instantly active' : 'Direct actief'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'en' ? 'After completion' : 'Na voltooiing'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom action section */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <button className="w-full px-8 py-5 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-bold rounded-xl hover:opacity-90 transition-all text-lg group disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="flex items-center justify-center">
                  {language === 'en' ? "Let's get started" : "Laten we beginnen"}
                  <ArrowRightIcon className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingCard