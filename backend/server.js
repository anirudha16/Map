const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const locationsRouter = require('./routes/locations');
const reviewsRouter = require('./routes/reviews');
const placesRouter = require('./routes/places');

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
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
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/locations', locationsRouter);
app.use('/locations/:locationId/reviews', reviewsRouter);
app.use('/places', placesRouter);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});


