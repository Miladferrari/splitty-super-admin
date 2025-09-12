import React from 'react'
import OnboardingCard from '../components/OnboardingCard'
import type { NextPage } from 'next'

const OnboardingPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingCard />
    </div>
  )
}

export default OnboardingPage