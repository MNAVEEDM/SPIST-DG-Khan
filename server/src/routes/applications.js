import { Router } from 'express';
import Application from '../models/Application.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { supabase, smsSchoolId, smsCampusId, isSmsConfigured } from '../supabase.js';
import { DOCUMENT_SLOTS } from './uploads.js';
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
];

/**
 * Documents arrive as whatever the browser posted, so only the fields the
 * application actually stores are kept, and only for slots that exist. An
 * entry without a storage path never made it past the upload route, so it is
 * dropped rather than saved as a broken reference.
 */
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
          declaration: Boolean(application.declaration),
          photo_url: application.photoPath || null,
          documents: application.documents ?? [],
        }, { onConflict: 'school_id,source,external_id' });

        if (error) console.error('[sms] Application sync failed:', error.message);
      } catch (error) {
        console.error('[sms] Application sync threw:', error.message);
      }
    }
    res.status(201).json({ application });
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
