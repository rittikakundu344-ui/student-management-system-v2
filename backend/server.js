import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/auth.js';
import dns from "node:dns";

// Import routes
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import tasksRoutes from './routes/tasksRoutes.js';
import subjectsRoutes from './routes/subjectsRoutes.js';
import resourcesRoutes from './routes/resourcesRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config({
  path: "./.env"
});

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect Database
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/tasks', tasksRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/resources', resourcesRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/profile', profileRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ Student Knowledge Management API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
