import { Response } from "express";
import HabitService from "../services/HabitService";


class HabitController {

  async createHabit(req: any, res: Response) {
    try {

      const { userId, title } = req.body;
      const habit = await HabitService.createHabit(userId, title);

      res.status(201).json({ success: true, habit });
    } catch (error :any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

    async getHabit(req: any, res:Response){
        try {

            const userId = req.user.id;
            const habits = await HabitService.getHabit(userId);

            res.status(200).json({ success: true, habits });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    
    async completeHabit(req: any, res: Response) {
        try {

            const  habitId = req.params.id;
            const userId = req.user.id;
            const habit = await HabitService.markComplete(habitId,userId);

            res.status(200).json({ success: true, habit });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

}

export default new HabitController();
