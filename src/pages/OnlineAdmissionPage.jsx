import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import AdmissionAuthGate from '../components/AdmissionAuthGate';
import AdmissionWizard from '../components/AdmissionWizard';
import { Check, Mail, Phone } from '../components/Icons';
import { navEntryFor } from '../data/navUtils';
import { institution } from '../data/site';
import {
  clearApplication,
  clearSession,
  getApplication,
  getSession,
  saveApplication,
} from '../data/admissionAuth';

/* ---------------------------------------------------------------------------
 * Typical documents requested at admission time in Pakistani HEC-recognized
 * institutes. // PLACEHOLDER — confirm the exact checklist with the SPIST
 * admissions/administration office and update if it differs.
 * ------------------------------------------------------------------------ */
const REQUIRED_DOCUMENTS = [
  'Copy of CNIC / B-Form (applicant)',
  "Copy of parent's / guardian's CNIC",
  '4 recent passport-size photographs',
  'Attested copies of academic certificates & transcripts',
  'Domicile certificate',
];

function emptyForm(account) {
  return {
    fullName: account?.fullName ?? '',
    fatherName: '',
    cnic: '',
    dob: '',
    gender: '',
    phone: '',
    email: account?.email ?? '',
    address: '',
    qualification: '',
    program: '',
    declaration: false,
    photoPath: '',
    documents: [],
    // View-only companions to photoPath: a local blob URL for the preview and
    // the original filename. Neither is sent to the server.
    photoPreview: '',
    photoName: '',
  };
}

/**
 * Applying now requires an account: log in / create an account first, then
 * complete a 4-step application. Accounts, sessions and applications are
 * handled by a real Express + MongoDB backend (see /server and
 * `src/data/admissionAuth.js`) — nothing here is stored only in the browser
 * anymore, aside from the session token itself.
 */
