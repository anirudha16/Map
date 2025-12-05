import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '.env');

console.log('🔍 Attempting to load .env from:', envPath);
console.log('📁 File exists?', fs.existsSync(envPath));

const result = dotenv.config({ path: envPath, override: true });

if (result.error) {
  console.error('❌ dotenv error:', result.error.message);
} else {
  console.log('✅ dotenv loaded successfully');
  console.log('📋 Loaded variables count:', Object.keys(result.parsed || {}).length);
}

import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import locationsRouter from './routes/locations.js';
import reviewsRouter from './routes/reviews.js';
import placesRouter from './routes/places.js';

const app = express();
const PORT = process.env.PORT || 4000;

console.log('\n🔐 ENV CHECK:', {
  SUPABASE_URL: process.env.SUPABASE_URL || '❌ MISSING',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ SET' : '❌ MISSING',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ SET' : '❌ MISSING',
  PORT: process.env.PORT || '❌ MISSING',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ SET' : '❌ MISSING'
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  'https://map.wassal.cloud',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS: ' + origin), false);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/locations', locationsRouter);
app.use('/locations/:locationId/reviews', reviewsRouter);
app.use('/places', placesRouter);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend server listening on port ${PORT}`);
});
