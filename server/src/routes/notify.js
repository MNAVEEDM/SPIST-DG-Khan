import { Router } from 'express';
import Application from '../models/Application.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendAdmissionDecisionEmail } from '../utils/mailer.js';

/**
 * Machine-to-machine hooks for the Smart-SMS dashboard.
 *
 * That dashboard is a browser-only React app with no backend of its own, so it
 * cannot send mail. When a reviewer approves or rejects an application there,
 * it calls this server instead.
 *
 * Not session-authenticated: the caller is another system, not a logged-in
 * applicant. It proves itself with a shared secret in `x-integration-secret`.
 */
const router = Router();

/* Same shape as the public status route's limiter (see routes/applications.js).
 * The ceiling is higher because approving a batch of applications in one
 * sitting is normal admin work, while the secret itself is what actually keeps
 * strangers out. */
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 30;
const notifyAttempts = new Map();

/** Records an attempt for `ip`, returning false once it is over the limit. */
function withinRateLimit(ip) {
  const now = Date.now();

  // Expired buckets are dropped on the way past, so the map cannot grow
  // without bound on a long-running server.
  for (const [key, bucket] of notifyAttempts) {
    if (bucket.resetAt <= now) notifyAttempts.delete(key);
  }

  const bucket = notifyAttempts.get(ip);
  if (!bucket) {
    notifyAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  bucket.count += 1;
  return bucket.count <= RATE_LIMIT_MAX_ATTEMPTS;
}

const DECISIONS = ['approved', 'rejected'];

/** Keeps free-text short enough that it can't be used to stuff an email. */
function trimField(value, max) {
  return (value ?? '').toString().trim().slice(0, max);
}

/**
 * Emails an applicant the decision on their application.
 *
 * The applicant's name, email and program are read from MongoDB by reference
 * number and never taken from the request body — otherwise anyone holding the
 * secret could use this server to send arbitrary mail to arbitrary addresses.
 * Only the reviewer's published note and the placement details come from the
 * caller.
 */
router.post(
  '/decision',
  asyncHandler(async (req, res) => {
    const secret = process.env.INTEGRATION_SECRET;

    if (!secret) {
      return res
        .status(503)
        .json({ message: 'Decision notifications are not configured on this server.' });
    }

    // Counted before the secret is checked, so guessing it is rate-limited too.
    if (!withinRateLimit(req.ip ?? 'unknown')) {
      return res
        .status(429)
        .json({ message: 'Too many notification requests. Please wait a few minutes.' });
    }

    if (req.headers['x-integration-secret'] !== secret) {
      return res.status(401).json({ message: 'Not authorised.' });
    }

    const referenceNumber = trimField(req.body?.referenceNumber, 60);
    const status = trimField(req.body?.status, 20).toLowerCase();

    if (!referenceNumber) {
      return res.status(400).json({ message: 'A reference number is required.' });
    }
    if (!DECISIONS.includes(status)) {
      return res.status(400).json({ message: "Status must be either 'approved' or 'rejected'." });
    }

    const application = await Application.findOne({ referenceNumber });
    if (!application) {
      return res.status(404).json({ message: 'No application found with that reference number.' });
    }

    try {
      const delivered = await sendAdmissionDecisionEmail({
        to: application.email,
        fullName: application.fullName,
        referenceNumber: application.referenceNumber,
        program: application.program,
        status,
        publicReason: trimField(req.body?.publicReason, 600),
        rollNumber: trimField(req.body?.rollNumber, 40),
        className: trimField(req.body?.className, 60),
      });

      // Sending mail is this endpoint's entire job, so unlike the incidental
      // emails elsewhere a failure here is reported rather than swallowed —
      // the dashboard needs to know the applicant was not told.
      res.json({ sent: true, delivered, status, referenceNumber: application.referenceNumber });
    } catch (error) {
      console.error('[notify] Decision email failed:', error.message);
      res.status(502).json({ message: 'The decision email could not be sent. Please try again.' });
    }
  }),
);

export default router;
