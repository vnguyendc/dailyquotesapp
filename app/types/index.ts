export interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  categories: string[]
  deliveryTime: string
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