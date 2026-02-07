import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    title: {
        type: string,
        required: true
    },

    history: [{
        date: string,
        completed: boolean,
    }, ],

    streak: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});
export default mongoose.model("Habit", HabitSchema);