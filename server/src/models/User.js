import mongoose from 'mongoose';

/**
 * Applicant account. Passwords are never stored in plain text — only a
 * bcrypt hash (see routes/auth.js), which is the whole point of having a
 * real backend instead of the earlier localStorage-only prototype.
 */
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
