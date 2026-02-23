import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Habit, HabitSchema } from 'src/habits/habit.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Habit.name, schema: HabitSchema}]),
    ],
    controllers: [AiController],
    providers: [AiService]
})

export class AiModule{}