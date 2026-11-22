import mongoose from 'mongoose';

/* Mirrors the booking form fields in src/components/BookingForm.jsx. */
const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    service: { type: String, required: true },
    task: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String }, // YYYY-MM-DD, optional
    time: { type: String },
    notes: { type: String, trim: true },
    extra: { type: Map, of: String, default: {} },
    consent: { type: Boolean, required: true },
    status: { type: String, enum: ['new', 'contacted', 'quoted', 'closed'], default: 'new' },
  },
  { timestamps: true },
);

export default mongoose.model('Inquiry', inquirySchema);
