import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isMailConfigured, sendPasswordResetEmail, sendRegistrationEmail } from '../utils/mailer.js';

const router = Router();

/* Forgot-password tuning knobs, kept together so they're easy to reason about. */
const RESET_CODE_TTL_MINUTES = 15;
const RESET_RESEND_COOLDOWN_MS = 60 * 1000;
const RESET_MAX_ATTEMPTS = 5;

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

/** Never send the password hash back to the client. */
function toPublicUser(user) {
  return { fullName: user.fullName, email: user.email };
}

/** Clears every reset field at once — used after success and after lockout. */
function clearResetFields(user) {
  user.resetCodeHash = null;
  user.resetCodeExpiresAt = null;
  user.resetCodeSentAt = null;
  user.resetAttempts = 0;
}

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body ?? {};

    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res
        .status(409)
        .json({ message: 'An account with this email already exists — please log in instead.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName: fullName.trim(), email: normalizedEmail, passwordHash });

    // Email is a nice-to-have, not a requirement for signup to succeed —
    // a slow/misconfigured mail server should never block account creation.
    try {
      await sendRegistrationEmail({ to: user.email, fullName: user.fullName });
    } catch (error) {
      console.error('[mailer] Failed to send confirmation email:', error.message);
    }

    res.status(201).json({ token: signToken(user), user: toPublicUser(user) });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    res.json({ token: signToken(user), user: toPublicUser(user) });
  }),
);

/**
 * Step 1 of forgot-password: emails a 6-digit code.
 *
 * Always answers 200 with the same message, whether or not the address is
 * registered — otherwise this endpoint would double as a way to find out
 * which applicants have accounts.
 */
router.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body ?? {};

    if (!email?.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const genericResponse = {
      message:
        `If an account exists for that email, a reset code is on its way. ` +
        `It expires in ${RESET_CODE_TTL_MINUTES} minutes.`,
      emailConfigured: isMailConfigured(),
    };

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.json(genericResponse);

    // Don't let someone spam an applicant's inbox by holding down the button.
    const sentAt = user.resetCodeSentAt?.getTime() ?? 0;
    if (Date.now() - sentAt < RESET_RESEND_COOLDOWN_MS) {
      return res.json(genericResponse);
    }

    const code = crypto.randomInt(100000, 1000000).toString();

    user.resetCodeHash = await bcrypt.hash(code, 10);
    user.resetCodeExpiresAt = new Date(Date.now() + RESET_CODE_TTL_MINUTES * 60 * 1000);
    user.resetCodeSentAt = new Date();
    user.resetAttempts = 0;
    await user.save();

    try {
      await sendPasswordResetEmail({
        to: user.email,
        fullName: user.fullName,
        code,
        minutesValid: RESET_CODE_TTL_MINUTES,
      });
    } catch (error) {
      console.error('[mailer] Failed to send reset code:', error.message);
    }

    res.json(genericResponse);
  }),
);

/**
 * Step 2 of forgot-password: swaps a valid code for a new password, and
 * logs the applicant straight back in so they don't have to retype it.
 */
router.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { email, code, password } = req.body ?? {};

    if (!email?.trim() || !code?.toString().trim() || !password) {
      return res.status(400).json({ message: 'Email, reset code and new password are all required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const invalidCode = { message: 'That reset code is invalid or has expired. Please request a new one.' };

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user?.resetCodeHash || !user.resetCodeExpiresAt || user.resetCodeExpiresAt.getTime() < Date.now()) {
      return res.status(400).json(invalidCode);
    }

    if (user.resetAttempts >= RESET_MAX_ATTEMPTS) {
      clearResetFields(user);
      await user.save();
      return res.status(429).json({ message: 'Too many incorrect attempts. Please request a new code.' });
    }

    const codeMatches = await bcrypt.compare(code.toString().trim(), user.resetCodeHash);
    if (!codeMatches) {
      user.resetAttempts += 1;
      await user.save();

      const left = RESET_MAX_ATTEMPTS - user.resetAttempts;
      return res.status(400).json({
        message:
          left > 0
            ? `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.`
            : 'Incorrect code. Please request a new one.',
      });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    clearResetFields(user);
    await user.save();

    res.json({ token: signToken(user), user: toPublicUser(user) });
  }),
);

/** Used on page load to resume a session from a stored token. */
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Account not found.' });
    res.json({ user: toPublicUser(user) });
  }),
);

export default router;
