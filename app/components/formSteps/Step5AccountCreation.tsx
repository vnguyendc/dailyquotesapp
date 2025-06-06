import { useState } from 'react'
import { FormData } from '../../types'

interface Step5AccountCreationProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  toggleDeliveryMethod: (method: string) => void
  onBack: () => void
  onSubmit: () => Promise<boolean>
  isSubmitting: boolean
}

export const Step5AccountCreation = ({ 
  formData, 
  updateFormData, 
  toggleDeliveryMethod, 
  onBack, 
  onSubmit,
  isSubmitting
}: Step5AccountCreationProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  const timeOptions = [
    { value: '06:00', label: '6:00 AM' },
    { value: '07:00', label: '7:00 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '21:00', label: '9:00 PM' }
  ]

  const passwordStrength = (password: string) => {
    if (password.length < 4) return { strength: 0, label: '', color: '' }
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'text-red-500' }
    if (password.length < 8) return { strength: 2, label: 'Fair', color: 'text-yellow-500' }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 4, label: 'Strong', color: 'text-green-500' }
    }
    return { strength: 3, label: 'Good', color: 'text-blue-500' }
  }

  const strength = passwordStrength(formData.password)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <span className="text-2xl">🚀</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Let&apos;s create your account</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Final step! Set up your account to start receiving your personalized daily inspiration.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
        </div>

        {/* Delivery Method */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            How would you like to receive your daily quotes? <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600 mb-3">
            We&apos;ll collect both your email and phone number for account setup, but you can choose your preferred delivery method.
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleDeliveryMethod('email')}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                formData.deliveryMethod.includes('email')
                  ? 'border-orange-500 bg-orange-50 text-orange-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📧</span>
                  <span className="font-medium">Email</span>
                </div>
                {formData.deliveryMethod.includes('email') && (
                  <span className="text-orange-500 text-lg">✓</span>
                )}
              </div>
            </button>
            <button
              type="button"
              onClick={() => toggleDeliveryMethod('sms')}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                formData.deliveryMethod.includes('sms')
                  ? 'border-orange-500 bg-orange-50 text-orange-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">💬</span>
                  <span className="font-medium">Text Message</span>
                </div>
                {formData.deliveryMethod.includes('sms') && (
                  <span className="text-orange-500 text-lg">✓</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-3">
            <strong>Contact Information</strong> - We need both for your account setup and future communications.
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
        </div>

        {/* Delivery Time */}
        <div>
          <label htmlFor="deliveryTime" className="block text-sm font-semibold text-gray-900 mb-3">
            What time would you like to receive your daily quote? <span className="text-red-500">*</span>
          </label>
          <select
            id="deliveryTime"
            value={formData.deliveryTime}
            onChange={(e) => updateFormData('deliveryTime', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            required
          >
            <option value="">Select a time</option>
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Password */}
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
              Create Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        strength.strength === 1 ? 'bg-red-500 w-1/4' :
                        strength.strength === 2 ? 'bg-yellow-500 w-2/4' :
                        strength.strength === 3 ? 'bg-blue-500 w-3/4' :
                        strength.strength === 4 ? 'bg-green-500 w-full' :
                        'bg-gray-300 w-0'
                      }`}
                    />
                  </div>
                  <span className={`text-sm font-medium ${strength.color}`}>
                    {strength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  )
} 