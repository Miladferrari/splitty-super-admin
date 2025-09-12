import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Language } from '../types/translations'

const LoadingScreen: React.FC = () => {
  const [language, setLanguage] = useState<Language>('nl')
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'nl' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])
  return (
    <div className="min-h-screen bg-white">
      <div className="splash flex flex-col min-h-screen max-w-[500px] mx-auto w-full">
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm space-y-8">
            <div className="flex justify-center">
              <Image
                src="/logo-trans.webp"
                alt="Splitty"
                width={120}
                height={42}
                className="opacity-80"
              />
            </div>
            <div className="flex justify-center">
              <div className="spinner w-10 h-10 border-[3px] border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
            <div className="w-full">
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="progress-bar h-full w-1/3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full animate-progress"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-gray-700 text-sm font-medium">
                {language === 'en' ? 'Your admin panel is loading' : 'Je admin panel wordt geladen'}
              </p>
              <p className="text-gray-500 text-xs">
                {language === 'en' ? 'Please wait a moment' : 'Even geduld alsjeblieft'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LoadingScreen