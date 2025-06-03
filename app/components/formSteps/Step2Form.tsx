import { FormData } from '../../types'
import { PERSONAL_GOALS } from '../../constants/formOptions'

interface Step2FormProps {
  formData: FormData
  togglePersonalGoal: (goal: string) => void
  updateFormData: (field: keyof FormData, value: string) => void
  onBack: () => void
  onSubmit: () => void
}

export const Step2Form = ({ 
  formData, 
  togglePersonalGoal,
  updateFormData,
  onBack, 
  onSubmit 
}: Step2FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-in slide-in-from-top-4 fade-in duration-500">
        <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '0.3s' }}>🎯</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          Personal Goals
        </h2>
        <p className="text-lg text-gray-600">
          What are you working toward right now?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Select all that apply to you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Goals */}
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200">
          <div className="grid grid-cols-1 gap-4 mb-6">
            {PERSONAL_GOALS.map((goal, index) => (
              <label 
                key={goal}
                className={`group flex items-start space-x-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md animate-in slide-in-from-left-4 fade-in ${
                  formData.personalGoals.includes(goal)
                    ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 shadow-sm scale-[1.02]'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={formData.personalGoals.includes(goal)}
                    onChange={() => togglePersonalGoal(goal)}
                  />
                  <div className={`w-5 h-5 border-2 rounded transition-all duration-200 mt-0.5 ${
                    formData.personalGoals.includes(goal)
                      ? 'bg-orange-500 border-orange-500'
                      : 'bg-white border-gray-300 group-hover:border-orange-300'
                  }`}>
                    {formData.personalGoals.includes(goal) && (
                      <svg className="w-3 h-3 text-white animate-in zoom-in-50 duration-200 mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Ripple effect */}
                  {formData.personalGoals.includes(goal) && (
                    <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-20"></div>
                  )}
                </div>
                <span className={`text-gray-900 font-medium leading-relaxed transition-colors duration-200 ${
                  formData.personalGoals.includes(goal) ? 'text-orange-800' : 'group-hover:text-gray-700'
                }`}>
                  {goal}
                </span>
              </label>
            ))}
          </div>

          {/* Custom Goal Input */}
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-500">
            <label htmlFor="customGoal" className="block text-sm font-medium text-gray-900 mb-2">
              Write your own goal (optional)
            </label>
            <div className="relative">
              <textarea
                id="customGoal"
                name="customGoal"
                rows={3}
                className={`w-full px-4 py-4 bg-white border-2 rounded-2xl shadow-sm transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg resize-none focus:outline-none ${
                  formData.customGoal 
                    ? 'border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200' 
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                }`}
                value={formData.customGoal}
                onChange={(e) => updateFormData('customGoal', e.target.value)}
                placeholder="E.g., Launch my own business by the end of the year..."
              />
              
              {/* Floating label effect */}
              {formData.customGoal && (
                <div className="absolute -top-2 left-3 bg-white px-2 text-xs text-orange-600 font-medium animate-in slide-in-from-bottom-2 fade-in duration-200">
                  Your custom goal
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-600">
          <button
            type="button"
            onClick={onBack}
            className="group flex-1 py-4 px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-lg"
          >
            <span className="flex items-center justify-center">
              <svg className="mr-2 w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5 5-5M18 12H6" />
              </svg>
              Back
            </span>
          </button>
          <button
            type="submit"
            className="group flex-1 py-4 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-lg relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              Continue
              <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
          </button>
        </div>
      </form>
    </div>
  )
} 