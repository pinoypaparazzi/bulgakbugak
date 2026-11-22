import Employee from '../models/Employee.js';

/* Lets a request through only if a signed-in, still-active employee made it.
   Sets req.employee for the route handler. */
export async function requireAuth(req, res, next) {
  try {
    const id = req.session?.employeeId;
    const employee = id && (await Employee.findById(id));
    if (employee && employee.active) {
      req.employee = employee;
      return next();
    }
    const deny = () => res.status(401).json({ error: 'Please sign in.' });
    if (id) return req.session.destroy(deny); // stale session (account removed or deactivated)
    deny();
  } catch (err) {
    next(err);
  }
}

export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.employee?.role) ? next() : res.status(403).json({ error: 'You don’t have access to this.' });
