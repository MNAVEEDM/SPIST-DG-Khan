import { useState } from 'react';
import { TextField, TextAreaField } from './AdmissionFormFields';
import { Check } from './Icons';
import { claimFeePayment, uploadAdmissionFile } from '../data/admissionAuth';
import { printFeeVoucher } from '../utils/admissionPrint';
import { admissionFee } from '../data/site';

/* ---------------------------------------------------------------------------
 * Admission fee: print the voucher, pay it at the bank, then tell us.
 *
 * Four states, and the applicant only ever drives the first two:
 *   unpaid   — the voucher is waiting to be paid
 *   claimed  — they say they have paid; the office has not checked yet
 *   verified — an admissions officer matched it against the bank statement
 *   rejected — the office could not find the payment
 *
 * Only the office can reach `verified`, which is why nothing here pretends a
 * fee is settled just because somebody pressed a button.
 * ------------------------------------------------------------------------ */

const STATES = {
  unpaid: {
    label: 'Not paid yet',
    badge: 'border-amber-300 bg-amber-50 text-amber-800',
    note: 'Print the voucher below and deposit the fee at any UBL branch. Once you have paid, come back and enter your deposit slip number.',
  },
  claimed: {
    label: 'Awaiting verification',
    badge: 'border-sky-300 bg-sky-50 text-sky-800',
    note: 'Thank you — we have your payment details. The admissions office is checking them against the bank statement. Nothing further is needed from you.',
  },
  verified: {
    label: 'Payment verified',
    badge: 'border-spist-green/25 bg-spist-green/10 text-spist-green',
    note: 'Your admission fee has been confirmed. Your application is now with the admissions office for a decision.',
  },
  rejected: {
    label: 'Payment not found',
    badge: 'border-spist-maroon/25 bg-spist-maroon/10 text-spist-maroon',
    note: 'The admissions office could not match this payment against the bank statement. Please check your deposit slip and submit the details again, or contact the office.',
  },
};

function rupees(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) return '';
  return `Rs ${value.toLocaleString('en-PK')}`;
}

export default function AdmissionFeePanel({ submission, onUpdated }) {
  const [values, setValues] = useState({ paymentReference: '', paymentNote: '' });
  const [receipt, setReceipt] = useState(null); // { path, name }
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // An application made before vouchers existed simply has no fee to show.
  if (!submission.voucherNumber) return null;

  const status = submission.paymentStatus || 'unpaid';
  const state = STATES[status] ?? STATES.unpaid;
  const canPay = status === 'unpaid' || status === 'rejected';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleVoucher = () => {
    setError('');
    try {
      printFeeVoucher({ submission, fee: admissionFee });
    } catch (printError) {
      setError(printError.message);
    }
  };

  const handleReceipt = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const uploaded = await uploadAdmissionFile({ file, slot: 'receipt' });
      setReceipt({ path: uploaded.path, name: uploaded.name });
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.paymentReference.trim()) {
      setError('Please enter the deposit slip or transaction number from the bank.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const updated = await claimFeePayment({
        paymentReference: values.paymentReference.trim(),
        paymentNote: values.paymentNote.trim(),
        paymentReceiptPath: receipt?.path ?? '',
      });
      onUpdated(updated);
    } catch (claimError) {
      setError(claimError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border-t border-spist-line pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-spist-muted">
            Admission Fee
          </h3>
          <p className="mt-1.5 font-display text-xl font-bold text-spist-charcoal">
            {rupees(submission.voucherAmount || admissionFee.amount)}
            <span className="ml-2 font-mono text-[13px] font-medium text-spist-muted">
              {submission.voucherNumber}
            </span>
          </p>
        </div>

        <span className={`shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-bold ${state.badge}`}>
          {state.label}
        </span>
      </div>

      <p className="mt-3 text-[14px] leading-relaxed text-spist-muted">{state.note}</p>

      {status === 'claimed' && submission.paymentReference && (
        <p className="mt-2 text-[13.5px] text-spist-muted">
          Your reference:{' '}
          <strong className="font-mono font-semibold text-spist-charcoal">
            {submission.paymentReference}
          </strong>
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleVoucher} className="btn-ghost">
          Download Fee Voucher
        </button>
      </div>

      {canPay && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 rounded-lg border border-spist-line p-5" noValidate>
          <div>
            <h4 className="text-[14px] font-bold text-spist-charcoal">Already paid it?</h4>
            <p className="mt-1 text-[13px] text-spist-muted">
              Enter the deposit slip or transaction number printed on your bank receipt. The
              admissions office will check it against the bank statement.
            </p>
          </div>

          <TextField
            id="paymentReference"
            label="Deposit Slip / Transaction Number"
            required
            value={values.paymentReference}
            onChange={handleChange}
            placeholder="e.g. UBL-DEP-77219"
          />

          <TextAreaField
            id="paymentNote"
            label="Note for the admissions office (optional)"
            value={values.paymentNote}
            onChange={handleChange}
            rows={2}
            placeholder="e.g. Deposited at the DG Khan branch on 9 September"
          />

          <div>
            <p className="mb-1.5 block text-[13.5px] font-semibold text-spist-charcoal">
              Photo of the deposit slip (optional)
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="receipt-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleReceipt}
                className="sr-only"
              />
              <label
                htmlFor="receipt-file"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-spist-line bg-white px-3.5 py-2 text-[13px] font-semibold text-spist-green transition-colors hover:border-spist-accent hover:bg-spist-accent-soft/40"
              >
                {receipt ? 'Replace slip' : 'Attach slip'}
              </label>

              {uploading && <span className="text-[13px] text-spist-muted">Uploading…</span>}

              {receipt && !uploading && (
                <span className="flex items-center gap-1.5 text-[13px] text-spist-green">
                  <Check width="12" height="12" strokeWidth={3} />
                  {receipt.name || 'Attached'}
                </span>
              )}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-[13.5px] font-medium text-spist-maroon">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting || uploading} className="btn-primary disabled:opacity-70">
            <Check width="15" height="15" />
            {submitting ? 'Sending…' : 'I have paid this voucher'}
          </button>
        </form>
      )}

      {!canPay && error && (
        <p role="alert" className="mt-3 text-[13.5px] font-medium text-spist-maroon">
          {error}
        </p>
      )}
    </div>
  );
}
