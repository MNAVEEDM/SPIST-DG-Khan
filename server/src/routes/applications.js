import { Router } from 'express';
import Application from '../models/Application.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { supabase, smsSchoolId, smsCampusId, isSmsConfigured } from '../supabase.js';
import { DOCUMENT_SLOTS, UPLOAD_BUCKET } from './uploads.js';
import { sendApplicationReceivedEmail } from '../utils/mailer.js';
const router = Router();

const REQUIRED_FIELDS = [
  'fullName',
  'fatherName',
  'cnic',
  'dob',
  'gender',
  'phone',
  'email',
  'address',
  'qualification',
  'program',
  'courseId',
];

/**
 * Documents arrive as whatever the browser posted, so only the fields the
 * application actually stores are kept, and only for slots that exist. An
 * entry without a storage path never made it past the upload route, so it is
 * dropped rather than saved as a broken reference.
 */
/* ---------------------------------------------------------------------------
 * Public status lookup — rate limiting
 *
 * The status route is unauthenticated, so it is the one place someone could
 * sit and guess reference numbers.
 *
 * Only FAILED lookups are counted. Guessing is the thing worth stopping, and
 * a correct reference-number-plus-email pair is proof the caller is not
 * guessing — so an applicant refreshing their status, or the confirmation
 * panel checking on every page load, never runs into this. Ten wrong guesses
 * per quarter hour per IP is what actually gets blocked.
 *
 * In-memory on purpose: a restart clearing the counters is not worth a Redis
 * dependency.
 * ------------------------------------------------------------------------ */
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_FAILURES = 10;
const statusFailures = new Map();

/** Drops expired buckets so the map cannot grow without bound. */
function pruneFailures(now) {
  for (const [key, bucket] of statusFailures) {
    if (bucket.resetAt <= now) statusFailures.delete(key);
  }
}

/** True once `ip` has used up its wrong guesses for the current window. */
function isRateLimited(ip) {
  const now = Date.now();
  pruneFailures(now);
  return (statusFailures.get(ip)?.count ?? 0) >= RATE_LIMIT_MAX_FAILURES;
}

/** Counts one wrong guess against `ip`. */
function recordFailure(ip) {
  const now = Date.now();
  const bucket = statusFailures.get(ip);

  if (!bucket) {
    statusFailures.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  bucket.count += 1;
}

/**
 * The review itself happens in the Smart-SMS dashboard, which updates the
 * Supabase row — MongoDB has no status column of its own. A missing row or an
 * unconfigured sync just means nobody has reviewed it yet.
 */
async function readSyncedReview(application) {
  const unreviewed = { status: 'pending', publicReason: '' };
  if (!isSmsConfigured) return unreviewed;

  try {
    // Only these two columns, ever. `admin_note` is the reviewer's private
    // scratchpad and must not leave the dashboard, so it is never selected.
    const { data, error } = await supabase
      .from('admission_applications')
      .select('status, public_reason')
      .eq('school_id', smsSchoolId)
      .eq('external_id', application._id.toString())
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return unreviewed;

    return {
      status: data.status || 'pending',
      publicReason: (data.public_reason ?? '').toString().trim(),
    };
  } catch (error) {
    console.error('[sms] Status lookup failed:', error.message);
    return unreviewed;
  }
}

/**
 * Only a real Smart-SMS course id belongs in the synced row. When the course
 * list could not be loaded the form falls back to its built-in list, whose
 * ids are local placeholders — those are recorded in MongoDB but sent as null
 * rather than written into a column that expects a real course.
 */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function syncableCourseId(courseId) {
  const value = (courseId ?? '').toString().trim();
  return UUID_PATTERN.test(value) ? value : null;
}

function sanitizeDocuments(input) {
  if (!Array.isArray(input)) return [];

  return input
    .filter((doc) => doc && DOCUMENT_SLOTS[doc.slot] && typeof doc.path === 'string' && doc.path.trim())
    .slice(0, 30)
    .map((doc) => ({
      slot: doc.slot,
      label: (doc.label ?? '').toString().trim().slice(0, 120),
      path: doc.path.trim(),
      name: (doc.name ?? '').toString().trim().slice(0, 200),
      size: Number.isFinite(Number(doc.size)) ? Number(doc.size) : 0,
    }));
}

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const application = await Application.findOne({ user: req.userId });
    res.json({ application });
  }),
);

