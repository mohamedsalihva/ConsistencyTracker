import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { Habit, HabitSchema } from './habit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Habit.name, schema: HabitSchema }]),
  ],
  controllers: [HabitsController],
  providers: [HabitsService],
})
export class HabitsModule {}
