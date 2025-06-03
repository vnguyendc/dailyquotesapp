import { FormData } from '../../types'

interface Step7FormProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onBack: () => void
  onSubmit: () => void
}

export const Step7Form = ({ 
  formData, 
  updateFormData,
  onBack, 
  onSubmit 
}: Step7FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const toggleMoodTracking = () => {
    updateFormData('moodTracking', (!formData.moodTracking).toString())
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-4">📅</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Daily Mood Tracker Intent
        </h2>
        <p className="text-lg text-gray-600">
          Would you like to track your mood each day when receiving a quote?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center">
          <div className="flex items-center space-x-6">
            <span className={`text-lg font-medium ${!formData.moodTracking ? 'text-gray-900' : 'text-gray-500'}`}>
              No
            </span>
            
            <button
              type="button"
              onClick={toggleMoodTracking}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                formData.moodTracking ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  formData.moodTracking ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            
            <span className={`text-lg font-medium ${formData.moodTracking ? 'text-gray-900' : 'text-gray-500'}`}>
              Yes
            </span>
          </div>
        </div>

        {formData.moodTracking && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
            <p className="text-orange-800 font-medium mb-2">
              Great choice! 📈
            </p>
            <p className="text-orange-700 text-sm">
              You'll be able to track your daily mood alongside your quotes, helping you see patterns and growth over time.
            </p>
          </div>
        )}

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