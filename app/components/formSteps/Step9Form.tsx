import { FormData } from '../../types'

interface Step9FormProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onBack: () => void
  onSubmit: () => void
}

export const Step9Form = ({ 
  formData, 
  updateFormData,
  onBack, 
  onSubmit 
}: Step9FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const passwordsMatch = formData.password === formData.confirmPassword
  const isPasswordValid = formData.password.length >= 8
  const canSubmit = isPasswordValid && passwordsMatch && formData.password && formData.confirmPassword

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Create Your Account
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          You&rsquo;re almost done! Create a secure password to protect your account.
        </p>
        <p className="text-sm text-gray-500">
          You&rsquo;ll be able to log in and view all your received quotes and journal entries.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Summary */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Account Summary</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
            <p><span className="font-medium">Email:</span> {formData.email || 'Not provided'}</p>
            <p><span className="font-medium">Phone:</span> {formData.phone || 'Not provided'}</p>
            <p><span className="font-medium">Delivery:</span> {formData.deliveryMethod.join(', ')} at {formData.deliveryTime}</p>
          </div>
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 text-lg"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              placeholder="Create a secure password"
            />
            {formData.password && !isPasswordValid && (
              <p className="mt-1 text-sm text-red-600">Password must be at least 8 characters long</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 text-lg"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
            />
            {formData.confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
            )}
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-800">
            By creating an account, you agree to our Terms of Service and Privacy Policy. 
            Your personal information will be used to personalize your daily quotes and is never shared with third parties.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-lg"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`flex-1 py-4 px-8 font-semibold rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg ${
              canSubmit 
                ? 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-xl transform hover:scale-105 focus:ring-orange-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Account & Start Daily Dose ✨
          </button>
        </div>
      </form>
    </div>
  )
} 