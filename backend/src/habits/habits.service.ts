import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit } from './habit.schema';

@Injectable()
export class HabitsService {
  private static readonly MAX_HABITS_PER_USER = 15;

  constructor(@InjectModel(Habit.name) private habitModel: Model<Habit>) {}

  async createHabit(userId: string, title: string) { 

    const habitsCount = await this.habitModel.countDocuments({ userId });
    if (habitsCount >= HabitsService.MAX_HABITS_PER_USER) {
      throw new BadRequestException(`You can create up to ${HabitsService.MAX_HABITS_PER_USER} habits.`);
    }

    return this.habitModel.create({
      userId,
      title: title.trim(),
      history: [],
      streak: 0,
    });
  }

  async getHabits(userId: string) {
    return this.habitModel.find({ userId }).sort({ createdAt: -1 });
  }


  async markComplete(habitId: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: habitId, userId });
    if (!habit) throw new NotFoundException('habit not found');

    const today = new Date().toISOString().split('T')[0];

    const todayEntry = habit.history.find((entry) => entry.date === today);
    if (todayEntry) throw new BadRequestException('habit already marked  as complete for today');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const yesterdayEntry = habit.history.find((entry) => entry.date === yesterdayStr && entry.completed === true);

    if (yesterdayEntry) habit.streak += 1;
    else habit.streak = 1;

    habit.history.push({ date: today, completed: true });
    await habit.save();
    return habit;
  }


  
  async  renameHabit(habitId: string, userId: string, title: string){
      const cleanTitle = title.trim();

    const escaped = cleanTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const duplicate = await this.habitModel.findOne({
        userId,
        _id: { $ne: habitId },
        title: { $regex: `^${escaped}$`, $options: 'i' },
    });
    
    if(duplicate){
        throw new BadRequestException('Habit with this title already exists');
    }

    const updated = await this.habitModel.findOneAndUpdate(
        {_id: habitId, userId},
        {title: cleanTitle},
        {new: true},
    );

    if(!updated) throw new NotFoundException('habit not found');
    return updated;
  }

  async deleteHabit(habitId:string, userId: string){
    const deleted = await this.habitModel.findOneAndDelete({ _id: habitId, userId});
    if(!deleted) throw new NotFoundException('habit not found');
    return {message: 'habit deleted successfully'};
  }

}
