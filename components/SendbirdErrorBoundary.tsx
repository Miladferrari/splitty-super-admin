import React, { ReactNode, Component, ErrorInfo } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface SendbirdErrorBoundaryProps {
  children: ReactNode
}

interface SendbirdErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class SendbirdErrorBoundary extends Component<SendbirdErrorBoundaryProps, SendbirdErrorBoundaryState> {
  constructor(props: SendbirdErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): SendbirdErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('SendBird Error:', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chat service tijdelijk niet beschikbaar
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Er is een probleem met de chat verbinding. Probeer het later opnieuw.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Opnieuw proberen
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default SendbirdErrorBoundary