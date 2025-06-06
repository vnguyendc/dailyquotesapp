import { FormData } from '../../types'

interface Step3EmotionalThemesProps {
  formData: FormData
  toggleEmotionalTheme: (theme: string) => void
  onBack: () => void
  onSubmit: () => Promise<boolean>
}

export const Step3EmotionalThemes = ({ 
  formData, 
  toggleEmotionalTheme,
  onBack,
  onSubmit 
}: Step3EmotionalThemesProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  const emotionalThemes = [
    'Motivation & Drive',
    'Self-Love & Acceptance',
    'Resilience & Strength',
    'Gratitude & Appreciation',
    'Mindfulness & Presence',
    'Courage & Bravery',
    'Growth & Learning',
    'Success & Achievement',
    'Peace & Calm',
    'Joy & Happiness',
    'Wisdom & Insight',
    'Hope & Optimism'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <span className="text-2xl">💭</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">What themes resonate with you?</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Choose the emotional themes that speak to your heart. We&apos;ll focus your quotes around these areas.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            What themes would you like your quotes to focus on? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {emotionalThemes.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => toggleEmotionalTheme(theme)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  formData.emotionalThemes.includes(theme)
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{theme}</span>
                  {formData.emotionalThemes.includes(theme) && (
                    <span className="text-purple-500 text-lg">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          {formData.emotionalThemes.length > 0 && (
            <p className="text-sm text-gray-600 mt-3">
              {formData.emotionalThemes.length} theme{formData.emotionalThemes.length !== 1 ? 's' : ''} selected
            </p>
          )}
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
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Continue
        </button>
      </div>
    </form>
  )
} 