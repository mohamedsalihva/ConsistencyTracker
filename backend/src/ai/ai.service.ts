import { GoogleGenAI } from '@google/genai';
import {
  Injectable,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatMessageDto } from './dto/chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit } from 'src/habits/habit.schema';

type HabitHistory = { date: string; completed: boolean };
type HabitLite = {
  title: string;
  streak?: number;
  history?: HabitHistory[];
};

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;
  private readonly model: string;

  constructor(@InjectModel(Habit.name) private habitModel: Model<Habit>) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not configured');
    }

    this.ai = new GoogleGenAI({ apiKey });
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  private dayKey(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private lastNDaysKeys(n: number) {
    const keys: string[] = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      keys.push(this.dayKey(d));
    }
    return keys;
  }

  private doneOn(habit: HabitLite, key: string) {
    return !!habit.history?.some((e) => e.date === key && e.completed);
  }

  private rateForKeys(habit: HabitLite, keys: string[]) {
    if (!keys.length) return 0;
    const done = keys.filter((k) => this.doneOn(habit, k)).length;
    return Math.round((done / keys.length) * 100);
  }

  private async buildHabitContext(userId: string) {
    const habits = (await this.habitModel.find({ userId }).lean()) as HabitLite[];

    const today = this.dayKey(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = this.dayKey(yesterdayDate);

    if (!habits.length) {
      return {
        habitsCount: 0,
        todayDoneCount: 0,
        pendingToday: [],
        weakHabits: [],
        note: 'User has no habits yet.',
      };
    }

    const last7 = this.lastNDaysKeys(7);
    const last14 = this.lastNDaysKeys(14);

    const todayDoneCount = habits.filter((h) => this.doneOn(h, today)).length;
    const pendingToday = habits.filter((h) => !this.doneOn(h, today)).map((h) => h.title).slice(0, 8);

    const weakHabits = habits
      .map((h) => ({
        title: h.title,
        streak: h.streak ?? 0,
        rate7: this.rateForKeys(h, last7),
        rate14: this.rateForKeys(h, last14),
      }))
      .sort((a, b) => a.rate7 - b.rate7)
      .slice(0, 3);

    const missedYesterday = habits
      .filter((h) => !this.doneOn(h, yesterday))
      .map((h) => h.title)
      .slice(0, 8);

    return {
      habitsCount: habits.length,
      todayDoneCount,
      todayProgressPct: Math.round((todayDoneCount / Math.max(habits.length, 1)) * 100),
      pendingToday,
      missedYesterday,
      weakHabits,
    };
  }

  async chat(userId: string, messages: ChatMessageDto[], context?: string) {
    const systemInstruction =
        'You are a practical habit coach inside a habit tracker app. Use the provided habit data. Keep response short and actionable. Output plain text only (no markdown symbols like **). Format exactly as 3 lines: Insight: ... Action today: ... Follow-up: ...';

    const habitContext = await this.buildHabitContext(userId);

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const prompt = [
      'Habit data from database:',
      JSON.stringify(habitContext, null, 2),
      context ? `Extra frontend context: ${context}` : '',
      'Conversation:',
      conversation,
      'Respond now as assistant.',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: { systemInstruction, temperature: 0.6 },
      });

      const reply = response.text?.trim();
      if (!reply) {
        throw new InternalServerErrorException('Gemini returned empty response');
      }

      return reply;
    } catch (err: any) {
      if (err?.status === 429) {
        throw new HttpException(
          'AI quota exceeded. Try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new InternalServerErrorException('AI request failed');
    }
  }
}
