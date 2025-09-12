import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, TranslationKeys, TranslationFunction } from '../types/translations'

// Import translations
import nlTranslations from '../locales/nl.json'
import enTranslations from '../locales/en.json'

interface TranslationContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationFunction
  translations: TranslationKeys
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined)

const translations: Record<Language, TranslationKeys> = {
  nl: nlTranslations as TranslationKeys,
  en: enTranslations as TranslationKeys
}

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('nl')

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'nl' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Save language preference when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  // Translation function with nested key support
  const t: TranslationFunction = (key: string, params?: Record<string, any>) => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key // Return the key as fallback
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`)
      return key
    }
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(`{{${paramKey}}}`, String(paramValue))
      })
    }
    
    return value
  }

  const value: TranslationContextValue = {
    language,
    setLanguage,
    t,
    translations: translations[language]
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

// Custom hook for using translations
export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}