import { FormData } from '../../types'
import { TONE_OPTIONS } from '../../constants/formOptions'

interface Step6FormProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onBack: () => void
  onSubmit: () => void
}

export const Step6Form = ({ 
  formData, 
  updateFormData,
  onBack, 
  onSubmit 
}: Step6FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-4">🧠</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Preferred Tone of Messaging
        </h2>
        <p className="text-lg text-gray-600">
          What tone do you connect with most?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <div className="grid grid-cols-1 gap-4">
            {TONE_OPTIONS.map((tone) => (
              <label 
                key={tone} 
                className={`flex items-center space-x-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.preferredTone === tone
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="preferredTone"
                  value={tone}
                  className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500 focus:ring-2"
                  checked={formData.preferredTone === tone}
                  onChange={(e) => updateFormData('preferredTone', e.target.value)}
                />
                <span className="text-gray-900 font-medium">{tone}</span>
              </label>
            ))}
          </div>
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
            className="flex-1 py-4 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-lg"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
} 