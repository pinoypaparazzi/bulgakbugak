/* An error with an HTTP status and a stable `code` the staff app can react to.
   `message` is always safe to show to the user. */
export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
    this.expose = true;
  }
}

export const badRequest = (message, code = 'invalid_input') => new HttpError(400, code, message);
export const unauthorized = (code = 'unauthenticated', message = 'Please sign in.') => new HttpError(401, code, message);
export const forbidden = (message = 'You don’t have permission to do this.', code = 'forbidden') => new HttpError(403, code, message);
export const notFound = (message = 'Not found.') => new HttpError(404, 'not_found', message);
export const conflict = (message, code = 'conflict') => new HttpError(409, code, message);
