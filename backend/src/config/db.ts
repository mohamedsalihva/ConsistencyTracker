import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not set in the environment");
        }

        await mongoose.connect(mongoUri);
        console.log("MongoDB Connected");
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error connecting to MongoDB:", message);
        process.exit(1);
    }
};

export default connectDB;
