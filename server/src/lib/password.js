import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

/* Password hashing with Node's built-in scrypt (no native modules to install).
   Stored format: scrypt$N$r$p$<salt base64>$<hash base64> */
const scryptAsync = promisify(scrypt);
const N = 16384, R = 8, P = 1, KEYLEN = 64;

export const MIN_PASSWORD_LENGTH = 10;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEYLEN, { N, r: R, p: P });
  return ['scrypt', N, R, P, salt.toString('base64'), hash.toString('base64')].join('$');
}

export async function verifyPassword(password, stored) {
  const [algo, n, r, p, salt, hash] = String(stored).split('$');
  if (algo !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64');
  const actual = await scryptAsync(password, Buffer.from(salt, 'base64'), expected.length, { N: +n, r: +r, p: +p });
  return timingSafeEqual(actual, expected);
}

// Checked when the email doesn't exist, so a failed login takes the same time either way.
export const DUMMY_HASH = await hashPassword(randomBytes(16).toString('hex'));
