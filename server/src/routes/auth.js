import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  isMailConfigured,
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  sendRegistrationEmail,
} from '../utils/mailer.js';

const router = Router();

/* Forgot-password tuning knobs, kept together so they're easy to reason about. */
const RESET_CODE_TTL_MINUTES = 15;
const RESET_RESEND_COOLDOWN_MS = 60 * 1000;
const RESET_MAX_ATTEMPTS = 5;

/* Signup verification, deliberately mirroring the reset-code settings above. */
const VERIFY_CODE_TTL_MINUTES = 15;
const VERIFY_RESEND_COOLDOWN_MS = 60 * 1000;
const VERIFY_MAX_ATTEMPTS = 5;

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

/** Cleared once the address is confirmed, so a used code can never be replayed. */
function clearVerifyFields(user) {
  user.verifyCodeHash = null;
  user.verifyCodeExpiresAt = null;
  user.verifyCodeSentAt = null;
  user.verifyAttempts = 0;
}

/**
 * Stamps a fresh verification code on the account and emails it.
 *
 * Returns false when the last one went out moments ago, so holding down the
 * resend button can't be used to flood somebody's inbox.
 */
async function issueVerificationCode(user) {
  const sentAt = user.verifyCodeSentAt?.getTime() ?? 0;
  if (Date.now() - sentAt < VERIFY_RESEND_COOLDOWN_MS) return false;

  const code = crypto.randomInt(100000, 1000000).toString();

  user.verifyCodeHash = await bcrypt.hash(code, 10);
  user.verifyCodeExpiresAt = new Date(Date.now() + VERIFY_CODE_TTL_MINUTES * 60 * 1000);
  user.verifyCodeSentAt = new Date();
  user.verifyAttempts = 0;
  await user.save();

  try {
    await sendEmailVerificationEmail({
      to: user.email,
      fullName: user.fullName,
      code,
      minutesValid: VERIFY_CODE_TTL_MINUTES,
    });
  } catch (error) {
    console.error('[mailer] Failed to send verification code:', error.message);
  }

  return true;
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

    if (existing?.emailVerified) {
      return res
        .status(409)
        .json({ message: 'An account with this email already exists — please log in instead.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    let user = existing;

    if (user) {
      // An unverified account is a signup somebody never finished. Let them
      // start over with the details they just typed rather than stranding the
      // address on a half-made account they can neither use nor recreate.
      user.fullName = fullName.trim();
      user.passwordHash = passwordHash;
      await user.save();
    } else {
      user = await User.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        emailVerified: false,
      });
    }

    const sent = await issueVerificationCode(user);

    // No token: the account is not usable until the code is entered, so there
    // is deliberately no session to hand back yet.
    res.status(201).json({
      verificationRequired: true,
      email: user.email,
      message: sent
        ? `We have sent a 6-digit code to ${user.email}. It expires in ${VERIFY_CODE_TTL_MINUTES} minutes.`
        : 'A code was sent moments ago. Please check your inbox, or wait a minute to request another.',
      emailConfigured: isMailConfigured(),
    });
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

    // Correct password, unconfirmed address: send them straight to the code
    // screen with a fresh code rather than a dead end.
    if (!user.emailVerified) {
      await issueVerificationCode(user);
      return res.status(403).json({
        verificationRequired: true,
        email: user.email,
        message: 'Please confirm your email address first. We have sent you a 6-digit code.',
      });
    }

    res.json({ token: signToken(user), user: toPublicUser(user) });
  }),
);

/**
 * Finishes signup: swaps the emailed code for a real session.
 *
 * This is the only route that can set emailVerified, and it clears the code
 * as it goes, so a code works exactly once.
 */
router.post(
  '/verify-email',
  asyncHandler(async (req, res) => {
    const { email, code } = req.body ?? {};

    if (!email?.trim() || !code?.toString().trim()) {
      return res.status(400).json({ message: 'Email address and verification code are required.' });
    }

    const invalidCode = {
      message: 'That verification code is invalid or has expired. Please request a new one.',
    };

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // Already done is not an error — the applicant just logs in.
    if (user?.emailVerified) {
      return res.status(400).json({ message: 'This email is already verified. Please log in.' });
    }

    if (!user?.verifyCodeHash || !user.verifyCodeExpiresAt || user.verifyCodeExpiresAt.getTime() < Date.now()) {
      return res.status(400).json(invalidCode);
    }

    if (user.verifyAttempts >= VERIFY_MAX_ATTEMPTS) {
      clearVerifyFields(user);
      await user.save();
      return res.status(429).json({ message: 'Too many incorrect attempts. Please request a new code.' });
    }

    const codeMatches = await bcrypt.compare(code.toString().trim(), user.verifyCodeHash);
    if (!codeMatches) {
      user.verifyAttempts += 1;
      await user.save();

      const left = VERIFY_MAX_ATTEMPTS - user.verifyAttempts;
      return res.status(400).json({
        message:
          left > 0
            ? `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.`
            : 'Incorrect code. Please request a new one.',
      });
    }

    user.emailVerified = true;
    clearVerifyFields(user);
    await user.save();

    // Now that the address is confirmed, the welcome email is worth sending.
    try {
      await sendRegistrationEmail({ to: user.email, fullName: user.fullName });
    } catch (error) {
      console.error('[mailer] Failed to send confirmation email:', error.message);
    }

    res.json({ token: signToken(user), user: toPublicUser(user) });
  }),
);

/**
 * Sends another verification code.
 *
 * Answers the same way whether or not the address is waiting to be verified,
 * so it cannot be used to discover who has an account.
 */
router.post(
  '/resend-verification',
  asyncHandler(async (req, res) => {
    const { email } = req.body ?? {};

    if (!email?.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const genericResponse = {
      message:
        `If that email is waiting to be verified, a new code is on its way. ` +
        `It expires in ${VERIFY_CODE_TTL_MINUTES} minutes.`,
      emailConfigured: isMailConfigured(),
    };

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (user && !user.emailVerified) await issueVerificationCode(user);

    res.json(genericResponse);
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

    // Reading a code sent to this address proves the applicant owns it just as
    // well as signup verification does. Without this, someone who reset before
    // verifying would be bounced to the code screen on their next login.
    if (!user.emailVerified) {
      user.emailVerified = true;
      clearVerifyFields(user);
    }

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
