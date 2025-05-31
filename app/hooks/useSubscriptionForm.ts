'use client'

import { useState } from 'react'
import { FormData, FormErrors, ApiResponse } from '../types'

export const useSubscriptionForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    categories: [],
    deliveryTime: '',
    persona: ''
  })
  const [errors, setErrors] = useState<FormErrors>({
    message: '',
    isError: false
  })

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const validateStep1 = (): boolean => {
    if (!formData.firstName.trim()) {
      setErrors({ message: 'Please enter your first name.', isError: true })
      return false
    }

    if (!formData.lastName.trim()) {
      setErrors({ message: 'Please enter your last name.', isError: true })
      return false
    }

    if (formData.email.trim() && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrors({ message: 'Please enter a valid email address.', isError: true })
      return false
    }

    if (!formData.phone.match(/^\+?[1-9]\d{1,14}$/)) {
      setErrors({ message: 'Please enter a valid phone number.', isError: true })
      return false
    }

    return true
  }

  const validateStep2 = (): boolean => {
    if (formData.categories.length === 0) {
      setErrors({ message: 'Please select at least one quote category.', isError: true })
      return false
    }

    if (!formData.deliveryTime) {
      setErrors({ message: 'Please select your preferred delivery time.', isError: true })
      return false
    }

    if (!formData.persona) {
      setErrors({ message: 'Please select your persona type.', isError: true })
      return false
    }

    return true
  }

  const clearErrors = () => {
    setErrors({ message: '', isError: false })
  }

  const submitForm = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email.trim() || null,
          phone: formData.phone,
          categories: formData.categories,
          deliveryTime: formData.deliveryTime,
          persona: formData.persona
        }),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        setErrors({ message: data.message, isError: false })
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          categories: [],
          deliveryTime: '',
          persona: ''
        })
        setCurrentStep(1)
        return true
      } else {
        setErrors({ message: data.message || 'Something went wrong.', isError: true })
        return false
      }
    } catch {
      setErrors({ message: 'An error occurred. Please try again.', isError: true })
      return false
    }
  }

  const nextStep = () => {
    clearErrors()
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  const handleFinalSubmit = () => {
    clearErrors()
    if (validateStep2()) {
      submitForm()
    }
  }

  return {
    currentStep,
    formData,
    errors,
    updateFormData,
    toggleCategory,
    nextStep,
    prevStep,
    handleFinalSubmit,
    clearErrors
  }
} 