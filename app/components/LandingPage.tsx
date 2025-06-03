import { useState, useEffect } from 'react'
import { SunIcon } from './SunIcon'

interface LandingPageProps {
  onGetStarted: () => void
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleGetStarted = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onGetStarted()
    }, 300)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-8 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      <div className="max-w-lg mx-auto text-center">
        {/* Logo and branding */}
        <div className={`mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <div className="flex items-center justify-center mb-6">
            <SunIcon />
            <div className="ml-4 text-left">
              <div className="text-3xl font-bold text-gray-900 leading-tight">
                your daily
              </div>
              <div className="text-3xl font-bold text-gray-900 leading-tight">
                dose <span className="text-sm font-normal bg-orange-100 text-orange-700 px-2 py-1 rounded ml-1 animate-bounce">AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main heading */}
        <div className={`mb-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            Get your daily dose of inspiration
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
            Receive AI-personalized quotes and reflections each day to inspire and motivate you.
          </p>
        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <button
            onClick={handleGetStarted}
            className="group px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-lg relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Get Started
              <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
          </button>
        </div>

        {/* Footer text */}
        <div className={`transition-all duration-700 delay-800 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <p className="text-gray-400 text-sm mt-6 flex items-center justify-center space-x-4">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Free to start
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" style={{ animationDelay: '0.5s' }}></span>
              No spam
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse" style={{ animationDelay: '1s' }}></span>
              Unsubscribe anytime
            </span>
          </p>
        </div>
      </div>
    </div>
  )
} 