import { FormContainer } from './FormContainer'
import { Step1SelfDescription } from './formSteps/Step1SelfDescription'
import { Step2PersonalGoals } from './formSteps/Step2PersonalGoals'
import { Step3EmotionalThemes } from './formSteps/Step3EmotionalThemes'
import { Step4TonePreference } from './formSteps/Step4TonePreference'
import { Step5AccountCreation } from './formSteps/Step5AccountCreation'
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
      1: <Step1SelfDescription 
           formData={formData} 
           updateFormData={updateFormData} 
           onSubmit={handleStepSubmit} 
         />,
      2: <Step2PersonalGoals 
           formData={formData} 
           updateFormData={updateFormData}
           togglePersonalGoal={togglePersonalGoal}
           onBack={handleBack} 
           onSubmit={handleStepSubmit} 
         />,
      3: <Step3EmotionalThemes 
           formData={formData} 
           toggleEmotionalTheme={toggleEmotionalTheme}
           onBack={handleBack} 
           onSubmit={handleStepSubmit} 
         />,
      4: <Step4TonePreference 
           formData={formData} 
           updateFormData={updateFormData}
           onBack={handleBack} 
           onSubmit={handleStepSubmit} 
         />,
      5: <Step5AccountCreation 
           formData={formData} 
           updateFormData={updateFormData} 
           toggleDeliveryMethod={toggleDeliveryMethod} 
           onBack={handleBack} 
           onSubmit={handleStepSubmit}
           isSubmitting={isSubmitting}
         />
    }

    return (
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
        {stepComponents[currentStep as keyof typeof stepComponents]}
      </div>
    )
  }

  return (
    <FormContainer 
      currentStep={currentStep} 
      totalSteps={5}
      showProgress={true}
      showBack={currentStep > 1} 
      onBack={handleBack}
    >
      {renderCurrentStep()}
      
      {/* Error/Success Messages */}
      {errors.message && (
        <div className={`mt-6 p-4 rounded-xl text-center ${
          errors.isError 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-green-50 text-green-800 border border-green-200'
        }`}>
          {errors.message}
        </div>
      )}
    </FormContainer>
  )
} 