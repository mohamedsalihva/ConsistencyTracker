import { GoogleGenAI } from '@google/genai';
import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { ChatMessageDto } from './dto/chat.dto';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is not configured',
      );
    }

    this.ai = new GoogleGenAI({ apiKey });
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  async chat(userId: string, messages: ChatMessageDto[], context?: string) {
    const systemInstruction =
      'You are a practical habit coach in a habit tracker app. Be concise. Give one clear action for today. Ask at most one follow-up question.';

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join(`\n`);

    const prompt = [
      `User ID: ${userId}`,
      context ? `Context: ${context}` : '',
      'Conversation:',
      conversation,
      'Now respond as assistant.',
    ]
      .filter(Boolean)
      .join('\n\n');


   
try {
  const response = await this.ai.models.generateContent({
    model: this.model,
    contents: prompt,
    config: { systemInstruction, temperature: 0.7 },
  });

  const reply = response.text?.trim();
  if (!reply) throw new InternalServerErrorException('Gemini returned empty response');
  return reply;
} catch (err: any) {
  if (err?.status === 429) {
    throw new HttpException('AI quota exceeded. Try again later.', HttpStatus.TOO_MANY_REQUESTS);
  }
  throw new InternalServerErrorException('AI request failed');
}
}}
