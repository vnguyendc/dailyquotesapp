import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Font,
  Img,
} from '@react-email/components'

interface WelcomeEmailProps {
  subscriberName: string
  quote: string
  author: string
  deliveryTime: string
  deliveryMethod: string[]
  personalGoals: string[]
  tonePreference: string
  unsubscribeUrl?: string
}

const getLogoBase64 = () => {
  // Base64 encoded version of your sun logo
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8IS0tIFN1biByYXlzIC0tPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LCA0KSI+CjxyZWN0IHg9IjE1IiB5PSIyIiB3aWR0aD0iMiIgaGVpZ2h0PSI0IiByeD0iMSIgZmlsbD0iI0ZCOTIzQyIgb3BhY2l0eT0iMC45Ii8+CjxyZWN0IHg9IjE1IiB5PSIyNiIgd2lkdGg9IjIiIGhlaWdodD0iNCIgcng9IjEiIGZpbGw9IiNGQjkyM0MiIG9wYWNpdHk9IjAuOSIvPgo8cmVjdCB4PSIyIiB5PSIxNSIgd2lkdGg9IjQiIGhlaWdodD0iMiIgcng9IjEiIGZpbGw9IiNGQjkyM0MiIG9wYWNpdHk9IjAuOSIvPgo8cmVjdCB4PSIyNiIgeT0iMTUiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIHJ4PSIxIiBmaWxsPSIjRkI5MjNDIiBvcGFjaXR5PSIwLjkiLz4KPHJlY3QgeD0iNS43NiIgeT0iNS43NiIgd2lkdGg9IjIiIGhlaWdodD0iNCIgcng9IjEiIGZpbGw9IiNGQjkyM0MiIG9wYWNpdHk9IjAuNyIgdHJhbnNmb3JtPSJyb3RhdGUoNDUgNi43NiA3Ljc2KSIvPgo8cmVjdCB4PSIyMi4yNCIgeT0iMjIuMjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjQiIHJ4PSIxIiBmaWxsPSIjRkI5MjNDIiBvcGFjaXR5PSIwLjciIHRyYW5zZm9ybT0icm90YXRlKDQ1IDIzLjI0IDI0LjI0KSIvPgo8cmVjdCB4PSI1Ljc2IiB5PSIyMi4yNCIgd2lkdGg9IjIiIGhlaWdodD0iNCIgcng9IjEiIGZpbGw9IiNGQjkyM0MiIG9wYWNpdHk9IjAuNyIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDYuNzYgMjQuMjQpIi8+CjxyZWN0IHg9IjIyLjI0IiB5PSI1Ljc2IiB3aWR0aD0iMiIgaGVpZ2h0PSI0IiByeD0iMSIgZmlsbD0iI0ZCOTIzQyIgb3BhY2l0eT0iMC43IiB0cmFuc2Zvcm09InJvdGF0ZSgtNDUgMjMuMjQgNy43NikiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0idXJsKCNncmFkaWVudDEpIi8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjUiIGZpbGw9InVybCgjZ3JhZGllbnQyKSIvPgo8L2c+Cjx0ZXh0IHg9IjU1IiB5PSIxNiIgZm9udC1mYW1pbHk9IkludGVyLCBBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iIzFmMjkzNyI+WU9VUiBEQUlMWTwvdGV4dD4KPHR4dCB4PSI1NSIgeT0iMjgiIGZvbnQtZmFtaWx5PSJJbnRlciwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2NjdlZWEiPkRPU0U8L3R4dD4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGQjkyM0M7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkRCQTc0O3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRUYzQzc7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRUYzQzc7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZERTY4QTtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K'
}

