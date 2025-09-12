import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Chats: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard page
    router.replace('/dashboard')
  }, [])

  return null // Return nothing while redirecting
}
export default Chats
