import { FormData } from '../../types'
import { DELIVERY_TIMES } from '../../constants/formOptions'

interface Step8FormProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  toggleDeliveryMethod: (method: string) => void
  onBack: () => void
  onSubmit: () => void
}

export const Step8Form = ({ 
  formData, 
  updateFormData,
  toggleDeliveryMethod,
  onBack, 
  onSubmit 
}: Step8FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Basic Information & Delivery
        </h2>
        <p className="text-lg text-gray-600">
          Let's get your contact details and delivery preferences set up
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Delivery Methods */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            How would you like to receive your daily quotes? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DELIVERY_TIMES.map((method) => (
              <label 
                key={method.value} 
                className={`flex items-center space-x-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.deliveryMethod.includes(method.value)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-orange-500 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  checked={formData.deliveryMethod.includes(method.value)}
                  onChange={() => toggleDeliveryMethod(method.value)}
                />
                <span className="text-2xl">{method.icon}</span>
                <span className="text-gray-900 font-medium">{method.label}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            You can select both if you'd like quotes delivered via both methods
          </p>
        </div>

        {/* Delivery Time */}
        <div>
          <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-900 mb-2">
            When would you like to receive your daily quote? *
          </label>
          <select
            id="deliveryTime"
            name="deliveryTime"
            required
            className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 text-lg"
            value={formData.deliveryTime}
            onChange={(e) => updateFormData('deliveryTime', e.target.value)}
          >
            <option value="">Select your preferred time</option>
            {DELIVERY_TIMES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            Create Your Account
          </button>
        </div>
      </form>
    </div>
  )
} 