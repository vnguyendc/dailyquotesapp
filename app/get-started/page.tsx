'use client'

import { FormExperience } from '../components/FormExperience'
import { useFormState } from '../hooks/useFormState'
import { useRouter } from 'next/navigation'

export default function GetStartedPage() {
  const router = useRouter()
  
  const {
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
    handleBack,
  } = useFormState(() => router.push('/'))

  return (
    <div 
      className="min-h-screen relative -mt-20 pt-20"
      style={{
        backgroundImage: 'url(/simon-berger-twukN12EN7c-unsplash.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
      
      {/* Form Content */}
      <div className="relative z-10">
        <FormExperience
          currentStep={currentStep}
          isAnimating={isAnimating}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          updateFormData={updateFormData}
          toggleEmotionalTheme={toggleEmotionalTheme}
          togglePersonalGoal={togglePersonalGoal}
          toggleDeliveryMethod={toggleDeliveryMethod}
          handleStepSubmit={handleStepSubmit}
          handleBack={handleBack}
        />
      </div>
    </div>
  )
} 