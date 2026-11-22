import mongoose from 'mongoose';

/* =========================================================
   MONGODB CONNECTION
   Reads MONGODB_URI (and optional MONGODB_DB_NAME) from server/.env.
   Works with a local MongoDB server or a MongoDB Atlas cluster.
   ========================================================= */

const RETRIES = 5;
const RETRY_DELAY_MS = 3000;

// Hide the password when logging a connection string.
const redact = (uri) => uri.replace(/\/\/([^:/@]+):([^@]+)@/, '//$1:****@');

mongoose.set('strictQuery', true);

mongoose.connection.on('connected', () => console.log(`MongoDB connected (db: ${mongoose.connection.name})`));
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
mongoose.connection.on('error', (err) => console.error(`MongoDB error: ${err.message}`));

export async function connectDb(uri = process.env.MONGODB_URI, dbName = process.env.MONGODB_DB_NAME) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy server/.env.example to server/.env and fill it in.');
  }

  for (let attempt = 1; ; attempt++) {
    try {
      console.log(`Connecting to MongoDB at ${redact(uri)} (attempt ${attempt}/${RETRIES})`);
      await mongoose.connect(uri, {
        dbName: dbName || undefined,
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      });
      return mongoose.connection;
    } catch (err) {
      if (attempt >= RETRIES) throw err;
      console.warn(`MongoDB connection failed: ${err.message}. Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
}

export async function disconnectDb() {
  await mongoose.connection.close();
}

export const isDbConnected = () => mongoose.connection.readyState === 1;
