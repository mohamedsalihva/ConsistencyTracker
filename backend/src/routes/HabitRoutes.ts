import  Express  from "express";
import HabitController from "../controllers/HabitController";
import authMiddleware  from "../middleware/authMiddleware";

const router = Express.Router();

router.post("/create", authMiddleware, HabitController.createHabit);
router.get("/", authMiddleware, HabitController.getHabit);
router.post("/complete/:id", authMiddleware, HabitController.completeHabit);

export default router;