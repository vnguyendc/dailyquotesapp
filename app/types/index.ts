export interface FormData {
  // Step 1: About You  
  selfDescription: string
  personalGoals: string[]
  customGoal: string
  
  // Step 2: Preferences
  emotionalThemes: string[]
  preferredTone: string
  
  // Step 3: Delivery Setup (combined contact + auth)
  firstName: string
  lastName: string
  email: string
  phone: string
  deliveryTime: string
  deliveryMethod: string[] // ['email', 'sms'] - can be both
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