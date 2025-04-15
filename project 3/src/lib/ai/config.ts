import { OpenAI } from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  defaultQuery: undefined,
  organization: undefined,
  dangerouslyAllowBrowser: true // Enable browser usage
});

// Validate API key on initialization
export async function validateApiKey() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'system', content: 'Test connection' }],
      max_tokens: 1,
    });
    return response.choices.length > 0;
  } catch (error) {
    console.error('OpenAI API key validation failed:', error);
    return false;
  }
}