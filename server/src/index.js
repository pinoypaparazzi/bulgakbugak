import { createApp } from './app.js';
import { connectDb, disconnectDb } from './db.js';

const { PORT = 4000, CORS_ORIGIN } = process.env;

try {
  await connectDb();
} catch (err) {
  console.error(`Could not connect to MongoDB: ${err.message}`);
  process.exit(1);
}

const server = createApp({ corsOrigin: CORS_ORIGIN }).listen(PORT, () => {
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
