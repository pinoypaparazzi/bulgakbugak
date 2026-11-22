import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { createApp } from './app.js';
import { connectDb, disconnectDb } from './db.js';
import { ensureIndexes } from './models/index.js';

const { PORT = 4000, CORS_ORIGIN, SESSION_SECRET, NODE_ENV, TRUST_PROXY, STAFF_APP_ORIGINS } = process.env;
const production = NODE_ENV === 'production';

function parseTrustProxy(value) {
  if (value === undefined || value === '' || value === 'false') return undefined;
  if (value === 'true') return true;
  return /^\d+$/.test(value) ? Number(value) : value;
}

if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  console.error('SESSION_SECRET must be set in server/.env to a random value of at least 32 characters. See server/.env.example.');
  process.exit(1);
}

try {
  await connectDb();
  await ensureIndexes();
} catch (err) {
  console.error(`Could not start: ${err.message}`);
  process.exit(1);
}

// Staff sign-in sessions live in MongoDB (collection "sessions"), so they
// survive restarts and can be ended from the server.
const sessionStore = MongoStore.create({
  client: mongoose.connection.getClient(),
  dbName: mongoose.connection.name,
  collectionName: 'sessions',
  touchAfter: 5 * 60, // write idle-timeout updates at most every 5 minutes
});

const app = createApp({
  corsOrigin: CORS_ORIGIN,
  sessionStore,
  sessionSecret: SESSION_SECRET,
  production,
  trustProxy: parseTrustProxy(TRUST_PROXY) ?? (production ? 1 : undefined),
  staffAppOrigins: STAFF_APP_ORIGINS ? STAFF_APP_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean) : [],
});

const server = app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

// Close the HTTP server and the database cleanly on Ctrl+C or when the host stops the app.
async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close();
  await disconnectDb();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
