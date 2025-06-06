import { FormData } from '../../types'

interface Step1SelfDescriptionProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onSubmit: () => Promise<boolean>
}

export const Step1SelfDescription = ({ 
  formData, 
  updateFormData, 
  onSubmit 
}: Step1SelfDescriptionProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <span className="text-2xl">👋</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Tell us about yourself</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Help us understand who you are so we can personalize your daily inspiration.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="selfDescription" className="block text-sm font-semibold text-gray-900 mb-3">
            How would you describe yourself? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="selfDescription"
            value={formData.selfDescription}
            onChange={(e) => updateFormData('selfDescription', e.target.value)}
            placeholder="e.g., I'm an entrepreneur building my first startup, a parent juggling work and family, a student pursuing my dreams..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-32 text-gray-900 placeholder-gray-500"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Share a bit about your current situation, role, or what defines you right now.
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Continue
        </button>
      </div>
    </form>
  )
} 