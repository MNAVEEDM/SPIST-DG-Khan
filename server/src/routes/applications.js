import { Router } from 'express';
import Application from '../models/Application.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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
        user: req.userId,
        referenceNumber,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

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
