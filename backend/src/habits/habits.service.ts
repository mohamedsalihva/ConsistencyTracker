import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit } from './habit.schema';

@Injectable()
export class HabitsService {

    constructor(
        @InjectModel(Habit.name) private habitModel: Model<Habit>,
    ){}


    async createHabit(userId: string, title: string){
        return this.habitModel.create({
            userId,
            title,
            history: [],
            streak: 0,
        });
    }


    async getHabit(userId: string){
        return this.habitModel.find({ userId });
    }



    async markComplete(habitId: string, userId: string){
        const habit = await this.habitModel.findOne({_id: habitId,userId});
        if(!habit)throw new Error('habit not found');

        const today= new Date().toISOString().split('T')[0];

        const todayEntry = habit.history.find(entry=> entry.date === today);
        if(todayEntry) throw new Error ('habit already marked as complete for today');

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const yesterdayEntry = habit.history.find(entry=> entry.date === yesterdayStr && entry.completed === true);

        if(yesterdayEntry) habit.streak += 1;
        else habit.streak = 1;

        habit.history.push({ date: today, completed: true });
        await habit.save(); 
        return habit;

    }
}
