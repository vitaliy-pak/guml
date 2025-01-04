import { generateText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';

const groq = createGroq({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export const generateAIResponse = async (prompt: string): Promise<string> => {
    try {
        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: prompt,
        });

        return text;
    } catch (error) {
        console.error('Error generating AI response:', error);
        throw new Error('Failed to generate AI response');
    }
};