import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { createApp } from './app.js';
import { connectDb, disconnectDb } from './db.js';

const { PORT = 4000, CORS_ORIGIN, SESSION_SECRET, COOKIE_DOMAIN, NODE_ENV } = process.env;

try {
  await connectDb();
} catch (err) {
  console.error(`Could not connect to MongoDB: ${err.message}`);
  process.exit(1);
}

// Login sessions are stored in MongoDB (collection "sessions") so they survive restarts.
const sessionStore = MongoStore.create({
  client: mongoose.connection.getClient(),
  dbName: mongoose.connection.name,
  collectionName: 'sessions',
  touchAfter: 15 * 60,
});

let app;
try {
  app = createApp({
    corsOrigin: CORS_ORIGIN,
    sessionStore,
    sessionSecret: SESSION_SECRET,
    cookieDomain: COOKIE_DOMAIN,
    production: NODE_ENV === 'production',
  });
} catch (err) {
  console.error(err.message);
  await disconnectDb();
  process.exit(1);
}

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
