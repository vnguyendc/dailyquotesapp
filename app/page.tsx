'use client'

import { useSubscriptionForm } from './hooks/useSubscriptionForm'
import { FormContainer } from './components/FormContainer'
import { Step1Form } from './components/Step1Form'
import { Step2Form } from './components/Step2Form'

export default function HomePage() {
  const {
    currentStep,
    formData,
    errors,
    updateFormData,
    toggleCategory,
    nextStep,
    prevStep,
    handleFinalSubmit
  } = useSubscriptionForm()

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom right, #F9A826, #62B6CB, #0B132B)'
      }}
    >
      <main className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <div className="text-center mb-12">
            {/* Hero Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-cormorant font-bold text-white mb-6 leading-tight">
              daily quotes
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-2xl mx-auto">
              start every day inspired with handpicked quotes delivered right to your phone
            </p>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              join thousands who begin their mornings with wisdom, motivation, and positivity
            </p>
          </div>

          {/* Subscription Form */}
          <FormContainer currentStep={currentStep} errors={errors}>
            {currentStep === 1 && (
              <Step1Form
                formData={formData}
                updateFormData={updateFormData}
                onSubmit={nextStep}
              />
            )}

            {currentStep === 2 && (
              <Step2Form
                formData={formData}
                updateFormData={updateFormData}
                toggleCategory={toggleCategory}
                onBack={prevStep}
                onSubmit={handleFinalSubmit}
              />
            )}
          </FormContainer>

          {/* Social proof or additional info */}
          <div className="mt-12 text-center">
            <p className="text-white/80 text-sm mb-4">
              trusted by over 10,000+ quote enthusiasts worldwide
            </p>
            <div className="flex items-center justify-center space-x-6 text-white/60 text-xs">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                daily delivery
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                curated content
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                unsubscribe anytime
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center border-t border-white/20">
          <p className="text-sm text-white/70">
            powered by next.js, supabase, & twilio
          </p>
        </footer>
      </main>
    </div>
  )
}
