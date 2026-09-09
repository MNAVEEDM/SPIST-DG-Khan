import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import { TextField } from '../components/AdmissionFormFields';
import { Check, Mail } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';
import { checkApplicationStatus } from '../data/admissionAuth';

/* ---------------------------------------------------------------------------
 * Public application status check.
 *
 * No account needed: the reference number alone isn't enough, so the matching
 * email address stands in for a password. The server returns a fixed handful of
 * fields — never the reviewer's private note — so nothing sensitive can appear here.
 * ------------------------------------------------------------------------ */

const STATUS_DISPLAY = {
  pending: {
    label: 'Pending Review',
    badge: 'border-amber-300 bg-amber-50 text-amber-800',
    note: 'Your application has been received and is waiting to be reviewed by the admissions office. No action is needed from you right now.',
  },
  approved: {
    label: 'Approved',
    badge: 'border-spist-green/25 bg-spist-green/10 text-spist-green',
    note: 'Your application has been approved. The admissions office will be in touch about enrolment and the documents to bring with you.',
  },
  rejected: {
    label: 'Not Successful',
    badge: 'border-spist-maroon/25 bg-spist-maroon/10 text-spist-maroon',
    note: 'Your application was not successful this time. You are welcome to contact the admissions office if you would like to discuss it.',
  },
};

const UNKNOWN_STATUS = {
  label: 'In Progress',
  badge: 'border-spist-line bg-spist-accent-soft/60 text-spist-charcoal',
  note: 'Your application is with the admissions office. Contact them if you need an update before hearing back.',
};

/** What the applicant should understand about the fee, in one line each. */
const PAYMENT_DISPLAY = {
  unpaid: ['Not paid yet', 'text-amber-800'],
  claimed: ['Awaiting verification', 'text-sky-800'],
  verified: ['Verified', 'text-spist-green'],
  rejected: ['Not found — please contact the office', 'text-spist-maroon'],
};

function formatSubmittedAt(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ApplicationStatusPage() {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  const [values, setValues] = useState({ referenceNumber: '', email: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setChecking(true);
    setError('');
    setResult(null);

    try {
      setResult(await checkApplicationStatus(values));
    } catch (lookupError) {
      setError(lookupError.message);
    } finally {
      setChecking(false);
    }
  };

  const display = result ? (STATUS_DISPLAY[result.status] ?? UNKNOWN_STATUS) : null;

  return (
    <>
      <PageBanner
        title={entry?.label ?? 'Application Status'}
        trail={entry?.trail ?? ['Admissions', 'Application Status']}
        intro="Already applied? Check where your application stands using your reference number and the email address you applied with."
      />

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <div className="rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9">
                <h2 className="font-display text-2xl font-bold">Check Your Application</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-spist-muted">
                  Enter both details exactly as they appear on your confirmation. We ask for the
                  email address as well so that nobody else can look up your application.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                  <TextField
                    id="referenceNumber"
                    label="Reference Number"
                    required
                    value={values.referenceNumber}
                    onChange={handleChange}
                    placeholder="SPIST-2026-0000"
                  />

                  <TextField
                    id="email"
                    label="Email Address"
                    type="email"
                    required
                    value={values.email}
                    onChange={handleChange}
                    autoComplete="email"
                    icon={Mail}
                  />

                  {error && (
                    <p role="alert" className="text-[13.5px] font-medium text-spist-maroon">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={checking}
                    className="btn-primary w-full disabled:opacity-70 sm:w-auto"
                  >
                    <Check width="15" height="15" />
                    {checking ? 'Checking…' : 'Check Status'}
                  </button>
                </form>
              </div>
            </Reveal>

            {result && (
              <div className="pop-in mt-6 rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-spist-muted">
                      Application Status
                    </p>
                    <h2 className="mt-1.5 font-display text-2xl font-bold text-spist-charcoal">
                      {result.fullName}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-bold ${display.badge}`}
                  >
                    {display.label}
                  </span>
                </div>

                <p className="mt-5 text-[14.5px] leading-relaxed text-spist-muted">{display.note}</p>

                {result.publicReason && (
                  <div className="mt-5 rounded-lg border-l-4 border-spist-accent bg-spist-accent-soft/60 p-4">
                    <p className="text-[11.5px] font-bold uppercase tracking-wider text-spist-muted">
                      Message from the admissions office
                    </p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-spist-charcoal">
                      {result.publicReason}
                    </p>
                  </div>
                )}

                <dl className="mt-6 grid gap-x-6 gap-y-4 border-t border-spist-line pt-6 text-[14px] sm:grid-cols-2">
                  <StatusRow label="Reference Number" value={result.referenceNumber} mono />
                  <StatusRow label="Submitted On" value={formatSubmittedAt(result.submittedAt)} />
                  <StatusRow label="Program Applied For" value={result.program} full />

                  {result.voucherNumber && (
                    <>
                      <StatusRow label="Fee Voucher" value={result.voucherNumber} mono />
                      <div>
                        <dt className="text-[11.5px] font-bold uppercase tracking-wider text-spist-muted">
                          Admission Fee
                        </dt>
                        <dd
                          className={`mt-0.5 font-medium ${
                            (PAYMENT_DISPLAY[result.paymentStatus] ?? PAYMENT_DISPLAY.unpaid)[1]
                          }`}
                        >
                          {(PAYMENT_DISPLAY[result.paymentStatus] ?? PAYMENT_DISPLAY.unpaid)[0]}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            )}

            <p className="mt-6 text-center text-[13.5px] text-spist-muted">
              Haven't applied yet?{' '}
              <Link
                to="/admissions/online"
                className="font-semibold text-spist-green transition-colors hover:text-spist-accent hover:underline"
              >
                Start your online application
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function StatusRow({ label, value, full, mono }) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <dt className="text-[11.5px] font-bold uppercase tracking-wider text-spist-muted">{label}</dt>
      <dd className={`mt-0.5 font-medium text-spist-charcoal ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </dd>
    </div>
  );
}
