import { useState } from 'react';
import { SelectField, TextAreaField, TextField } from './AdmissionFormFields';
import { Calendar, Check, ChevronLeft, ChevronRight, Mail, Phone } from './Icons';
import { faculties, diplomaPrograms, certificateCourses } from '../data/site';

/* ---------------------------------------------------------------------------
 * Program options — built from `site.js`, never hardcoded here. Adding or
 * removing a degree, diploma or certificate in site.js automatically updates
 * this form's program selector.
 * ------------------------------------------------------------------------ */
const degreeOptions = faculties.flatMap((faculty) =>
  faculty.programs.map((program) => ({
    value: `Degree Program: ${program.name}`,
    label: `${program.name} — ${program.degreeType}`,
  })),
);

const diplomaOptions = diplomaPrograms.items.map((item) => ({
  value: `Six-Month Diploma: ${item.name}`,
  label: item.name,
}));

const certificateOptions = certificateCourses.items.map((item) => ({
  value: `Three-Month Certificate: ${item.name}`,
  label: item.name,
}));

const STEPS = [
  { id: 'personal', label: 'Personal' },
  { id: 'contact', label: 'Contact' },
  { id: 'academic', label: 'Program' },
  { id: 'review', label: 'Review' },
];

const STEP_FIELDS = {
  personal: ['fullName', 'fatherName', 'cnic', 'dob', 'gender'],
  contact: ['phone', 'email', 'address'],
  academic: ['qualification', 'program'],
  review: ['declaration'],
};

/** Formats digits-only input into the standard NNNNN-NNNNNNN-N CNIC pattern as the user types. */
function formatCnic(rawValue) {
  const digits = rawValue.replace(/\D/g, '').slice(0, 13);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 12);
  const part3 = digits.slice(12, 13);
  return [part1, part2, part3].filter(Boolean).join('-');
}

