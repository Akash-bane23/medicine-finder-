import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import medicinesRoutes from './routes/medicines';
import pharmaciesRoutes from './routes/pharmacies';
import usersRoutes from './routes/users';
import availabilityRoutes from './routes/availability';
import adminRoutes from './routes/admin';
import prescriptionsRoutes from './routes/prescriptions';
import favoritesRoutes from './routes/favorites';
import remindersRoutes from './routes/reminders';
import searchHistoryRoutes from './routes/searchHistory';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for frontend communication
app.use(cors({
  origin: true, // Allow all origins in dev environment (or specify frontend URL)
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/medicines', medicinesRoutes);
app.use('/api/v1/pharmacies', pharmaciesRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/availability', availabilityRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/prescriptions', prescriptionsRoutes);
app.use('/api/v1/favorites', favoritesRoutes);
app.use('/api/v1/reminders', remindersRoutes);
app.use('/api/v1/search-history', searchHistoryRoutes);
app.use('/api/v1/ai', aiRoutes);

// Health check endpoint
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'MediFind Backend API' });
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  MediFind Backend API Server Running    `);
  console.log(`  URL: http://localhost:${PORT}/api/v1   `);
  console.log(`=========================================`);
});
