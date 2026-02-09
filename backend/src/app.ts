import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./config/db";
import authRoutes from "./routes/AuthRoutes";
import cookieParser  from 'cookie-parser';

dotenv.config();
connectDB();

const app =express();
app.use(cookieParser());

app.use(express.json());

// routes
app.use('/api/auth', authRoutes);



app.get("/", (req, res) => {
  res.send("Consistency Tracker API running");
});


export default app;
