import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../utils/fetchInterceptor'
import { UsersProvider } from '../contexts/UsersContext'
import { RestaurantsProvider } from '../contexts/RestaurantsContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { TranslationProvider } from '../contexts/TranslationContext'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingScreen from '../components/LoadingScreen'
import { useRouteLoading } from '../hooks/useRouteLoading'

function MyApp({ Component, pageProps }: AppProps) {
  const isLoading = useRouteLoading()

  return (
    <ErrorBoundary>
      <TranslationProvider>
        <ThemeProvider>
          <RestaurantsProvider>
            <UsersProvider>
              {isLoading ? <LoadingScreen /> : <Component {...pageProps} />}
            </UsersProvider>
          </RestaurantsProvider>
        </ThemeProvider>
      </TranslationProvider>
    </ErrorBoundary>
  )
}

export default MyApp