function validateAll(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Applicant's full name is required.";
  } else if (!/^[A-Za-z\s.'-]{3,60}$/.test(values.fullName.trim())) {
    errors.fullName = 'Enter a valid name using letters only.';
  }

  if (!values.fatherName.trim()) {
    errors.fatherName = "Father's name is required.";
  } else if (!/^[A-Za-z\s.'-]{3,60}$/.test(values.fatherName.trim())) {
    errors.fatherName = 'Enter a valid name using letters only.';
  }

  const cnicDigits = values.cnic.replace(/\D/g, '');
  if (!cnicDigits) {
    errors.cnic = 'CNIC / B-Form number is required.';
  } else if (cnicDigits.length !== 13) {
    errors.cnic = 'CNIC / B-Form number must have 13 digits (NNNNN-NNNNNNN-N).';
  }

  if (!values.dob) {
    errors.dob = 'Date of birth is required.';
  } else {
    const dobDate = new Date(values.dob);
    const ageInYears = (Date.now() - dobDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (dobDate > new Date()) {
      errors.dob = 'Date of birth cannot be in the future.';
    } else if (ageInYears < 10 || ageInYears > 80) {
      errors.dob = 'Please enter a valid date of birth.';
    }
  }

  if (!values.gender) {
    errors.gender = 'Please select a gender.';
  }

  const phoneDigits = values.phone.replace(/[\s-]/g, '');
  if (!phoneDigits) {
    errors.phone = 'Contact number is required.';
  } else if (!/^(\+92\d{10}|0\d{9,10})$/.test(phoneDigits)) {
    errors.phone = 'Enter a valid Pakistani number, e.g. 0300-1234567.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.address.trim()) {
    errors.address = 'Residential address is required.';
  } else if (values.address.trim().length < 10) {
    errors.address = 'Enter a complete address.';
  }

  if (!values.qualification.trim()) {
    errors.qualification = 'Previous qualification / last school attended is required.';
  }

  if (!values.program) {
    errors.program = 'Please select a program to apply for.';
  }

  if (!values.declaration) {
    errors.declaration = 'You must confirm the declaration to submit the application.';
  }

  return errors;
}

/**
 * Multi-step application form: Personal → Contact → Program → Review.
 * Each step is validated before the applicant can continue, and the visible
 * step remounts on a changing `key` so the `.step-enter` CSS animation
 * (see index.css) replays automatically on every transition.
 */
export default function AdmissionWizard({ account, initialValues, onSubmit }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const currentStep = STEPS[stepIndex];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : name === 'cnic' ? formatCnic(value) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const goToStepWithFirstError = (allErrors) => {
    const firstInvalidStep = STEPS.find((step) => STEP_FIELDS[step.id].some((field) => allErrors[field]));
    if (firstInvalidStep) setStepIndex(STEPS.indexOf(firstInvalidStep));
  };

  const handleContinue = () => {
    const allErrors = validateAll(form);
    const stepErrorKeys = STEP_FIELDS[currentStep.id].filter((field) => allErrors[field]);

    if (stepErrorKeys.length > 0) {
      setErrors((prev) => ({ ...prev, ...allErrors }));
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((prev) => prev - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const allErrors = validateAll(form);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      goToStepWithFirstError(allErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit(form);
    } catch (error) {
      setSubmitError(error.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13.5px] text-spist-muted">
          Signed in as <strong className="font-semibold text-spist-charcoal">{account.email}</strong>
        </p>
      </div>

      {/* ---------- Progress ---------- */}
      <div className="mb-8">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-spist-line">
          <div
            className="h-full rounded-full bg-spist-green transition-all duration-500 ease-out"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <ol className="mt-4 grid grid-cols-4 gap-2">
          {STEPS.map((step, index) => {
            const isDone = index < stepIndex;
            const isCurrent = index === stepIndex;
            return (
              <li key={step.id} className="flex flex-col items-center gap-1.5 text-center">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-300 ${
                    isDone
                      ? 'bg-spist-green text-white'
                      : isCurrent
                        ? 'border-2 border-spist-green text-spist-green'
                        : 'border border-spist-line text-spist-muted'
                  }`}
                >
                  {isDone ? <Check width="13" height="13" strokeWidth={3} /> : index + 1}
                </span>
                <span
                  className={`text-[11.5px] font-semibold ${
                    isCurrent ? 'text-spist-charcoal' : 'text-spist-muted'
                  }`}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div key={currentStep.id} className="step-enter min-h-[320px] space-y-5">
          {currentStep.id === 'personal' && (
            <>
              <h2 className="font-display text-xl font-bold">Personal Information</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="fullName"
                  label="Full Name"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  autoComplete="name"
                />
                <TextField
                  id="fatherName"
                  label="Father's Name"
                  required
                  value={form.fatherName}
                  onChange={handleChange}
                  error={errors.fatherName}
                />
                <TextField
                  id="cnic"
                  label="CNIC / B-Form Number"
                  required
                  value={form.cnic}
                  onChange={handleChange}
                  error={errors.cnic}
                  placeholder="XXXXX-XXXXXXX-X"
                  inputMode="numeric"
                  maxLength={15}
                />
                <TextField
                  id="dob"
                  label="Date of Birth"
                  type="date"
                  required
                  value={form.dob}
                  onChange={handleChange}
                  error={errors.dob}
                  icon={Calendar}
                />
                <SelectField
                  id="gender"
                  label="Gender"
                  required
                  value={form.gender}
                  onChange={handleChange}
                  error={errors.gender}
                  placeholder="Select gender"
                  options={[
                    { value: 'Female', label: 'Female' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
              </div>
            </>
          )}

          {currentStep.id === 'contact' && (
            <>
              <h2 className="font-display text-xl font-bold">Contact Information</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="phone"
                  label="Contact Number"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="0300-1234567"
                  icon={Phone}
                />
                <TextField
                  id="email"
                  label="Email Address"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  autoComplete="email"
                  icon={Mail}
                />
              </div>
              <TextAreaField
                id="address"
                label="Residential Address"
                required
                value={form.address}
                onChange={handleChange}
                error={errors.address}
                rows={3}
                placeholder="House / street, city, district"
              />
            </>
          )}

          {currentStep.id === 'academic' && (
            <>
              <h2 className="font-display text-xl font-bold">Academic Background & Program</h2>
              <TextField
                id="qualification"
                label="Previous Qualification / Last School or College Attended"
                required
                value={form.qualification}
                onChange={handleChange}
                error={errors.qualification}
                placeholder="e.g. FSc Pre-Medical, Govt. College DG Khan"
              />
              <SelectField
                id="program"
                label="Program Applying For"
                required
                value={form.program}
                onChange={handleChange}
                error={errors.program}
                placeholder="Select a program"
                optionGroups={[
                  { label: 'Degree Programs', options: degreeOptions },
                  { label: 'Six-Month Diploma Programs', options: diplomaOptions },
                  { label: 'Three-Month Certificate Courses', options: certificateOptions },
                ]}
              />
            </>
          )}

          {currentStep.id === 'review' && (
            <>
              <h2 className="font-display text-xl font-bold">Review & Submit</h2>
              <p className="text-[14px] leading-relaxed text-spist-muted">
                Please check your details before submitting. Use "Back" to correct anything.
              </p>

              <dl className="grid gap-x-6 gap-y-4 rounded-lg border border-spist-line bg-spist-accent-soft/30 p-5 text-[14px] sm:grid-cols-2">
                <ReviewRow label="Full Name" value={form.fullName} />
                <ReviewRow label="Father's Name" value={form.fatherName} />
                <ReviewRow label="CNIC / B-Form" value={form.cnic} />
                <ReviewRow label="Date of Birth" value={form.dob} />
                <ReviewRow label="Gender" value={form.gender} />
                <ReviewRow label="Contact Number" value={form.phone} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Address" value={form.address} full />
                <ReviewRow label="Previous Qualification" value={form.qualification} full />
                <ReviewRow label="Program Applied For" value={form.program} full />
              </dl>

              <div>
                <label htmlFor="declaration" className="flex cursor-pointer items-start gap-3">
                  <input
                    id="declaration"
                    name="declaration"
                    type="checkbox"
                    checked={form.declaration}
                    onChange={handleChange}
                    aria-invalid={errors.declaration ? 'true' : undefined}
                    aria-describedby={errors.declaration ? 'declaration-error' : undefined}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-spist-line text-spist-green focus:ring-2 focus:ring-spist-accent/40"
                  />
                  <span className="text-[13.5px] leading-relaxed text-spist-muted">
                    I declare that the information provided above is true to the best of my
                    knowledge, and I understand that any false statement may lead to cancellation
                    of admission.
                  </span>
                </label>
                {errors.declaration && (
                  <p id="declaration-error" className="mt-1.5 pl-7 text-[12.5px] font-medium text-spist-maroon">
                    {errors.declaration}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ---------- Step navigation ---------- */}
        <div className="mt-8 flex items-center justify-between border-t border-spist-line pt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-[13.5px] font-semibold text-spist-muted transition-colors hover:text-spist-charcoal disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronLeft width="15" height="15" />
            Back
          </button>

          {currentStep.id === 'review' ? (
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-70">
              <Check width="15" height="15" />
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          ) : (
            <button type="button" onClick={handleContinue} className="btn-primary">
              Continue
              <ChevronRight width="15" height="15" />
            </button>
          )}
        </div>

        {submitError && (
          <p role="alert" className="mt-4 text-[13.5px] font-medium text-spist-maroon">
            {submitError}
          </p>
        )}

        <p className="mt-4 text-[13px] text-spist-muted">
          Note: submitting sends your application to the SPIST admissions server.
        </p>
      </form>
    </div>
  );
}

function ReviewRow({ label, value, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <dt className="text-[11.5px] font-bold uppercase tracking-wider text-spist-muted">{label}</dt>
      <dd className="mt-0.5 font-medium text-spist-charcoal">{value || '—'}</dd>
    </div>
  );
}
