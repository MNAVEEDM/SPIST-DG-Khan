import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { supabase } from '../supabase.js';

/**
 * File uploads for the admission application — the applicant's photo and any
 * supporting documents.
 *
 * Files go into the private `admission-docs` bucket using the service-role
 * client, so the browser never holds a storage credential: it posts the file
 * here and gets back only the path to keep on its form. Nothing is public, and
 * nothing is written to the application itself — that happens on submit, in
 * routes/applications.js.
 */
const router = Router();

const BUCKET = 'admission-docs';
const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** The named document slots the form offers. `other` may repeat, the rest can't. */
export const DOCUMENT_SLOTS = {
  matric: 'Matric / O-Level Certificate',
  intermediate: 'Intermediate / A-Level Certificate',
  cnic: 'CNIC or B-Form',
  domicile: 'Domicile',
  character: 'Character Certificate',
  other: 'Other documents',
};

const PHOTO_SLOT = 'photo';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_TYPES = [...IMAGE_TYPES, 'application/pdf'];

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 1 },
  fileFilter(req, file, callback) {
    // A rejected type is reported as an error rather than `false`, so the
    // applicant is told why instead of getting a silent no-op.
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      callback(new Error('UNSUPPORTED_TYPE'));
      return;
    }
    callback(null, true);
  },
});

/**
 * multer signals a rejected file by erroring, which the central handler would
 * turn into a generic 500. Translating here keeps the message useful.
 */
function receiveFile(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (!error) return next();

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(413)
        .json({ message: 'That file is larger than 5 MB. Please upload a smaller copy.' });
    }
    if (error.message === 'UNSUPPORTED_TYPE') {
      return res
        .status(415)
        .json({ message: 'Only JPG, PNG, WEBP or PDF files can be uploaded.' });
    }
    return next(error);
  });
}

router.post(
  '/',
  requireAuth,
  receiveFile,
  asyncHandler(async (req, res) => {
    // The storage client and the Smart-SMS sync share one set of credentials,
    // so an unconfigured server has no bucket to write to.
    if (!supabase) {
      return res
        .status(503)
        .json({ message: 'File uploads are not available right now. Please try again later.' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file was received.' });
    }

    const slot = (req.body?.slot ?? '').toString().trim();
    const isPhoto = slot === PHOTO_SLOT;

    if (!isPhoto && !DOCUMENT_SLOTS[slot]) {
      return res.status(400).json({ message: 'Unknown document type.' });
    }
    if (isPhoto && !IMAGE_TYPES.includes(file.mimetype)) {
      return res.status(415).json({ message: 'The photo must be a JPG, PNG or WEBP image.' });
    }

    // Only "other" carries a label the applicant typed; the rest are fixed.
    const typedLabel = (req.body?.label ?? '').toString().trim().slice(0, 120);
    const label = isPhoto
      ? 'Applicant Photo'
      : slot === 'other'
        ? typedLabel || DOCUMENT_SLOTS.other
        : DOCUMENT_SLOTS[slot];

    const path = `${req.userId}/${slot}-${Date.now()}.${EXTENSIONS[file.mimetype]}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

    if (error) {
      console.error('[uploads] Storage upload failed:', error.message);
      return res.status(502).json({ message: 'The file could not be stored. Please try again.' });
    }

    res.status(201).json({
      path,
      name: (file.originalname ?? '').slice(0, 200),
      size: file.size,
      slot,
      label,
    });
  }),
);

export default router;
