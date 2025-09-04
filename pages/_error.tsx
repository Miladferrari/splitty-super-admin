import { NextPageContext } from 'next'

interface ErrorProps {
  statusCode: number
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#2BE89A] mb-4">{statusCode || 'Oops'}</h1>
        <p className="text-xl text-[#BBBECC] mb-8">
          {statusCode
            ? `Er is een ${statusCode} fout opgetreden op de server`
            : 'Er is een fout opgetreden op de client'}
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
        >
          Ga terug naar home
        </a>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error