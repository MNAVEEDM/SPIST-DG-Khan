import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import uploadRoutes from './routes/uploads.js';

// Defense-in-depth: log anything that slips past route-level error handling
// instead of letting Node terminate the whole server process.
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('[server] Uncaught exception:', error);
});

const app = express();

/**
 * CORS: pinned to CLIENT_ORIGIN in production.
 *
 * In development any localhost port is accepted as well, because Vite hands
 * out whatever port happens to be free — and a mismatch surfaces in the
 * browser as a misleading "could not reach the server", not as a CORS error.
 */
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const LOCALHOST_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(
  cors({
    origin(origin, callback) {
      // curl, server-to-server and same-origin requests send no Origin header.
      if (!origin) return callback(null, true);
      if (origin === CLIENT_ORIGIN) return callback(null, true);
      if (!IS_PRODUCTION && LOCALHOST_ORIGIN.test(origin)) return callback(null, true);
      return callback(null, false);
    },
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/uploads', uploadRoutes);

// Centralized error handler — catches anything thrown/rejected in a route
// that wasn't already handled, so the API returns JSON instead of crashing.
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] Listening on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('[server] Failed to start:', error.message);
    process.exit(1);
  });
