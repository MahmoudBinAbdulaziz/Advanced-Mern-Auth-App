import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
}
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DB_URI).then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Database connection error:', error);
}); 