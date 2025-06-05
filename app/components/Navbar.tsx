'use client'

import { useState } from 'react'
import { SunIcon } from './SunIcon'
import { AuthModal } from './AuthModal'
import { useAuth } from '../lib/auth'

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  
  const { user, signOut, loading } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <SunIcon />
              <div className="font-heading font-bold text-white drop-shadow-lg">
                <span className="text-xl">your daily</span>
                <br />
                <span className="text-xl leading-none">dose</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#features"
                className="font-body text-white/90 hover:text-white px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-white/20 rounded-lg drop-shadow"
              >
                Features
              </a>
              <a
                href="#quotes"
                className="font-body text-white/90 hover:text-white px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-white/20 rounded-lg drop-shadow"
              >
                Quotes
              </a>
              {loading ? (
                <div className="w-20 h-11 bg-gray-200 rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/30"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block">
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* User dropdown menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setAuthMode('login')
                    setAuthModalOpen(true)
                  }}
                  className="font-body bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-white/20 text-white hover:text-white hover:bg-white/30"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <a
              href="#features"
              className="font-body text-gray-600 hover:text-gray-900 block px-4 py-3 text-base font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#quotes"
              className="font-body text-gray-600 hover:text-gray-900 block px-4 py-3 text-base font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Quotes
            </a>
            {user ? (
              <button 
                onClick={() => {
                  signOut()
                  setIsMenuOpen(false)
                }}
                className="font-body w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-3 mt-2 rounded-lg text-base font-medium transition-all duration-200"
              >
                Sign out
              </button>
            ) : (
              <button 
                onClick={() => {
                  setAuthMode('login')
                  setAuthModalOpen(true)
                  setIsMenuOpen(false)
                }}
                className="font-body w-full text-left bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 mt-2 rounded-lg text-base font-medium transition-all duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </nav>
  )
} 