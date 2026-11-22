import mongoose from 'mongoose';
import { ROLE_IDS } from '../auth/roles.js';
import { USERNAME_PATTERN, DISPLAY_NAME_MAX } from '../lib/validate.js';

/* =========================================================
   STAFF USER — a person who can sign in to the staff app.
   Collection: staff_users
   - username is unique (database index) and stored lowercase.
   - passwordHash and sessionVersion are never selected unless a query
     asks for them explicitly, and are stripped from JSON output.
   - sessionVersion goes up on every password, role or status change;
     sessions created before the change stop working (auth/middleware.js).
   - Accounts are deactivated, never deleted, so audit history keeps
     pointing at a real account.
   This is separate from future HR employee records: not every employee
   needs a login, and HR data should not live on the login record.
   ========================================================= */
const staffUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: USERNAME_PATTERN,
      immutable: true,
    },
    displayName: { type: String, required: true, trim: true, maxlength: DISPLAY_NAME_MAX },
    role: { type: String, required: true, enum: ROLE_IDS },
    status: { type: String, required: true, enum: ['active', 'deactivated'], default: 'active' },
    passwordHash: { type: String, required: true, select: false },
    mustChangePassword: { type: Boolean, required: true, default: true },
    sessionVersion: { type: Number, required: true, default: 0, select: false },
    passwordChangedAt: { type: Date },
    lastLoginAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'StaffUser' },
    deactivatedAt: { type: Date },
    deactivatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'StaffUser' },
  },
  {
    collection: 'staff_users',
    timestamps: true,
    strict: 'throw', // unknown fields are an error, never silently stored
    toJSON: {
      transform(doc, ret) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.sessionVersion;
        return ret;
      },
    },
  },
);

staffUserSchema.index({ username: 1 }, { unique: true });
staffUserSchema.index({ role: 1, status: 1 });

/* The fields the staff app may see about an account. */
staffUserSchema.methods.toPublic = function toPublic() {
  return {
    id: this.id,
    username: this.username,
    displayName: this.displayName,
    role: this.role,
    status: this.status,
    mustChangePassword: this.mustChangePassword,
    lastLoginAt: this.lastLoginAt || null,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('StaffUser', staffUserSchema);
