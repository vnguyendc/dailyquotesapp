import React from 'react'

interface FormContainerProps {
  children: React.ReactNode
  showBack?: boolean
  onBack?: () => void
  currentStep?: number
  totalSteps?: number
  showProgress?: boolean
}

export const FormContainer = ({ 
  children,
  currentStep = 1,
  totalSteps = 5,
  showProgress = true
}: FormContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress indicator */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-medium drop-shadow">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-white/90 font-medium drop-shadow">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 border border-gray-100 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
            {children}
          </div>

          {/* Trust indicators */}
          <div className="mt-8 text-center animate-in slide-in-from-bottom-2 fade-in duration-500 delay-500">
            <p className="text-sm text-gray-500 flex items-center justify-center space-x-4">
              <span className="flex items-center group hover:text-green-600 transition-colors duration-200">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse group-hover:bg-green-500"></span>
                Free to start
              </span>
              <span className="flex items-center group hover:text-blue-600 transition-colors duration-200">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse group-hover:bg-blue-500" style={{ animationDelay: '0.5s' }}></span>
                SMS & Email delivery
              </span>
              <span className="flex items-center group hover:text-purple-600 transition-colors duration-200">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse group-hover:bg-purple-500" style={{ animationDelay: '1s' }}></span>
                Privacy protected
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 