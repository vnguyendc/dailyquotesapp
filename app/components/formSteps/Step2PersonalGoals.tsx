import { FormData } from '../../types'

interface Step2PersonalGoalsProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  togglePersonalGoal: (goal: string) => void
  onBack: () => void
  onSubmit: () => Promise<boolean>
}

export const Step2PersonalGoals = ({ 
  formData, 
  updateFormData, 
  togglePersonalGoal,
  onBack,
  onSubmit 
}: Step2PersonalGoalsProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  const goalOptions = [
    'Building self-confidence',
    'Career growth',
    'Better relationships',
    'Mental wellness',
    'Physical health',
    'Spiritual development',
    'Financial success',
    'Personal creativity',
    'Leadership skills',
    'Work-life balance',
    'Other'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <span className="text-2xl">🎯</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">What are your main goals?</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Select the areas you&apos;re focusing on right now. This helps us choose the most relevant quotes for you.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            What are your main goals right now? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => togglePersonalGoal(goal)}
                className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                  formData.personalGoals.includes(goal)
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{goal}</span>
                  {formData.personalGoals.includes(goal) && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          {formData.personalGoals.length > 0 && (
            <p className="text-sm text-gray-600 mt-3">
              {formData.personalGoals.length} goal{formData.personalGoals.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {formData.personalGoals.includes('Other') && (
          <div>
            <label htmlFor="customGoal" className="block text-sm font-semibold text-gray-900 mb-3">
              Tell us about your other goal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customGoal"
              value={formData.customGoal}
              onChange={(e) => updateFormData('customGoal', e.target.value)}
              placeholder="Describe your specific goal..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>
        )}
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
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Continue
        </button>
      </div>
    </form>
  )
} 