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
} from '@react-email/components'

interface DailyQuoteEmailProps {
  subscriberName: string
  quote: string
  author: string
  personalization?: string
  unsubscribeUrl?: string
}

export default function DailyQuoteEmail({
  subscriberName = 'Friend',
  quote = 'The only way to do great work is to love what you do.',
  author = 'Steve Jobs',
  personalization,
  unsubscribeUrl = '#',
}: DailyQuoteEmailProps) {
  const previewText = `Your daily inspiration: "${quote.substring(0, 100)}..."`

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
          {/* Header */}
          <Section style={header}>
            <div style={sunIcon}>☀️</div>
            <Heading style={greeting}>Good morning, {subscriberName}!</Heading>
            <Text style={tagline}>Your daily dose of inspiration</Text>
          </Section>

          {/* Quote Section */}
          <Section style={quoteSection}>
            <div style={quoteContainer}>
              <Text style={quoteText}>&ldquo;{quote}&rdquo;</Text>
              <Text style={authorText}>— {author}</Text>
            </div>
          </Section>

          {/* Personalization */}
          {personalization && (
            <Section style={personalizationSection}>
              <Text style={personalizationText}>{personalization}</Text>
            </Section>
          )}

          {/* Call to Action */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              ✨ Let this inspire your day ahead. How will you apply this wisdom today?
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
                Share This Quote
              </Link>
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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 30px',
  textAlign: 'center' as const,
}

const sunIcon = {
  fontSize: '48px',
  marginBottom: '16px',
}

const greeting = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '600',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
}

const tagline = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  margin: '0',
  fontWeight: '400',
}

const quoteSection = {
  padding: '40px 30px',
}

const quoteContainer = {
  background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center' as const,
  borderLeft: '4px solid #667eea',
  position: 'relative' as const,
}

const quoteText = {
  fontSize: '22px',
  fontStyle: 'italic',
  color: '#2c3e50',
  lineHeight: '1.5',
  margin: '0 0 20px 0',
  fontWeight: '400',
}

const authorText = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#667eea',
  margin: '0',
}

const personalizationSection = {
  padding: '0 30px 20px',
}

const personalizationText = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '12px',
  color: '#495057',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0',
  textAlign: 'center' as const,
  border: '1px solid #e9ecef',
}

const ctaSection = {
  padding: '20px 30px',
}

const ctaText = {
  fontSize: '16px',
  color: '#495057',
  textAlign: 'center' as const,
  margin: '0',
  lineHeight: '1.5',
  fontStyle: 'italic',
}

const divider = {
  borderColor: '#e9ecef',
  margin: '20px 30px',
}

const footer = {
  padding: '20px 30px 30px',
  textAlign: 'center' as const,
}

const footerTitle = {
  fontSize: '16px',
  color: '#495057',
  margin: '0 0 8px 0',
}

const footerSubtitle = {
  fontSize: '14px',
  color: '#6c757d',
  margin: '0 0 16px 0',
}

const footerLinks = {
  fontSize: '12px',
  color: '#6c757d',
  margin: '0',
}

const link = {
  color: '#667eea',
  textDecoration: 'none',
} 