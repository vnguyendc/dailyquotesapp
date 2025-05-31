import { FormData } from '../types'
import { QUOTE_CATEGORIES, TIME_OPTIONS, PERSONA_OPTIONS } from '../constants/formOptions'

interface Step2FormProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  toggleCategory: (category: string) => void
  onBack: () => void
  onSubmit: () => void
}

export const Step2Form = ({ 
  formData, 
  updateFormData, 
  toggleCategory, 
  onBack, 
  onSubmit 
}: Step2FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quote Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-4">
          What types of quotes inspire you? <span className="text-gray-600">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {QUOTE_CATEGORIES.map((category) => (
            <label key={category} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 text-orange-500 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                checked={formData.categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              <span className="text-sm text-gray-900">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Persona Selection */}
      <div>
        <label htmlFor="persona" className="block text-sm font-medium text-gray-900 mb-2">
          What best describes you?
        </label>
        <select
          id="persona"
          name="persona"
          required
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900"
          value={formData.persona}
          onChange={(e) => updateFormData('persona', e.target.value)}
        >
          <option value="">Select one</option>
          {PERSONA_OPTIONS.map((persona) => (
            <option key={persona} value={persona}>
              {persona}
            </option>
          ))}
        </select>
      </div>

      {/* Delivery Time */}
      <div>
        <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-900 mb-2">
          When would you like to receive your daily quote?
        </label>
        <select
          id="deliveryTime"
          name="deliveryTime"
          required
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900"
          value={formData.deliveryTime}
          onChange={(e) => updateFormData('deliveryTime', e.target.value)}
        >
          <option value="">Select your preferred time</option>
          {TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          style={{ backgroundColor: '#0B132B' }}
          className="flex-1 py-3 px-6 hover:opacity-90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
        >
          Subscribe for Free
        </button>
      </div>
    </form>
  )
} 