/**
 * Normalizes a phone number by removing spaces, dashes, parentheses, and other formatting
 * while preserving the + prefix for international numbers
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')
}

/**
 * Validates if a phone number is in a valid format
 * Accepts international format with + prefix or domestic numbers
 */
export function isValidPhoneNumber(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone)
  // Match international format (+1234567890) or domestic (1234567890)
  // Minimum 10 digits, maximum 15 digits (international standard)
  return /^\+?[1-9]\d{9,14}$/.test(normalized)
}

/**
 * Formats a phone number for display
 * Example: +1234567890 -> +1 (234) 567-8901
 */
export function formatPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone)
  
  if (normalized.startsWith('+1') && normalized.length === 12) {
    // US/Canada format: +1 (234) 567-8901
    const country = normalized.slice(0, 2)
    const area = normalized.slice(2, 5)
    const first = normalized.slice(5, 8)
    const second = normalized.slice(8, 12)
    return `${country} (${area}) ${first}-${second}`
  } else if (normalized.startsWith('+')) {
    // International format: +XX XXXX XXXX
    const country = normalized.slice(0, normalized.length - 10)
    const number = normalized.slice(country.length)
    return `${country} ${number.slice(0, 4)} ${number.slice(4)}`
  } else if (normalized.length === 10) {
    // US domestic format: (234) 567-8901
    const area = normalized.slice(0, 3)
    const first = normalized.slice(3, 6)
    const second = normalized.slice(6, 10)
    return `(${area}) ${first}-${second}`
  }
  
  return normalized
} 