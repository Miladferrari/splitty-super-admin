import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextValue {
  darkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Load theme preference from localStorage after mount
    const savedTheme = localStorage.getItem('splitty-theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('splitty-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('splitty-theme', 'light')
    }
  }

  const value: ThemeContextValue = {
    darkMode,
    toggleDarkMode
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
