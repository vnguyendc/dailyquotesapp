'use client'

import { useState, useEffect } from 'react'
import { SunIcon } from './SunIcon'

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <SunIcon />
              <div className="font-heading font-bold text-gray-900">
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
                className="font-body text-gray-600 hover:text-gray-900 px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-white/50 rounded-lg"
              >
                Features
              </a>
              <a
                href="#quotes"
                className="font-body text-gray-600 hover:text-gray-900 px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-white/50 rounded-lg"
              >
                Quotes
              </a>
              <button className="font-body bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105">
                Login
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                isScrolled 
                  ? 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'bg-white/20 text-gray-700 hover:text-gray-900 hover:bg-white/30'
              }`}
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
            <button className="font-body w-full text-left bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 mt-2 rounded-lg text-base font-medium transition-all duration-200">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  )
} 