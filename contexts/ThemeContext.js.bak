import { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }) {
  // Always use light mode - dark mode will be implemented later
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('dark')
      document.body.classList.add('light')
    }
  }, [])

  // Always return light mode values
  const themeValue = {
    darkMode: false,
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  )
}