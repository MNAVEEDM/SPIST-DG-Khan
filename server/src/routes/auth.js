import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendRegistrationEmail } from '../utils/mailer.js';

const router = Router();

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

/** Never send the password hash back to the client. */
function toPublicUser(user) {
  return { fullName: user.fullName, email: user.email };
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