/** Creates or overwrites the caller's single application (upsert). */
router.post(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const values = req.body ?? {};

    const missing = REQUIRED_FIELDS.filter((field) => !values[field]?.toString().trim());
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }
    if (!values.declaration) {
      return res.status(400).json({ message: 'The declaration must be confirmed before submitting.' });
    }

    const referenceNumber = `SPIST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const application = await Application.findOneAndUpdate(
      { user: req.userId },
      {
        fullName: values.fullName,
        fatherName: values.fatherName,
        cnic: values.cnic,
        dob: values.dob,
        gender: values.gender,
        phone: values.phone,
        email: values.email,
        address: values.address,
        qualification: values.qualification,
        program: values.program,
        courseId: (values.courseId ?? '').toString().trim(),
        declaration: values.declaration,
        photoPath: (values.photoPath ?? '').toString().trim(),
        documents: sanitizeDocuments(values.documents),
        user: req.userId,
        referenceNumber,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    // Mirror into Smart-SMS so the school admin can review it there. Wrapped in
    // try/catch on purpose: a Supabase outage must never block an applicant's
    // submission — the row can be re-synced later.
    if (isSmsConfigured) {
      try {
        const { error } = await supabase.from('admission_applications').upsert({
          school_id: smsSchoolId,
          campus_id: smsCampusId,
          external_id: application._id.toString(),
          source: 'spist_portal',
          reference_number: application.referenceNumber,
          full_name: application.fullName,
          father_name: application.fatherName,
          cnic: application.cnic,
          date_of_birth: application.dob || null,
          gender: application.gender?.toLowerCase() || null,
          phone: application.phone,
          email: application.email,
          address: application.address,
          qualification: application.qualification,
          program: application.program,
          course_id: syncableCourseId(application.courseId),
          declaration: Boolean(application.declaration),
          photo_url: application.photoPath || null,
          documents: application.documents ?? [],
        }, { onConflict: 'school_id,source,external_id' });

        if (error) console.error('[sms] Application sync failed:', error.message);
      } catch (error) {
        console.error('[sms] Application sync threw:', error.message);
      }
    }
    // Confirmation email, carrying the reference number that was just saved.
    // Resubmitting mints a new one, so this reads from `application` rather
    // than any value computed earlier. Same try/catch rule as the sync above:
    // a mail failure must never fail the submission.
    try {
      // CLIENT_ORIGIN doubles as the public site address for the link below.
      // In production it MUST be the real domain, or the email sends applicants
      // to localhost.
      const statusUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/admissions/status`;

      await sendApplicationReceivedEmail({
        to: application.email,
        fullName: application.fullName,
        referenceNumber: application.referenceNumber,
        program: application.program,
        submittedAt: application.createdAt,
        statusUrl,
      });
    } catch (error) {
      console.error('[mailer] Failed to send application confirmation:', error.message);
    }

    res.status(201).json({ application });
  }),
);

/**
 * Public status check — no session required.
 *
 * Reference number AND matching email are both needed, so knowing (or
 * guessing) a reference number alone reveals nothing. The reply carries only
 * the five fields below: never the applicant's CNIC, phone, address or
 * documents, since anyone can call this.
 */
router.post(
  '/status',
  asyncHandler(async (req, res) => {
    const callerIp = req.ip ?? 'unknown';

    if (isRateLimited(callerIp)) {
      return res
        .status(429)
        .json({ message: 'Too many failed status checks. Please wait a few minutes and try again.' });
    }

    const referenceNumber = (req.body?.referenceNumber ?? '').toString().trim();
    const email = (req.body?.email ?? '').toString().trim().toLowerCase();

    if (!referenceNumber || !email) {
      return res
        .status(400)
        .json({ message: 'Reference number and email address are both required.' });
    }

    // One message for every failure: a wrong email and an unknown reference
    // number must be indistinguishable from the outside.
    const notFound = {
      message:
        'We could not find an application with that reference number and email address. Please check both and try again.',
    };

    const application = await Application.findOne({ referenceNumber });

    if (!application || (application.email ?? '').trim().toLowerCase() !== email) {
      recordFailure(callerIp);
      return res.status(404).json(notFound);
    }

    const review = await readSyncedReview(application);

    res.json({
      application: {
        fullName: application.fullName,
        referenceNumber: application.referenceNumber,
        program: application.program,
        status: review.status,
        publicReason: review.publicReason,
        submittedAt: application.createdAt,
      },
    });
  }),
);

/**
 * A signed link to the caller's own photograph, valid for a few minutes.
 *
 * The bucket is private, so a stored path is useless to the browser on its
 * own. Scoped to the session owner and to the photo they uploaded — no path
 * is accepted from the client, so this cannot be pointed at anyone else.
 */
router.get(
  '/me/photo',
  requireAuth,
  asyncHandler(async (req, res) => {
    const application = await Application.findOne({ user: req.userId });

    if (!application?.photoPath || !supabase) {
      return res.json({ url: null });
    }

    const { data, error } = await supabase.storage
      .from(UPLOAD_BUCKET)
      .createSignedUrl(application.photoPath, 300);

    if (error) {
      console.error('[uploads] Signed URL failed:', error.message);
      return res.json({ url: null });
    }

    res.json({ url: data.signedUrl });
  }),
);

router.delete(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    await Application.deleteOne({ user: req.userId });
    res.status(204).end();
  }),
);

export default router;
