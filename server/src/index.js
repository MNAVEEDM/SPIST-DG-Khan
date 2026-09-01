import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import uploadRoutes from './routes/uploads.js';
import notifyRoutes from './routes/notify.js';
import courseRoutes from './routes/courses.js';

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

/**
 * A body that is not valid JSON makes express.json() throw, and the catch-all
 * handler at the bottom would report that as an opaque 500 — which reads like
 * a server fault when it is really a malformed request. Answer 400 and say so.
 *
 * Registered here, straight after the parser, so it only ever sees parse
 * failures and never shadows a genuine error from a route.
 */
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res
      .status(400)
      .json({ message: 'The request body is not valid JSON.' });
  }
  return next(err);
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/courses', courseRoutes);

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
    const server = app.listen(PORT, () =>
      console.log(`[server] Listening on http://localhost:${PORT}`),
    );

    // Without this, a failed bind is swallowed by the uncaughtException handler
    // above: the process stays alive, the terminal still looks healthy, but
    // nothing is listening and every request from the site fails.
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`[server] Port ${PORT} is already in use — another admissions API is running.`);
        console.error('[server] Stop that one first, or start this with a different PORT.');
      } else {
        console.error('[server] Could not start:', error.message);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('[server] Failed to start:', error.message);
    process.exit(1);
  });
