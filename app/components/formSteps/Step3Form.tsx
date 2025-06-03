import { FormData } from '../../types'

interface Step3FormProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onBack: () => void
  onSubmit: () => void
}

export const Step3Form = ({ 
  formData, 
  updateFormData,
  onBack, 
  onSubmit 
}: Step3FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-4">🌟</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          People Who Inspire You
        </h2>
        <p className="text-lg text-gray-600">
          Who inspires you?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {/* Public Figures */}
          <div>
            <label htmlFor="publicFigures" className="block text-sm font-medium text-gray-900 mb-2">
              Public figures (e.g., Michelle Obama, Kobe Bryant, Buddha)
            </label>
            <textarea
              id="publicFigures"
              name="publicFigures"
              rows={3}
              className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg resize-none"
              value={formData.publicFigures}
              onChange={(e) => updateFormData('publicFigures', e.target.value)}
              placeholder="E.g., Maya Angelou, Steve Jobs, Marcus Aurelius..."
            />
          </div>

          {/* Personal Heroes */}
          <div>
            <label htmlFor="personalHeroes" className="block text-sm font-medium text-gray-900 mb-2">
              Personal heroes (e.g., "my grandmother," "my mentor")
            </label>
            <textarea
              id="personalHeroes"
              name="personalHeroes"
              rows={3}
              className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg resize-none"
              value={formData.personalHeroes}
              onChange={(e) => updateFormData('personalHeroes', e.target.value)}
              placeholder="E.g., my mother, my high school coach, my best friend..."
            />
          </div>

          <p className="text-sm text-gray-500 text-center">
            These names can be woven into your daily quotes for more personal inspiration
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
            className="flex-1 py-4 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-lg"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
} 