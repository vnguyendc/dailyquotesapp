import { FormContainer } from './FormContainer'
import { Step1Form } from './formSteps/Step1Form'
import { Step2Form } from './formSteps/Step2Form'
import { Step3Form } from './formSteps/Step3Form'
import { Step4Form } from './formSteps/Step4Form'
import { Step5Form } from './formSteps/Step5Form'
import { Step6Form } from './formSteps/Step6Form'
import { Step7Form } from './formSteps/Step7Form'
import { Step8Form } from './formSteps/Step8Form'
import { Step9Form } from './formSteps/Step9Form'
import { FormData, FormErrors } from '../types'

interface FormExperienceProps {
  currentStep: number
  isAnimating: boolean
  formData: FormData
  errors: FormErrors
  isSubmitting: boolean
  updateFormData: (field: keyof FormData, value: string) => void
  toggleEmotionalTheme: (theme: string) => void
  togglePersonalGoal: (goal: string) => void
  toggleDeliveryMethod: (method: string) => void
  handleStepSubmit: () => Promise<boolean>
  handleBack: () => void
}

export const FormExperience = ({
  currentStep,
  isAnimating,
  formData,
  errors,
  isSubmitting,
  updateFormData,
  toggleEmotionalTheme,
  togglePersonalGoal,
  toggleDeliveryMethod,
  handleStepSubmit,
  handleBack
}: FormExperienceProps) => {
  
  const renderCurrentStep = () => {
    const stepComponents = {
      1: <Step1Form formData={formData} updateFormData={updateFormData} onSubmit={handleStepSubmit} />,
      2: <Step2Form formData={formData} togglePersonalGoal={togglePersonalGoal} updateFormData={updateFormData} onBack={handleBack} onSubmit={handleStepSubmit} />,
      3: <Step3Form formData={formData} updateFormData={updateFormData} onBack={handleBack} onSubmit={handleStepSubmit} />,
      4: <Step4Form formData={formData} toggleEmotionalTheme={toggleEmotionalTheme} onBack={handleBack} onSubmit={handleStepSubmit} />,
      5: <Step5Form formData={formData} updateFormData={updateFormData} onBack={handleBack} onSubmit={handleStepSubmit} />,
      6: <Step6Form formData={formData} updateFormData={updateFormData} onBack={handleBack} onSubmit={handleStepSubmit} />,
      7: <Step7Form formData={formData} updateFormData={updateFormData} onBack={handleBack} onSubmit={handleStepSubmit} />,
      8: <Step8Form formData={formData} updateFormData={updateFormData} toggleDeliveryMethod={toggleDeliveryMethod} onBack={handleBack} onSubmit={handleStepSubmit} />,
      9: <Step9Form formData={formData} updateFormData={updateFormData} onBack={handleBack} onSubmit={handleStepSubmit} />
    }

    return (
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
        {stepComponents[currentStep as keyof typeof stepComponents]}
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-100 via-orange-100 to-yellow-100 flex items-center justify-center px-4 py-8 transition-all duration-500 ${isAnimating ? 'opacity-90' : 'opacity-100'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className={`mb-8 transition-all duration-500 ${isAnimating ? 'opacity-50 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 font-medium">Step {currentStep} of 9</span>
            <span className="text-sm text-gray-500 font-medium">{Math.round((currentStep / 9) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${(currentStep / 9) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        {currentStep === 1 ? (
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
            <FormContainer currentStep={currentStep}>
              {renderCurrentStep()}
            </FormContainer>
          </div>
        ) : (
          <div className={`bg-white shadow-xl rounded-3xl p-8 md:p-10 max-w-2xl w-full border border-gray-100 transition-all duration-500 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
            {renderCurrentStep()}
            
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
          </div>
        )}

        {/* Loading state */}
        {isSubmitting && (
          <div className="text-center mt-4 animate-in slide-in-from-bottom-4">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-2xl shadow-lg border border-gray-100">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700 font-medium">Creating your personalized experience...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 