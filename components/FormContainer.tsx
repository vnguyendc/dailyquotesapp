import { FormErrors } from '../types'

interface FormContainerProps {
  currentStep: number
  errors: FormErrors
  children: React.ReactNode
}

export const FormContainer = ({ currentStep, errors, children }: FormContainerProps) => {
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 max-w-xl w-full border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-cormorant font-bold text-gray-900 mb-2">
          {currentStep === 1 ? 'Get Your Daily Dose' : 'Personalize Your Experience'}
        </h2>
        <p className="text-gray-700">
          {currentStep === 1 
            ? 'Subscribe to receive inspiring quotes every morning via text message'
            : 'Choose your preferences for a personalized quote experience'
          }
        </p>
      </div>

      {children}

      {errors.message && (
        <div className={`mt-6 p-3 rounded-lg text-sm text-center ${
          errors.isError 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {errors.message}
        </div>
      )}

      {/* Trust indicators */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-600">
          ✨ Free forever • 📱 SMS delivery • 🔒 Privacy protected
        </p>
      </div>
    </div>
  )
} 