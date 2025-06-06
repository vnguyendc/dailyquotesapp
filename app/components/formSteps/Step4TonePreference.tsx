import { FormData } from '../../types'

interface Step4TonePreferenceProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onBack: () => void
  onSubmit: () => Promise<boolean>
}

export const Step4TonePreference = ({ 
  formData, 
  updateFormData,
  onBack,
  onSubmit 
}: Step4TonePreferenceProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  const toneOptions = [
    { value: 'inspirational', label: 'Inspirational & Uplifting', description: 'Energizing messages that spark motivation' },
    { value: 'gentle', label: 'Gentle & Nurturing', description: 'Soft, caring reminders and encouragement' },
    { value: 'bold', label: 'Bold & Direct', description: 'Straight-talking, no-nonsense motivation' },
    { value: 'wise', label: 'Wise & Thoughtful', description: 'Deep insights and philosophical guidance' },
    { value: 'playful', label: 'Playful & Light', description: 'Fun, creative, and lighthearted approach' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <span className="text-2xl">🎨</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Choose your tone</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          How would you like your daily quotes to be delivered? Pick the style that feels right for you.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            What tone would you prefer for your daily quotes? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {toneOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData('preferredTone', option.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  formData.preferredTone === option.value
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-base">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </div>
                  {formData.preferredTone === option.value && (
                    <span className="text-green-500 text-xl">●</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Continue
        </button>
      </div>
    </form>
  )
} 