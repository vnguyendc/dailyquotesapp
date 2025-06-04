import React from 'react'
import { FormErrors } from '../types'

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
}: FormContainerProps) => {
  return (
    <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 max-w-2xl w-full border border-gray-100 animate-in slide-in-from-bottom-8 fade-in duration-500">

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
  )
} 