import { FormErrors } from '../types'

interface FormContainerProps {
  currentStep: number
  errors: FormErrors
  children: React.ReactNode
}

export const FormContainer = ({ currentStep, errors, children }: FormContainerProps) => {
  return (
    <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 max-w-2xl w-full border border-gray-100 animate-in slide-in-from-bottom-8 fade-in duration-500">

      <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
        {children}
      </div>

      {errors.message && (
        <div className={`mt-6 p-4 rounded-2xl text-center transition-all duration-300 animate-in slide-in-from-bottom-4 ${
          errors.isError 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {!errors.isError && <div className="text-3xl mb-2 animate-bounce">🎉</div>}
          <p className="font-medium">{errors.message}</p>
        </div>
      )}

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