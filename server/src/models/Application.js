import mongoose from 'mongoose';

/**
 * One admission application per user account. `user` is unique so each
 * account can only have a single application document — resubmitting
 * (see routes/applications.js) upserts onto the same record rather than
 * creating duplicates.
 */
const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    fatherName: { type: String, required: true },
    cnic: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    qualification: { type: String, required: true },
    program: { type: String, required: true },

    // The Smart-SMS course this application is for. `program` above keeps the
    // title as it read when the applicant chose it, so renaming a course later
    // never rewrites what somebody actually applied to. Applications made
    // before courses existed simply have an empty id.
    courseId: { type: String, default: '' },
    declaration: { type: Boolean, required: true },

    // Uploaded via routes/uploads.js — storage paths only, never public URLs,
    // since the bucket is private. Both are optional: an application submitted
    // before this existed simply has no photo and an empty documents list.
    photoPath: { type: String, default: '' },
    documents: {
      type: [
        {
          _id: false,
          slot: { type: String, required: true },
          label: { type: String, default: '' },
          path: { type: String, required: true },
          name: { type: String, default: '' },
          size: { type: Number, default: 0 },
        },
      ],
      default: [],
    },

    /* ---------------------------------------------------------------------
     * Admission fee voucher
     *
     * Minted once, when the application is first submitted, and kept across
     * resubmissions so an edit never invalidates a voucher already paid.
     *
     * The applicant CLAIMS payment here; an admissions officer VERIFIES it in
     * the dashboard, which owns the verified state the same way it owns the
     * application status. paymentStatus below is this side's copy and is
     * refreshed from that source whenever it is read.
     * ------------------------------------------------------------------ */
    voucherNumber: { type: String, default: '' },
    voucherAmount: { type: Number, default: 0 },
    voucherIssuedAt: { type: Date, default: null },

    paymentStatus: {
      type: String,
      enum: ['unpaid', 'claimed', 'verified', 'rejected'],
      default: 'unpaid',
    },
    paymentReference: { type: String, default: '' },
    paymentNote: { type: String, default: '' },
    paymentReceiptPath: { type: String, default: '' },
    paymentClaimedAt: { type: Date, default: null },

    referenceNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default mongoose.model('Application', applicationSchema);
