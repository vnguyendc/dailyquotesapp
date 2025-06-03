'use client'

import { useState } from 'react'
import { FormData, FormErrors } from '../types'

export const useFormState = (onReset?: () => void) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [previousStep, setPreviousStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    // Basic information (moved to step 8)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryTime: '',
    
    // Delivery preferences (new for step 8)
    deliveryMethod: [],
    
    // Personalization fields (reordered)
    selfDescription: '',
    personalGoals: [],
    customGoal: '',
    publicFigures: '',
    personalHeroes: '',
    emotionalThemes: [],
    personalAffirmation: '',
    preferredTone: '',
    moodTracking: false,
    
    // Authentication fields (for final step)
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({ message: '', isError: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (field: keyof FormData, value: string) => {
    if (field === 'moodTracking') {
      setFormData(prev => ({ ...prev, [field]: value === 'true' }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const toggleEmotionalTheme = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      emotionalThemes: prev.emotionalThemes.includes(theme)
        ? prev.emotionalThemes.filter(t => t !== theme)
        : [...prev.emotionalThemes, theme]
    }))
  }

  const togglePersonalGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      personalGoals: prev.personalGoals.includes(goal)
        ? prev.personalGoals.filter(g => g !== goal)
        : [...prev.personalGoals, goal]
    }))
  }

  const toggleDeliveryMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: prev.deliveryMethod.includes(method)
        ? prev.deliveryMethod.filter(m => m !== method)
        : [...prev.deliveryMethod, method]
    }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 6:
        return formData.preferredTone
      case 8:
        return formData.firstName.trim() && formData.lastName.trim() && 
               formData.deliveryMethod.length > 0 && formData.deliveryTime &&
               (formData.deliveryMethod.includes('email') ? formData.email.trim() : true) &&
               (formData.deliveryMethod.includes('sms') ? formData.phone.trim() : true)
      case 9:
        return formData.password.length >= 8 && formData.password === formData.confirmPassword
      default:
        return true // Steps 1-5, 7 are optional or don't require validation
    }
  }

  const handleStepSubmit = async () => {
    if (!validateStep(currentStep)) {
      let message = 'Please complete all required fields'
      if (currentStep === 8) {
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          message = 'Please enter your first and last name'
        } else if (formData.deliveryMethod.length === 0) {
          message = 'Please select at least one delivery method'
        } else if (!formData.deliveryTime) {
          message = 'Please select a delivery time'
        } else if (formData.deliveryMethod.includes('email') && !formData.email.trim()) {
          message = 'Please enter your email address for email delivery'
        } else if (formData.deliveryMethod.includes('sms') && !formData.phone.trim()) {
          message = 'Please enter your phone number for SMS delivery'
        }
      }
      setErrors({ message, isError: true })
      return false
    }

    setErrors({ message: '', isError: false })

    if (currentStep < 9) {
      // Add step transition animation
      setIsAnimating(true)
      setPreviousStep(currentStep)
      
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 200)
      return true
    } else {
      // Final submission
      return await handleFinalSubmit()
    }
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    setErrors({ message: '', isError: false })

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setErrors({ 
          message: 'Welcome aboard! Your account has been created and you\'ll receive your first daily dose soon.', 
          isError: false 
        })
        // Reset form after successful submission
        setTimeout(() => {
          resetForm()
        }, 5000)
        return true
      } else {
        setErrors({ message: result.message || 'Something went wrong', isError: true })
        return false
      }
    } catch (error) {
      setErrors({ message: 'Network error. Please try again.', isError: true })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setIsAnimating(true)
      setPreviousStep(currentStep)
      
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setErrors({ message: '', isError: false })
        setIsAnimating(false)
      }, 200)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      deliveryTime: '',
      deliveryMethod: [],
      selfDescription: '',
      personalGoals: [],
      customGoal: '',
      publicFigures: '',
      personalHeroes: '',
      emotionalThemes: [],
      personalAffirmation: '',
      preferredTone: '',
      moodTracking: false,
      password: '',
      confirmPassword: ''
    })
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(1)
      setErrors({ message: '', isError: false })
      setIsAnimating(false)
      onReset?.() // Call the reset callback to handle hasStarted state
    }, 300)
  }

  return {
    // State
    currentStep,
    previousStep,
    isAnimating,
    formData,
    errors,
    isSubmitting,
    
    // Actions
    updateFormData,
    toggleEmotionalTheme,
    togglePersonalGoal,
    toggleDeliveryMethod,
    handleStepSubmit,
    handleBack,
    resetForm,
    setIsAnimating,
    setCurrentStep,
    setPreviousStep
  }
} 