export default function OnlineAdmissionPage() {
  const { pathname } = useLocation();
  const entry = navEntryFor(pathname);

  const [account, setAccount] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Resume a session (and any saved application) already on this device.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const existingAccount = await getSession();
      if (cancelled) return;

      if (existingAccount) {
        setAccount(existingAccount);
        try {
          setSubmission(await getApplication());
        } catch (error) {
          if (!cancelled) setLoadError(error.message);
        }
      }
      if (!cancelled) setCheckingSession(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAuthenticated = async (nextAccount) => {
    setAccount(nextAccount);
    setLoadError('');
    try {
      setSubmission(await getApplication());
    } catch (error) {
      setLoadError(error.message);
    }
  };

  const handleLogout = () => {
    clearSession();
    setAccount(null);
    setSubmission(null);
  };

  const handleWizardSubmit = async (form) => {
    const application = await saveApplication(form);
    setSubmission(application);
  };

  const handleStartNewApplication = async () => {
    await clearApplication();
    setSubmission(null);
  };

  return (
    <>
      <PageBanner
        title={entry?.label ?? 'Online Admission'}
        trail={entry?.trail ?? ['Admissions', 'Online Admission']}
        intro="Create an account or log in, then complete your application in four short steps."
      />

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-8">
              {loadError && (
                <div
                  className="mb-6 rounded-lg border-l-4 border-spist-maroon bg-spist-maroon/5 p-4 text-[13.5px] text-spist-charcoal"
                  role="alert"
                >
                  {loadError}
                </div>
              )}

              {checkingSession ? null : !account ? (
                <AdmissionAuthGate onAuthenticated={handleAuthenticated} />
              ) : submission ? (
                <ConfirmationPanel
                  submission={submission}
                  onStartNewApplication={handleStartNewApplication}
                  onLogout={handleLogout}
                />
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold">Student Application Form</h2>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-spist-muted">
                        Welcome, {account.fullName || account.email}. Complete each step below.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="shrink-0 text-[13px] font-semibold text-spist-muted transition-colors hover:text-spist-maroon"
                    >
                      Log Out
                    </button>
                  </div>

                  <AdmissionWizard
                    account={account}
                    initialValues={emptyForm(account)}
                    onSubmit={handleWizardSubmit}
                  />
                </>
              )}
            </Reveal>

            <ApplicationSidebar />
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Confirmation state — shown once an account has a saved application.
 * ------------------------------------------------------------------------ */
function ConfirmationPanel({ submission, onStartNewApplication, onLogout }) {
  return (
    <div className="pop-in rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <span
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-spist-green/10 text-spist-green"
          aria-hidden="true"
        >
          <Check width="26" height="26" strokeWidth={3} />
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 text-[13px] font-semibold text-spist-muted transition-colors hover:text-spist-maroon"
        >
          Log Out
        </button>
      </div>

      <h2 className="mt-5 font-display text-2xl font-bold text-spist-charcoal">
        Application Received
      </h2>

      <p className="mt-3 text-[15px] leading-[1.85] text-spist-muted">
        Thank you, {submission.fullName}. Your application details have been recorded with
        reference number{' '}
        <strong className="font-mono font-semibold text-spist-charcoal">
          {submission.referenceNumber}
        </strong>
        .
      </p>

      <div
        className="mt-5 rounded-lg border-l-4 border-spist-accent bg-spist-accent-soft/60 p-5"
        role="note"
      >
        <p className="text-[14px] leading-relaxed text-spist-charcoal">
          Your application has been saved to the SPIST admissions database against your account.
          Please keep your reference number for your records — if you need to follow up before
          hearing back, contact the admissions office using the details opposite.
        </p>
      </div>

      <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-spist-line pt-6 text-[14px] sm:grid-cols-2">
        <SummaryRow label="Father's Name" value={submission.fatherName} />
        <SummaryRow label="CNIC / B-Form" value={submission.cnic} />
        <SummaryRow label="Date of Birth" value={submission.dob} />
        <SummaryRow label="Gender" value={submission.gender} />
        <SummaryRow label="Contact Number" value={submission.phone} />
        <SummaryRow label="Email" value={submission.email} />
        <SummaryRow label="Program Applied For" value={submission.program} full />
        <SummaryRow label="Previous Qualification" value={submission.qualification} full />
      </dl>

      <UploadedSummary submission={submission} />

      <button type="button" onClick={onStartNewApplication} className="btn-ghost mt-7">
        Submit Another Application
      </button>
    </div>
  );
}

/**
 * Applications submitted before uploads existed have no photo and no
 * documents, so everything here is read defensively and the block simply
 * disappears when there is nothing to show.
 */
function UploadedSummary({ submission }) {
  const documents = submission.documents ?? [];
  const hasPhoto = Boolean(submission.photoPath);

  if (!hasPhoto && documents.length === 0) return null;

  return (
    <div className="mt-6 border-t border-spist-line pt-6">
      <h3 className="text-[12px] font-bold uppercase tracking-wider text-spist-muted">
        Uploaded Files
      </h3>
      <ul className="mt-3 space-y-2 text-[14px]">
        {hasPhoto && (
          <li className="flex items-start gap-2.5">
            <span className="mt-1 text-spist-green" aria-hidden="true">
              <Check width="12" height="12" strokeWidth={3} />
            </span>
            <span className="text-spist-muted">Applicant photograph</span>
          </li>
        )}
        {documents.map((doc) => (
          <li key={doc.path} className="flex items-start gap-2.5">
            <span className="mt-1 text-spist-green" aria-hidden="true">
              <Check width="12" height="12" strokeWidth={3} />
            </span>
            <span className="text-spist-muted">
              {doc.label || 'Document'}
              {doc.name ? <span className="text-spist-muted/70"> · {doc.name}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummaryRow({ label, value, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <dt className="text-[12px] font-bold uppercase tracking-wider text-spist-muted">{label}</dt>
      <dd className="mt-0.5 font-medium text-spist-charcoal">{value}</dd>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Sidebar — required documents checklist + admissions contact details.
 * A bespoke sidebar rather than the shared `PageSidebar` component, since
 * PageSidebar's "Apply Online" call-to-action would just point back at the
 * page the applicant is already on.
 * ------------------------------------------------------------------------ */
function ApplicationSidebar() {
  return (
    <Reveal delay={120} className="lg:col-span-4">
      <div className="sticky top-32 space-y-5">
        <div className="overflow-hidden rounded-xl border border-spist-line shadow-card">
          <h2 className="bg-spist-green px-6 py-4 font-display text-base font-bold text-white">
            Documents to Prepare
          </h2>

          <ul className="space-y-3 p-6">
            {REQUIRED_DOCUMENTS.map((doc) => (
              <li key={doc} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-spist-accent/20 text-spist-green"
                  aria-hidden="true"
                >
                  <Check width="12" height="12" strokeWidth={3} />
                </span>
                <span className="text-spist-muted">{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border border-spist-line shadow-card">
          <h2 className="bg-spist-maroon px-6 py-4 font-display text-base font-bold text-white">
            Admissions Help
          </h2>

          <div className="space-y-3.5 p-6">
            <p className="text-[14px] leading-relaxed text-spist-muted">
              Questions about eligibility, fees or the application process? Reach the admissions
              office Monday to Saturday, 8:00&nbsp;AM&nbsp;–&nbsp;4:00&nbsp;PM.
            </p>

            {institution.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/-/g, '')}`}
                className="flex items-center gap-2.5 text-[14px] font-medium text-spist-charcoal transition-colors hover:text-spist-green"
              >
                <Phone width="15" height="15" className="text-spist-accent" />
                {phone}
              </a>
            ))}

            <a
              href={`mailto:${institution.email}`}
              className="flex items-center gap-2.5 break-all text-[14px] font-medium text-spist-charcoal transition-colors hover:text-spist-green"
            >
              <Mail width="15" height="15" className="text-spist-accent" />
              {institution.email}
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
