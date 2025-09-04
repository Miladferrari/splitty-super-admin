import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Custom404: NextPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-12">
            <Image
              src="/favicon-splitty.png"
              alt="Splitty"
              width={60}
              height={60}
              className="mx-auto"
            />
          </div>

          {/* 404 Message */}
          <div className="mb-10">
            <h1 className="text-9xl font-extralight text-gray-300 mb-2">404</h1>
            <p className="text-gray-600 text-lg">Pagina niet gevonden</p>
          </div>

          {/* Message */}
          <p className="text-gray-500 mb-10">
            De pagina die je zoekt bestaat niet
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ga Terug
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              Naar Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Custom404