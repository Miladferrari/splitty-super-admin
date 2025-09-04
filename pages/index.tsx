import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Splitty</h1>
            <p className="text-sm text-gray-600">Super Admin Dashboard</p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
        
        <div className="w-full">
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-gray-700 text-sm font-medium">Loading dashboard</p>
          <p className="text-gray-500 text-xs">Please wait a moment</p>
        </div>
      </div>
    </div>
  )
}

export default Home