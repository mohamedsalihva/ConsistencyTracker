import Habit from "../models/Habit";

class HabitService {


  async createHabit(userId: string, title: string) {
    return await Habit.create({
      userId,
      title,
      history: [],
      streak: 0,
    });
  }



  async getHabit(userId: string) {
    return await Habit.find({ userId });
  }




  async markComplete(habitId: string, userId: string) {

    
    const today = new Date().toISOString().split("T")[0];

    const habit = await Habit.findOne({ _id: habitId, userId });

    if (!habit) throw new Error("Habit not found");

    const todayEntry = habit.history.find((h) => h.date === today);

    if (todayEntry) throw new Error(" already completed today");

    habit.history.push({ date: today, completed: true });

    habit.streak += 1;

    await habit.save();

    return habit;
  }
}

export default new HabitService();
