import { Router } from 'express';
import crypto from 'node:crypto';
import Application from '../models/Application.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { supabase, smsSchoolId, smsCampusId, isSmsConfigured } from '../supabase.js';
import { DOCUMENT_SLOTS, UPLOAD_BUCKET } from './uploads.js';
import { sendApplicationReceivedEmail, sendPaymentClaimEmail } from '../utils/mailer.js';
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
  // The dashboard owns both decisions: whether the application is approved,
  // and whether the fee has actually landed in the bank. This side only ever
  // records what the applicant claims, so both are read back from there.
  const unreviewed = {
    status: 'pending',
    publicReason: '',
    paymentStatus: application.paymentStatus || "unpaid",
  };
  if (!isSmsConfigured) return unreviewed;

  // Never `admin_note`: that is the reviewer's private scratchpad and must
  // not leave the dashboard, so it is never selected.
  const read = (columns) =>
    supabase
      .from('admission_applications')
      .select(columns)
      .eq('school_id', smsSchoolId)
      .eq('external_id', application._id.toString())
      .maybeSingle();

  try {
    let { data, error } = await read('status, public_reason, payment_status');

    // payment_status arrived with the voucher migration. Until that has been
    // applied, fall back to the older shape rather than losing the decision
    // itself — an approved application must not read as pending.
    if (error && /payment_status/.test(error.message ?? '')) {
      ({ data, error } = await read('status, public_reason'));
    }

    if (error) throw new Error(error.message);
    if (!data) return unreviewed;

    return {
      status: data.status || 'pending',
      publicReason: (data.public_reason ?? '').toString().trim(),
      paymentStatus: data.payment_status || unreviewed.paymentStatus,
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

/* ---------------------------------------------------------------------------
 * Admission fee voucher
 *
 * One voucher per application, minted the first time it is submitted. The
 * amount is configurable because a fee is a policy, not a constant.
 * ------------------------------------------------------------------------ */
const VOUCHER_AMOUNT = Number(process.env.ADMISSION_FEE_AMOUNT ?? 1500);

const PAYMENT_STATES = ["unpaid", "claimed", "verified", "rejected"];

/** SPIST-V-2026-483920 — distinct on sight from a SPIST-2026-8143 reference. */
function newVoucherNumber() {
  return `SPIST-V-${new Date().getFullYear()}-${crypto.randomInt(100000, 1000000)}`;
}

/** Columns added by sql/2026-09-09-admission-fee-vouchers.sql. */
const VOUCHER_SYNC_COLUMNS = [
  'voucher_number',
  'voucher_amount',
  'voucher_issued_at',
  'payment_status',
  'payment_reference',
  'payment_note',
  'payment_receipt_url',
  'payment_claimed_at',
];

/** The application as the dashboard stores it. */
function applicationRow(application) {
  return {
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

    voucher_number: application.voucherNumber || null,
    voucher_amount: application.voucherAmount || null,
    voucher_issued_at: application.voucherIssuedAt || null,
    payment_status: application.paymentStatus || 'unpaid',
    payment_reference: application.paymentReference || null,
    payment_note: application.paymentNote || null,
    payment_receipt_url: application.paymentReceiptPath || null,
    payment_claimed_at: application.paymentClaimedAt || null,
  };
}

/**
 * Mirrors an application into the dashboard.
 *
 * The voucher columns are newer than this code, so a database that has not
 * had the migration applied yet is retried without them rather than losing
 * the whole row. Same idea as writeTolerant in the dashboard itself.
 */
async function syncApplication(application) {
  const row = applicationRow(application);
  const upsert = (body) =>
    supabase
      .from('admission_applications')
      .upsert(body, { onConflict: 'school_id,source,external_id' });

  let { error } = await upsert(row);
  if (!error) return;

  const missingColumn =
    error.code === 'PGRST204' || /Could not find the '.*' column/.test(error.message ?? '');
  if (!missingColumn) throw new Error(error.message);

  console.warn(
    '[sms] Voucher columns are missing — run sql/2026-09-09-admission-fee-vouchers.sql. ' +
      'Syncing the application without them for now.',
  );

  const withoutVoucher = { ...row };
  VOUCHER_SYNC_COLUMNS.forEach((column) => delete withoutVoucher[column]);

  ({ error } = await upsert(withoutVoucher));
  if (error) throw new Error(error.message);
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

    // Kept across resubmissions, so a paid voucher survives an edit.
    const existing = await Application.findOne({ user: req.userId });

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
        voucherNumber: existing?.voucherNumber || newVoucherNumber(),
        voucherAmount: existing?.voucherAmount || VOUCHER_AMOUNT,
        voucherIssuedAt: existing?.voucherIssuedAt || new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    // Mirror into Smart-SMS so the school admin can review it there. Wrapped in
    // try/catch on purpose: a Supabase outage must never block an applicant's
    // submission — the row can be re-synced later.
    // Wrapped on purpose: a Supabase outage must never block an applicant
    // submitting — the row can be re-synced later.
    if (isSmsConfigured) {
      try {
        await syncApplication(application);
      } catch (error) {
        console.error('[sms] Application sync failed:', error.message);
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
        paymentStatus: review.paymentStatus,
        voucherNumber: application.voucherNumber || null,
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

/**
 * The applicant tells us they have paid the voucher into the bank.
 *
 * This records a CLAIM, nothing more. Money is only ever confirmed by an
 * admissions officer checking the bank statement and marking it verified in
 * the dashboard — this route cannot set that state, by design.
 */
router.post(
  '/me/payment',
  requireAuth,
  asyncHandler(async (req, res) => {
    const application = await Application.findOne({ user: req.userId });

    if (!application) {
      return res.status(404).json({ message: 'Submit your application before paying the fee.' });
    }
    if (!application.voucherNumber) {
      return res
        .status(400)
        .json({ message: 'This application has no fee voucher. Please contact the admissions office.' });
    }
    if (application.paymentStatus === 'verified') {
      return res
        .status(409)
        .json({ message: 'This fee has already been verified — nothing further is needed.' });
    }

    const paymentReference = (req.body?.paymentReference ?? '').toString().trim().slice(0, 80);
    if (!paymentReference) {
      return res.status(400).json({
        message: 'Please enter the deposit slip or transaction number from the bank.',
      });
    }

    application.paymentReference = paymentReference;
    application.paymentNote = (req.body?.paymentNote ?? '').toString().trim().slice(0, 400);
    application.paymentReceiptPath = (req.body?.paymentReceiptPath ?? '').toString().trim().slice(0, 300);
    application.paymentStatus = 'claimed';
    application.paymentClaimedAt = new Date();
    await application.save();

    if (isSmsConfigured) {
      try {
        await syncApplication(application);
      } catch (error) {
        console.error('[sms] Payment claim sync failed:', error.message);
      }
    }

    try {
      await sendPaymentClaimEmail({
        to: application.email,
        fullName: application.fullName,
        voucherNumber: application.voucherNumber,
        amount: application.voucherAmount,
        paymentReference: application.paymentReference,
      });
    } catch (error) {
      console.error('[mailer] Failed to send payment acknowledgement:', error.message);
    }

    res.json({ application });
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
