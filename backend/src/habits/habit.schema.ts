import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Habit {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: [] })
  history: { date: string; completed: boolean }[];

  @Prop({ default: 0 })
  streak: number;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
