import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface QuoteRequest {
  persona: string;
  categories: string[];
  previousQuotes?: string[]; // To avoid duplicates
  tone?: 'inspirational' | 'motivational' | 'reflective' | 'energetic';
}

export interface GeneratedQuote {
  quote: string;
  author: string; // Can be real author or "Anonymous"
  category: string;
  explanation?: string; // Why this quote fits their persona
}

export async function generatePersonalizedQuote(request: QuoteRequest): Promise<GeneratedQuote> {
  const { persona, categories, previousQuotes = [], tone = 'inspirational' } = request;

  const systemPrompt = `You are a wise quote curator and generator. Your job is to provide meaningful, authentic quotes that resonate with people based on their persona and interests.

Rules:
1. Generate quotes that feel authentic and meaningful
2. Mix real quotes from known figures with thoughtfully crafted original ones
3. When using original quotes, attribute to "Anonymous" or "Your Daily Dose"
4. Keep quotes concise (under 150 characters ideally)
5. Ensure the quote directly relates to the person's persona and categories
6. Avoid clichés and overused quotes
7. Make it ${tone} in tone
8. CRITICAL: Avoid similar themes, structures, or keywords from previous quotes
9. Use diverse vocabulary and completely different angles/perspectives
10. If previous quotes used metaphors (like "forged"), use different literary devices

Persona Types:
- Athlete: Focus on performance, discipline, competition, physical/mental strength, training, victory, endurance
- Entrepreneur: Business wisdom, innovation, risk-taking, leadership, startups, growth, failure, success
- Student: Learning, growth, knowledge, academic success, future planning, curiosity, discovery
- Professional: Career development, workplace wisdom, productivity, balance, teamwork, leadership
- Parent: Family values, nurturing, guidance, patience, love, teaching, protection
- Creative: Artistic inspiration, innovation, self-expression, originality, imagination, beauty
- Leader/Manager: Leadership, team building, decision-making, responsibility, vision, influence
- Teacher/Educator: Knowledge sharing, inspiration, growth mindset, impact, learning, wisdom
- Healthcare Worker: Service, compassion, healing, resilience, purpose, care, dedication
- Other: General life wisdom, personal development, mindfulness, purpose, growth`;

  const userPrompt = `Generate a personalized quote for someone who is a ${persona} interested in: ${categories.join(', ')}.

${previousQuotes.length > 0 ? `IMPORTANT - Avoid these themes, structures, and keywords from recent quotes:\n${previousQuotes.join('\n')}\n\nCreate something completely different in style, vocabulary, and approach.` : ''}

Respond in this exact JSON format:
{
  "quote": "The actual quote text",
  "author": "Author name or 'Anonymous'",
  "category": "Primary category this quote relates to (choose from: ${categories.join(', ')})",
  "explanation": "Brief explanation of why this quote fits their ${persona} persona"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    const quoteData = JSON.parse(content.text);
    
    // Validate the response
    if (!quoteData.quote || !quoteData.author || !quoteData.category) {
      throw new Error('Invalid quote format received from Claude');
    }

    return {
      quote: quoteData.quote,
      author: quoteData.author,
      category: quoteData.category,
      explanation: quoteData.explanation
    };

  } catch (error) {
    console.error('Error generating quote with Claude:', error);
    
    // Fallback quote if Claude API fails
    return {
      quote: "Every moment is a fresh beginning.",
      author: "T.S. Eliot",
      category: categories[0] || "Inspiration",
      explanation: "A timeless reminder that each day offers new opportunities for growth."
    };
  }
}

export async function generateMultipleQuotes(
  request: QuoteRequest, 
  count: number = 5
): Promise<GeneratedQuote[]> {
  const quotes: GeneratedQuote[] = [];
  const usedQuotes: string[] = [...(request.previousQuotes || [])];

  for (let i = 0; i < count; i++) {
    try {
      const quote = await generatePersonalizedQuote({
        ...request,
        previousQuotes: usedQuotes
      });
      
      quotes.push(quote);
      usedQuotes.push(quote.quote);
      
      // Small delay to avoid rate limiting
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error generating quote ${i + 1}:`, error);
      // Continue with remaining quotes
    }
  }

  return quotes;
} 