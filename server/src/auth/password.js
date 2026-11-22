import argon2 from 'argon2';
import { randomInt } from 'node:crypto';

/* =========================================================
   PASSWORDS
   Hashing uses Argon2id through the `argon2` library (the algorithm
   OWASP recommends for new systems). Only the hash is stored; it
   includes its own random salt and settings. Plaintext passwords are
   never stored, logged or returned by the API.
   ========================================================= */

// OWASP-recommended Argon2id settings: 19 MiB memory, 2 iterations, 1 thread.
const HASH_OPTIONS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };

export const PASSWORD_MIN_LENGTH = 12;
// The one-time bootstrap password must be changed at first sign-in, so it
// only has to meet this lower minimum.
export const BOOTSTRAP_PASSWORD_MIN_LENGTH = 8;
// Upper limit keeps hashing cost bounded (protects against huge inputs).
export const PASSWORD_MAX_LENGTH = 128;

export const hashPassword = (password) => argon2.hash(password, HASH_OPTIONS);

export async function verifyPassword(hash, password) {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false; // malformed hash: treat as a failed check, never as a crash
  }
}

export const needsRehash = (hash) => argon2.needsRehash(hash, HASH_OPTIONS);

/* Checked when a username does not exist, so failed sign-ins take about
   the same time either way and don't reveal which usernames exist. */
let dummyHashPromise;
export const getDummyHash = () => (dummyHashPromise ??= hashPassword(`dummy-${randomInt(1e9)}-${Date.now()}`));

/* A short list of passwords that are too common to allow, even when long enough. */
const COMMON_PASSWORDS = new Set([
  'password1234', 'password12345', 'password123456', '123456789012', '1234567890123', 'qwertyuiop12',
  'qwerty123456', 'iloveyou1234', 'administrator', 'letmein12345', 'welcome12345', 'changeme1234',
  'atyourservice', 'atyourservice1', 'atyourservice123', 'superadmin123', 'admin1234567', 'passwordpassword',
]);

/* Returns an error message, or null when the password is acceptable.
   Follows current NIST guidance: a length minimum and a block list,
   not forced character-type rules. */
export function checkPasswordPolicy(password, { username, minLength = PASSWORD_MIN_LENGTH } = {}) {
  if (typeof password !== 'string' || password.length === 0) return 'Please enter a new password.';
  if (password.length < minLength) return `Use at least ${minLength} characters.`;
  if (password.length > PASSWORD_MAX_LENGTH) return `Use at most ${PASSWORD_MAX_LENGTH} characters.`;
  if (password.trim() !== password) return 'The password can’t start or end with a space.';
  const lower = password.toLowerCase();
  if (username && lower.includes(username.toLowerCase())) return 'The password can’t contain your username.';
  if (COMMON_PASSWORDS.has(lower)) return 'That password is too common. Choose something harder to guess.';
  if (/^(.)\1+$/.test(password)) return 'The password can’t be one repeated character.';
  return null;
}

/* Temporary passwords for new or reset accounts: 16 random characters from an
   unambiguous alphabet (about 82 bits), shown once to the administrator. */
const TEMP_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
export function generateTemporaryPassword() {
  const chars = Array.from({ length: 16 }, () => TEMP_ALPHABET[randomInt(TEMP_ALPHABET.length)]);
  return [0, 4, 8, 12].map((i) => chars.slice(i, i + 4).join('')).join('-');
}
