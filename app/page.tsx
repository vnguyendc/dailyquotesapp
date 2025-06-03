'use client'

import { useState } from 'react'
import { LandingPage } from './components/LandingPage'
import { FormExperience } from './components/FormExperience'
import { useFormState } from './hooks/useFormState'

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false)
  
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
    setIsAnimating
  } = useFormState(() => setHasStarted(false))

  const handleGetStarted = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setHasStarted(true)
      setIsAnimating(false)
    }, 300)
  }

  // Landing Page
  if (!hasStarted) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  // Form Experience
  return (
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
  )
}
