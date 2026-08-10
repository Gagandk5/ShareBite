import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ShareBite API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌱 ShareBite Server running on http://localhost:${PORT}`);
});
