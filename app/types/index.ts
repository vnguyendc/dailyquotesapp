export interface FormData {
  // Basic information (moved to step 8)
  firstName: string
  lastName: string
  email: string
  phone: string
  deliveryTime: string
  
  // Delivery preferences (new for step 8)
  deliveryMethod: string[] // ['email', 'sms'] - can be both
  
  // Personalization fields (reordered)
  selfDescription: string
  personalGoals: string[]
  customGoal: string
  publicFigures: string
  personalHeroes: string
  emotionalThemes: string[]
  personalAffirmation: string
  preferredTone: string
  moodTracking: boolean
  
  // Authentication fields (for final step)
  password: string
  confirmPassword: string
}

export interface TimeOption {
  value: string
  label: string
}

export interface ApiResponse {
  message: string
}

export interface FormErrors {
  message: string
  isError: boolean
} 