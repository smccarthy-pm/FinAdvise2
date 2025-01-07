import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/database.js';
import taskRoutes from './routes/taskRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { protect } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { memoryMonitor } from './utils/memoryMonitor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Initialize memory monitor with custom options
await memoryMonitor.init({
    warningThreshold: 0.7, // 70% of heap
    criticalThreshold: 0.85, // 85% of heap
    logInterval: 5 * 60 * 1000, // Log every 5 minutes
    cleanupInterval: 15 * 60 * 1000 // Cleanup every 15 minutes
});

const app = express();

// Add memory usage middleware
app.use((req, res, next) => {
    const memoryUsage = process.memoryUsage();
    req.memoryUsage = {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
        rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100
    };
    next();
});

app.use(cors());
app.use(express.json());

// Protected routes
app.use('/api/tasks', protect, taskRoutes);
app.use('/api/events', protect, eventRoutes);
app.use('/api/contacts', protect, contactRoutes);

// Error handling
app.use(errorHandler);
app.use(helmet());

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();