export default function WelcomeEmail({
  subscriberName = 'Friend',
  quote = 'The journey of a thousand miles begins with one step.',
  author = 'Lao Tzu',
  deliveryTime = '7:00 AM',
  deliveryMethod = ['email'],
  personalGoals = ['Personal Growth'],
  tonePreference = 'inspirational',
  unsubscribeUrl = '#',
}: WelcomeEmailProps) {
  const previewText = `Welcome to Your Daily Dose, ${subscriberName}! Your personalized quotes start now.`
  
  // Format delivery methods for display
  const formatDeliveryMethods = (methods: string[]) => {
    if (methods.length === 1) {
      return methods[0] === 'email' ? 'email' : 'text message'
    }
    return 'email and text message'
  }

  // Format personal goals for display
  const formatPersonalGoals = (goals: string[]) => {
    if (goals.length <= 2) {
      return goals.join(' and ')
    }
    return goals.slice(0, -1).join(', ') + ', and ' + goals[goals.length - 1]
  }

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Welcome Header */}
          <Section style={header}>
            <Img
              src={getLogoBase64()}
              alt="Your Daily Dose"
              width="120"
              height="40"
              style={logo}
            />
            <div style={celebrationIcon}>🎉</div>
            <Heading style={welcomeHeading}>Welcome to Your Daily Dose, {subscriberName}!</Heading>
            <Text style={welcomeSubtitle}>Your personalized inspiration journey starts now</Text>
          </Section>

          {/* Welcome Message */}
          <Section style={welcomeSection}>
            <Text style={welcomeText}>
              Thank you for joining our community of {" "}
              <strong style={highlight}>growth-minded individuals</strong>! 
              We&apos;re excited to support your journey toward {formatPersonalGoals(personalGoals).toLowerCase()}.
            </Text>
          </Section>

          {/* First Quote */}
          <Section style={quoteSection}>
            <div style={quoteHeader}>
              <Text style={quoteHeaderText}>✨ Here&apos;s your first quote to get started:</Text>
            </div>
            <div style={quoteContainer}>
              <Text style={quoteText}>&ldquo;{quote}&rdquo;</Text>
              <Text style={authorText}>— {author}</Text>
            </div>
          </Section>

          {/* Personalization Details */}
          <Section style={personalizationSection}>
            <Heading style={sectionHeading}>What to Expect</Heading>
            <div style={expectationsList}>
              <div style={expectationItem}>
                <Text style={expectationIcon}>📅</Text>
                <div>
                  <Text style={expectationTitle}>Daily Delivery</Text>
                  <Text style={expectationText}>
                    You&apos;ll receive your personalized quote every day at <strong>{deliveryTime}</strong> via {formatDeliveryMethods(deliveryMethod)}
                  </Text>
                </div>
              </div>
              
              <div style={expectationItem}>
                <Text style={expectationIcon}>🎯</Text>
                <div>
                  <Text style={expectationTitle}>Personalized for You</Text>
                  <Text style={expectationText}>
                    Each quote is tailored to your goals of {formatPersonalGoals(personalGoals).toLowerCase()} with a {tonePreference} tone
                  </Text>
                </div>
              </div>
              
              <div style={expectationItem}>
                <Text style={expectationIcon}>💫</Text>
                <div>
                  <Text style={expectationTitle}>Never Repetitive</Text>
                  <Text style={expectationText}>
                    Our AI ensures you never receive the same quote twice, keeping your inspiration fresh
                  </Text>
                </div>
              </div>
            </div>
          </Section>

          {/* Next Steps */}
          <Section style={ctaSection}>
            <Heading style={sectionHeading}>Your Next Quote Arrives Tomorrow</Heading>
            <Text style={ctaText}>
              ⏰ <strong>Mark your calendar!</strong> Your next personalized quote will arrive tomorrow at {deliveryTime}.
            </Text>
            <Text style={ctaSubtext}>
              In the meantime, take a moment to reflect on today&apos;s quote. How might you apply this wisdom to your {formatPersonalGoals(personalGoals).toLowerCase()} journey?
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerTitle}>
              <strong>Your Daily Dose</strong> 📖
            </Text>
            <Text style={footerSubtitle}>
              Transforming your day, one quote at a time
            </Text>
            <Text style={footerLinks}>
              <Link href={unsubscribeUrl} style={link}>
                Unsubscribe
              </Link>
              {' | '}
              <Link href="#" style={link}>
                Update Preferences
              </Link>
              {' | '}
              <Link href="#" style={link}>
                Contact Support
              </Link>
            </Text>
            <Text style={footerNote}>
              Questions? Just reply to this email - we&apos;re here to help!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '20px 0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
}

const header = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  padding: '40px 30px',
  textAlign: 'center' as const,
}

const logo = {
  display: 'block',
  margin: '0 auto 16px auto',
}

const celebrationIcon = {
  fontSize: '48px',
  marginBottom: '16px',
}

const welcomeHeading = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '600',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
}

const welcomeSubtitle = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  margin: '0',
  fontWeight: '400',
}

const welcomeSection = {
  padding: '30px 30px 20px',
}

const welcomeText = {
  fontSize: '18px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center' as const,
}

const highlight = {
  color: '#059669',
}

const quoteSection = {
  padding: '20px 30px 30px',
}

const quoteHeader = {
  textAlign: 'center' as const,
  marginBottom: '20px',
}

const quoteHeaderText = {
  fontSize: '16px',
  color: '#6b7280',
  margin: '0',
  fontWeight: '500',
}

const quoteContainer = {
  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center' as const,
  borderLeft: '4px solid #10b981',
  position: 'relative' as const,
}

const quoteText = {
  fontSize: '22px',
  fontStyle: 'italic',
  color: '#1f2937',
  lineHeight: '1.5',
  margin: '0 0 20px 0',
  fontWeight: '400',
}

const authorText = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#059669',
  margin: '0',
}

const personalizationSection = {
  padding: '0 30px 30px',
}

const sectionHeading = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
}

const expectationsList = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '20px',
}

const expectationItem = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
}

const expectationIcon = {
  fontSize: '24px',
  margin: '0',
  flexShrink: 0,
}

const expectationTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 4px 0',
}

const expectationText = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '0',
}

const ctaSection = {
  padding: '20px 30px 30px',
  textAlign: 'center' as const,
}

const ctaText = {
  fontSize: '18px',
  color: '#1f2937',
  lineHeight: '1.5',
  margin: '0 0 16px 0',
}

const ctaSubtext = {
  fontSize: '16px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '0',
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
}

const footer = {
  padding: '30px',
  textAlign: 'center' as const,
  backgroundColor: '#f9fafb',
}

const footerTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const footerSubtitle = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 20px 0',
}

const footerLinks = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0 0 16px 0',
}

const footerNote = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
  fontStyle: 'italic',
}

const link = {
  color: '#059669',
  textDecoration: 'underline',
} 