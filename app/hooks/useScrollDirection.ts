'use client'

import { useState, useEffect } from 'react'

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY ? 'down' : 'up'
      
      // Only update if we've scrolled a significant amount
      if (Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction)
        setLastScrollY(scrollY)
        
        // Show navbar when scrolling up or at top, hide when scrolling down
        if (scrollY < 10) {
          setIsVisible(true)
        } else {
          setIsVisible(direction === 'up')
        }
      }
    }

    window.addEventListener('scroll', updateScrollDirection)
    return () => window.removeEventListener('scroll', updateScrollDirection)
  }, [lastScrollY])

  return { scrollDirection, isVisible }
} 