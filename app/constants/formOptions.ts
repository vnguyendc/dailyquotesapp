import { TimeOption } from '../types'

export const TIME_OPTIONS: TimeOption[] = [
  { value: '06:00', label: '6:00 AM - Early Bird' },
  { value: '07:00', label: '7:00 AM - Morning Motivation' },
  { value: '08:00', label: '8:00 AM - Start the Day' },
  { value: '09:00', label: '9:00 AM - Work Begins' },
  { value: '12:00', label: '12:00 PM - Midday Boost' },
  { value: '18:00', label: '6:00 PM - Evening Reflection' },
  { value: '21:00', label: '9:00 PM - Night Wisdom' }
]

// Personalization options
export const EMOTIONAL_THEMES = [
  'Overcoming fear or self-doubt',
  'Building self-love and confidence',
  'Staying focused and disciplined',
  'Healing from past trauma or loss',
  'Practicing mindfulness or gratitude',
  'Developing leadership or courage'
]

export const PERSONAL_GOALS = [
  'A personal transformation',
  'Career or creative success',
  'More inner peace and balance',
  'Stronger relationships',
  'Fitness or health milestones',
  'Self-discovery or spiritual growth'
]

export const PREFERRED_TONES = [
  'Gentle and nurturing',
  'Bold and motivational',
  'Spiritual and reflective',
  'Witty and light-hearted',
  'Raw and unfiltered',
  'Let Us decide'
]

export const DELIVERY_METHODS = [
  { value: 'sms', label: 'SMS Text Messages', icon: '📱' },
  { value: 'email', label: 'Email', icon: '📧' }
] 