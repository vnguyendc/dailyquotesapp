import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const LandingPage = () => {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleGetStarted = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/get-started')
    }, 300)
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      
      {/* Hero Section */}
      <section 
        className="flex items-center justify-center px-4 py-16 min-h-screen relative -mt-20 pt-20"
        style={{
          backgroundImage: 'url(/sunrise_mountain_ocean.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/25 to-black/45"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Main heading */}
          <div className={`mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Get your daily dose of inspiration
            </h1>
            <p className="text-lg text-white/90 leading-relaxed max-w-md mx-auto drop-shadow">
              Receive AI-personalized quotes and reflections each day to inspire and motivate you.
            </p>
          </div>

          {/* CTA Button */}
          <div className={`mb-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <button
              onClick={handleGetStarted}
              className="group px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-lg relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Get Started Free
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
            </button>
          </div>

          {/* Trust indicators */}
          <div className={`mb-8 transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <p className="text-white/70 text-sm flex items-center justify-center space-x-4">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Free to start
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                No spam
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse" style={{ animationDelay: '1s' }}></span>
                Unsubscribe anytime
              </span>
            </p>
          </div>

          {/* Social proof stats */}
          <div className={`transition-all duration-700 delay-800 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <p className="text-white/80 font-body mb-4 text-sm drop-shadow">Join thousands who start their day with purpose</p>
            <div className="flex items-center justify-center space-x-6 text-lg font-bold text-white">
              <div className="text-center">
                <div className="font-heading drop-shadow">25,000+</div>
                <div className="text-xs text-white/70 font-body drop-shadow">Daily readers</div>
              </div>
              <div className="text-center">
                <div className="font-heading drop-shadow">4.9/5</div>
                <div className="text-xs text-white/70 font-body drop-shadow">Average rating</div>
              </div>
              <div className="text-center">
                <div className="font-heading drop-shadow">180+</div>
                <div className="text-xs text-white/70 font-body drop-shadow">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-100 via-orange-100 to-yellow-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">
              Three simple steps to transform your daily routine and mindset
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">1. Fill out your profile</h3>
              <p className="text-gray-600 font-body">Tell us about your goals, preferences, and what motivates you most.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">2. Receive & reflect</h3>
              <p className="text-gray-600 font-body">Get personalized quotes delivered daily with thoughtful reflection prompts.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">3. Become your best self</h3>
              <p className="text-gray-600 font-body">Build positive habits and transform your mindset one day at a time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Quotes Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-100 via-orange-100 to-blue-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              What you&rsquo;ll receive
            </h2>
            <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">
              Personalized quotes tailored to your goals and current life situation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Quote 1 - Career Growth */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="text-orange-500 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <blockquote className="text-gray-800 font-body text-lg mb-4 leading-relaxed">
                &ldquo;Your career breakthrough is waiting on the other side of your comfort zone.&rdquo;
              </blockquote>
              <p className="text-sm text-gray-500 font-body">For: Career Growth Goals</p>
            </div>

            {/* Quote 2 - Personal Development */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="text-blue-500 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <blockquote className="text-gray-800 font-body text-lg mb-4 leading-relaxed">
                &ldquo;Self-compassion is not self-indulgence. It&rsquo;s the foundation of genuine growth.&rdquo;
              </blockquote>
              <p className="text-sm text-gray-500 font-body">For: Personal Development</p>
            </div>

            {/* Quote 3 - Stress Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="text-purple-500 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <blockquote className="text-gray-800 font-body text-lg mb-4 leading-relaxed">
                &ldquo;Peace comes from accepting what you cannot change and acting on what you can.&rdquo;
              </blockquote>
              <p className="text-sm text-gray-500 font-body">For: Stress & Anxiety</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-100 via-yellow-100 to-orange-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              What our community says
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-bold font-heading text-gray-900">Sarah Chen</h4>
                  <p className="text-sm text-gray-500 font-body">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-700 font-body leading-relaxed">
                &ldquo;These daily quotes have completely shifted my mindset. I start each day with intention and purpose now.&rdquo;
              </p>
              <div className="flex text-yellow-400 mt-4">
                {'★'.repeat(5)}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-bold font-heading text-gray-900">Marcus Johnson</h4>
                  <p className="text-sm text-gray-500 font-body">Entrepreneur</p>
                </div>
              </div>
              <p className="text-gray-700 font-body leading-relaxed">
                &ldquo;The personalization is incredible. Each quote feels like it was written specifically for what I&rsquo;m going through.&rdquo;
              </p>
              <div className="flex text-yellow-400 mt-4">
                {'★'.repeat(5)}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-bold font-heading text-gray-900">Aisha Patel</h4>
                  <p className="text-sm text-gray-500 font-body">Teacher</p>
                </div>
              </div>
              <p className="text-gray-700 font-body leading-relaxed">
                &ldquo;I&rsquo;ve tried many motivation apps, but this one actually makes me pause and reflect. Life-changing!&rdquo;
              </p>
              <div className="flex text-yellow-400 mt-4">
                {'★'.repeat(5)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-100 via-blue-100 to-yellow-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6">
            Ready to transform your daily routine?
          </h2>
          <p className="text-lg text-gray-600 font-body mb-8 max-w-2xl mx-auto">
            Join thousands who&rsquo;ve discovered the power of personalized daily inspiration. Start your journey today.
          </p>
          <button
            onClick={handleGetStarted}
            className="group px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-lg relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Start Your Free Journey
              <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
          </button>
          <p className="text-sm text-gray-500 font-body mt-4">No credit card required • Cancel anytime • 2-minute setup</p>
        </div>
      </section>
    </div>
  )
} 