import { useState } from 'react';
import { TextField } from './AdmissionFormFields';
import { Check } from './Icons';
import { createAccount, verifyLogin } from '../data/admissionAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Signup / login gate shown before the multi-step application form.
 * Accounts are a frontend-only prototype (see `src/data/admissionAuth.js`)
 * — this lets applicants create an account, come back later, and resume or
 * review their application, without pretending there's a real server behind
 * it yet.
 */
export default function AdmissionAuthGate({ onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [values, setValues] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setFormError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    if (formError) setFormError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (mode === 'signup' && !values.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!values.password) {
      nextErrors.password = 'Password is required.';
    } else if (mode === 'signup' && values.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (mode === 'signup' && values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setFormError('');

    try {
      const account =
        mode === 'signup' ? await createAccount(values) : await verifyLogin(values.email, values.password);
      onAuthenticated(account);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div key={mode} className="step-enter rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9">
      <div className="mb-7 flex rounded-lg border border-spist-line bg-spist-accent-soft/40 p-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          onClick={() => switchMode('login')}
          className={`flex-1 rounded-md px-4 py-2.5 text-[13.5px] font-semibold transition-all duration-200 ${
            mode === 'login' ? 'bg-white text-spist-green shadow-e1' : 'text-spist-muted hover:text-spist-charcoal'
          }`}
        >
          Log In
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signup'}
          onClick={() => switchMode('signup')}
          className={`flex-1 rounded-md px-4 py-2.5 text-[13.5px] font-semibold transition-all duration-200 ${
            mode === 'signup' ? 'bg-white text-spist-green shadow-e1' : 'text-spist-muted hover:text-spist-charcoal'
          }`}
        >
          Create Account
        </button>
      </div>

      <h2 className="font-display text-2xl font-bold">
        {mode === 'login' ? 'Log In to Apply' : 'Create Your Applicant Account'}
      </h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-spist-muted">
        {mode === 'login'
          ? 'Log in to continue or review your online admission application.'
          : 'Create an account first, then fill out your application step by step. You can return and log in any time to check your submission.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        {mode === 'signup' && (
          <TextField
            id="fullName"
            label="Full Name"
            required
            value={values.fullName}
            onChange={handleChange}
            error={errors.fullName}
            autoComplete="name"
          />
        )}

        <TextField
          id="email"
          label="Email Address"
          type="email"
          required
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          required
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        {mode === 'signup' && (
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            required
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        )}

        {formError && (
          <p role="alert" className="text-[13.5px] font-medium text-spist-maroon">
            {formError}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-70 sm:w-auto">
          <Check width="15" height="15" />
          {submitting ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account & Continue'}
        </button>
      </form>

      <div
        className="mt-6 rounded-lg border-l-4 border-spist-accent bg-spist-accent-soft/60 p-4"
        role="note"
      >
        <p className="text-[13px] leading-relaxed text-spist-charcoal">
          Your password is hashed before it's stored — SPIST never keeps it in plain text. This
          project is still a student build though, without email verification or rate-limiting
          yet, so please use a throwaway password rather than one you use elsewhere.
        </p>
      </div>
    </div>
  );
}
