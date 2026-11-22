import mongoose from 'mongoose';

/* Usernames: 3–32 characters, lowercase letters, digits, dot, underscore or
   hyphen, starting and ending with a letter or digit. Stored lowercase so
   "Juan" and "juan" are the same account. */
export const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{1,30})[a-z0-9]$/;

export const normalizeUsername = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

export function checkUsername(username) {
  if (!username) return 'Please enter a username.';
  if (!USERNAME_PATTERN.test(username)) {
    return 'Usernames must be 3–32 characters: letters, numbers, dots, underscores or hyphens, starting and ending with a letter or number.';
  }
  return null;
}

export const DISPLAY_NAME_MAX = 80;

export function normalizeDisplayName(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

export function checkDisplayName(name) {
  if (!name) return 'Please enter the person’s name.';
  if (name.length > DISPLAY_NAME_MAX) return `Names can be at most ${DISPLAY_NAME_MAX} characters.`;
  if (/[<>]/.test(name)) return 'Names can’t contain < or >.';
  return null;
}

export const isObjectId = (value) => typeof value === 'string' && mongoose.isValidObjectId(value) && /^[a-f0-9]{24}$/i.test(value);

/* Rejects request bodies that contain fields the endpoint does not accept,
   so a client can't slip in role, status or password fields (mass assignment). */
export function onlyFields(body, allowed) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'The request body must be a JSON object.';
  const extra = Object.keys(body).filter((k) => !allowed.includes(k));
  return extra.length ? `Unexpected field: ${extra[0]}.` : null;
}
