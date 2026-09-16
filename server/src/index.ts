import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedData } from './seed/seedProblems.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  ...config.clientUrl.split(',').map((u) => u.trim()),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DSA Master API Server',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error Handler
app.use(errorHandler);

async function startServer() {
  await connectDB();
  await seedData();

  app.listen(config.port, () => {
    console.log(`==================================================`);
    console.log(`🚀 DSA Master API Server running on port ${config.port}`);
    console.log(`🌐 Client Origin: ${config.clientUrl}`);
    console.log(`==================================================`);
  });
}

startServer();
