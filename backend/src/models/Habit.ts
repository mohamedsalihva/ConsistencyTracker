import mongoose, { Schema, Document } from "mongoose";

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  history: { date: string; completed: boolean }[];
  streak: number;
}

const HabitSchema: Schema<IHabit> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    history: [
      {
        date: String,
        completed: Boolean,
      },
    ],

    streak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IHabit>("Habit", HabitSchema);
