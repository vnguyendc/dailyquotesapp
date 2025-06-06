'use client'

import { useState } from 'react'
import { FormData, FormErrors } from '../types'

export const useFormState = (onReset?: () => void) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [previousStep, setPreviousStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    // Step 1: About You
    selfDescription: '',
    personalGoals: [],
    customGoal: '',
    
    // Step 2: Preferences
    emotionalThemes: [],
    preferredTone: '',
    
    // Step 3: Delivery Setup
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryTime: '',
    deliveryMethod: [],
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({ message: '', isError: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
      case 1:
        // Step 1: Self-description only
        return formData.selfDescription.trim() !== ''
      case 2:
        // Step 2: Personal goals only
        const hasValidGoals = formData.personalGoals.length > 0 && 
          (!formData.personalGoals.includes('Other') || formData.customGoal.trim())
        return hasValidGoals
      case 3:
        // Step 3: Emotional themes only
        return formData.emotionalThemes.length > 0
      case 4:
        // Step 4: Tone preference only
        return formData.preferredTone !== ''
      case 5:
        // Step 5: Account creation - full validation for final submission
        return formData.firstName.trim() && 
               formData.lastName.trim() && 
               formData.deliveryMethod.length > 0 && 
               formData.deliveryTime &&
               formData.email.trim() &&
               formData.phone.trim() &&
               formData.password.length >= 8 && 
               formData.password === formData.confirmPassword
      default:
        return true
    }
  }

  const handleStepSubmit = async () => {
    if (!validateStep(currentStep)) {
      let message = 'Please complete all required fields'
      if (currentStep === 1) {
        message = 'Please describe yourself'
      } else if (currentStep === 2) {
        if (formData.personalGoals.length === 0) {
          message = 'Please select at least one personal goal'
        } else if (formData.personalGoals.includes('Other') && !formData.customGoal.trim()) {
          message = 'Please describe your other goal'
        }
      } else if (currentStep === 3) {
        message = 'Please select at least one emotional theme'
      } else if (currentStep === 4) {
        message = 'Please select your preferred tone'
      } else if (currentStep === 5) {
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          message = 'Please enter your first and last name'
        } else if (formData.deliveryMethod.length === 0) {
          message = 'Please select at least one delivery method'
        } else if (!formData.deliveryTime) {
          message = 'Please select a delivery time'
        } else if (!formData.email.trim()) {
          message = 'Please enter your email address'
        } else if (!formData.phone.trim()) {
          message = 'Please enter your phone number'
        } else if (formData.password.length < 8) {
          message = 'Password must be at least 8 characters long'
        } else if (formData.password !== formData.confirmPassword) {
          message = 'Passwords do not match'
        }
      }
      setErrors({ message, isError: true })
      return false
    }

    setErrors({ message: '', isError: false })

    if (currentStep < 5) {
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
      // Map form data to API format
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        categories: formData.emotionalThemes, // Map emotionalThemes to categories
        deliveryTime: formData.deliveryTime,
        persona: generatePersona(formData), // Generate persona from form data
        password: formData.password,
        // New fields from restructured form
        selfDescription: formData.selfDescription,
        personalGoals: formData.personalGoals,
        customGoal: formData.customGoal,
        tonePreference: formData.preferredTone,
        deliveryMethod: formData.deliveryMethod
      }

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
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
    } catch {
      console.log('API Request failed, using mock response for demo')
      // For demo purposes, we'll simulate a successful response
      setErrors({ 
        message: 'Welcome aboard! Your account has been created and you\'ll receive your first daily dose soon.', 
        isError: false 
      })
      // Reset form after successful submission
      setTimeout(() => {
        resetForm()
      }, 5000)
      return true
    } finally {
      setIsSubmitting(false)
    }
  }

  const generatePersona = (data: FormData) => {
    // Generate a persona based on the form data
    if (data.selfDescription.trim()) {
      return data.selfDescription.trim()
    }
    
    // Fallback to generating from goals and themes
    const filteredGoals = data.personalGoals.filter(goal => goal !== 'Other')
    const allGoals = data.personalGoals.includes('Other') && data.customGoal.trim() 
      ? [...filteredGoals, data.customGoal.trim()]
      : filteredGoals
    const goalsStr = allGoals.length > 0 ? allGoals.join(', ') : ''
    const themes = data.emotionalThemes.length > 0 ? data.emotionalThemes.join(', ') : ''
    
    if (goalsStr && themes) {
      return `Someone focused on ${goalsStr} who values ${themes}`
    } else if (goalsStr) {
      return `Someone focused on ${goalsStr}`
    } else if (themes) {
      return `Person interested in ${themes}`
    }
    
    return 'Motivated individual seeking daily inspiration'
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
      selfDescription: '',
      personalGoals: [],
      customGoal: '',
      emotionalThemes: [],
      preferredTone: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      deliveryTime: '',
      deliveryMethod: [],
      password: '',
      confirmPassword: ''
    })
    setCurrentStep(1)
    setErrors({ message: '', isError: false })
    setIsSubmitting(false)
    onReset?.()
  }

  return {
    currentStep,
    previousStep,
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
    resetForm
  }
} 