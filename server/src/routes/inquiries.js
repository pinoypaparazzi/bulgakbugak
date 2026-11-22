import { Router } from 'express';
import Inquiry from '../models/Inquiry.js';
// Same validation the booking form runs in the browser.
import { EMPTY_INQUIRY, validateInquiry } from '../../../src/lib/inquiry.js';

const router = Router();

const pick = (body) => {
  const d = { ...EMPTY_INQUIRY };
  for (const key of Object.keys(EMPTY_INQUIRY)) {
    if (key === 'consent') d.consent = body.consent === true;
    else if (key === 'extra') d.extra = body.extra && typeof body.extra === 'object' ? body.extra : {};
    else if (typeof body[key] === 'string') d[key] = body[key];
  }
  return d;
};

// POST /api/inquiries  — save a booking request
router.post('/', async (req, res, next) => {
  try {
    const data = pick(req.body || {});
    const errors = validateInquiry(data);
    if (Object.keys(errors).length) return res.status(400).json({ errors });
    const doc = await Inquiry.create(data);
    res.status(201).json({ id: doc.id });
  } catch (err) {
    next(err);
  }
});

export default router;
