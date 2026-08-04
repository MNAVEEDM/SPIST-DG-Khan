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
    declaration: { type: Boolean, required: true },
    referenceNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default mongoose.model('Application', applicationSchema);
