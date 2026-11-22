import mongoose from 'mongoose';

/* Staff accounts for the admin site (pogiako subdomain).
   There is no public sign-up: accounts are created with
   `npm run create-employee` (see server/scripts/create-employee.js). */
const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

// What the admin site is allowed to see about an employee.
employeeSchema.methods.toPublic = function toPublic() {
  return { id: this.id, name: this.name, email: this.email, role: this.role };
};

export default mongoose.model('Employee', employeeSchema);
