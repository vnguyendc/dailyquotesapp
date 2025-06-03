import { FormData } from '../../types'

interface Step1FormProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onSubmit: () => void
}

export const Step1Form = ({ 
  formData, 
  updateFormData,
  onSubmit 
}: Step1FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const charCount = formData.selfDescription.length
  const maxChars = 500

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-in slide-in-from-top-4 fade-in duration-500">
        <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '0.5s' }}>🧭</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          Describe Yourself in a Sentence
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Tell us who you are, in your own words.
        </p>
        <p className="text-sm text-gray-500">
          This helps us create more human and relevant messages for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200">
          <label htmlFor="selfDescription" className="block text-sm font-medium text-gray-900 mb-2">
            Your self-description (optional)
          </label>
          <div className="relative">
            <textarea
              id="selfDescription"
              name="selfDescription"
              rows={4}
              maxLength={maxChars}
              className={`w-full px-4 py-4 bg-white border-2 rounded-2xl shadow-sm transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg resize-none focus:outline-none ${
                formData.selfDescription 
                  ? 'border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200' 
                  : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
              }`}
              value={formData.selfDescription}
              onChange={(e) => updateFormData('selfDescription', e.target.value)}
              placeholder="E.g., 'I'm a 26-year-old entrepreneur trying to stay grounded while chasing big goals' or 'I'm a working mom looking for daily motivation to balance everything'..."
            />
            
            {/* Character counter */}
            <div className={`absolute bottom-2 right-2 text-xs transition-all duration-200 ${
              charCount > maxChars * 0.8 
                ? charCount >= maxChars 
                  ? 'text-red-500 font-medium' 
                  : 'text-orange-500 font-medium'
                : 'text-gray-400'
            }`}>
              <span className={`transition-all duration-200 ${charCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                {charCount}/{maxChars}
              </span>
            </div>

            {/* Floating label effect */}
            {formData.selfDescription && (
              <div className="absolute -top-2 left-3 bg-white px-2 text-xs text-orange-600 font-medium animate-in slide-in-from-bottom-2 fade-in duration-200">
                Your story
              </div>
            )}
          </div>
          
          {/* Helpful hint */}
          <div className={`mt-2 text-xs text-gray-500 transition-all duration-300 ${
            formData.selfDescription.length > 20 ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className="flex items-center">
              <span className="w-1 h-1 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Great! This will help us personalize your quotes perfectly.
            </span>
          </div>
        </div>

        <div className="flex justify-center pt-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-400">
          <button
            type="submit"
            className="group px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-lg relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
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