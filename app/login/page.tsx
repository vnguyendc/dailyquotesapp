'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../lib/auth'
import { SunIcon } from '../components/SunIcon'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const { signIn, signUp, resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          router.push('/')
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password)
        if (error) {
          setError(error.message)
        } else {
          setMessage('Check your email for a confirmation link!')
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email)
        if (error) {
          setError(error.message)
        } else {
          setMessage('Password reset email sent!')
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError('')
    setMessage('')
  }

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-transparent to-yellow-900/10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
            <SunIcon />
            <div className="font-heading font-bold text-white drop-shadow-lg">
              <span className="text-2xl">your daily</span>
              <br />
              <span className="text-2xl leading-none">dose</span>
            </div>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-800/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-gray-700/50">
          {/* Header */}
          <div className="mb-6 text-center">
                         <h1 className="text-3xl font-bold font-heading text-white mb-2">
               {mode === 'login' && 'Welcome back'}
               {mode === 'signup' && 'Create your account'}
               {mode === 'forgot' && 'Reset your password'}
             </h1>
             <p className="text-gray-300 font-body">
              {mode === 'login' && 'Sign in to access your personalized quotes'}
              {mode === 'signup' && 'Join thousands getting daily inspiration'}
              {mode === 'forgot' && 'Enter your email to receive a reset link'}
            </p>
          </div>

          {/* Error/Success messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                             <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                 Email address
               </label>
               <input
                 type="email"
                 id="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                 placeholder="Enter your email"
               />
            </div>

            {mode !== 'forgot' && (
              <div>
                                 <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                   Password
                 </label>
                 <input
                   type="password"
                   id="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                   placeholder="Enter your password"
                   minLength={6}
                 />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'login' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending email...'}
                </div>
              ) : (
                <>
                  {mode === 'login' && 'Sign in'}
                  {mode === 'signup' && 'Create account'}
                  {mode === 'forgot' && 'Send reset email'}
                </>
              )}
            </button>
          </form>

          {/* Mode switching */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'login' && (
              <>
                                 <button
                   onClick={() => switchMode('forgot')}
                   className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                 >
                   Forgot your password?
                 </button>
                                 <div className="text-sm text-gray-300">
                   Don&apos;t have an account?{' '}
                   <button
                     onClick={() => switchMode('signup')}
                     className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                   >
                     Sign up
                   </button>
                 </div>
              </>
            )}
            
                         {mode === 'signup' && (
               <div className="text-sm text-gray-300">
                 Already have an account?{' '}
                 <button
                   onClick={() => switchMode('login')}
                   className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                 >
                   Sign in
                 </button>
               </div>
             )}
             
             {mode === 'forgot' && (
               <div className="text-sm text-gray-300">
                 Remember your password?{' '}
                 <button
                   onClick={() => switchMode('login')}
                   className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                 >
                   Sign in
                 </button>
               </div>
             )}
          </div>

                     {/* Terms for signup */}
           {mode === 'signup' && (
             <p className="mt-4 text-xs text-gray-400 text-center">
               By creating an account, you agree to our{' '}
               <a href="#" className="text-orange-400 hover:text-orange-300">Terms of Service</a>
               {' '}and{' '}
               <a href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</a>
             </p>
           )}

           {/* Back to Home */}
           <div className="mt-6 text-center">
             <Link 
               href="/"
               className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
             >
               ← Back to home
             </Link>
           </div>
        </div>
      </div>
    </div>
  )
} 