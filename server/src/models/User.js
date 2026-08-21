import mongoose from 'mongoose';

/**
 * Applicant account. Passwords are never stored in plain text — only a
 * bcrypt hash (see routes/auth.js), which is the whole point of having a
 * real backend instead of the earlier localStorage-only prototype.
 *
 * The `reset*` fields back the forgot-password flow: a 6-digit code is
 * emailed to the applicant and only its bcrypt hash is kept here, so a
 * leaked database dump still can't be used to take over an account.
 */
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // Signup is not finished until a code emailed to this address is entered,
    // so an account made with an address nobody owns can never be used.
    // Accounts created before verification existed were backfilled to true.
    emailVerified: { type: Boolean, default: false },
    verifyCodeHash: { type: String, default: null },
    verifyCodeExpiresAt: { type: Date, default: null },
    verifyCodeSentAt: { type: Date, default: null },
    verifyAttempts: { type: Number, default: 0 },

    resetCodeHash: { type: String, default: null },
    resetCodeExpiresAt: { type: Date, default: null },
    resetCodeSentAt: { type: Date, default: null },
    // Wrong-guess counter, so a 6-digit code can't simply be brute-forced.
    resetAttempts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
