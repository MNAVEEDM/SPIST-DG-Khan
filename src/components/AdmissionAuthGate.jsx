import { useEffect, useState } from 'react';
import { TextField } from './AdmissionFormFields';
import { Check, ChevronLeft, Mail } from './Icons';
import { createAccount, requestPasswordReset, resetPassword, verifyLogin } from '../data/admissionAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Matches the server's own resend cooldown in server/src/routes/auth.js. */
const RESEND_COOLDOWN_SECONDS = 60;

const EMPTY_VALUES = { fullName: '', email: '', password: '', confirmPassword: '', code: '' };

/**
 * Signup / login gate shown before the multi-step application form, backed by
 * the Express + MongoDB API (see `src/data/admissionAuth.js`).
 *
 * Three modes share this panel: `login`, `signup`, and `forgot` — the last one
 * runs in two steps, emailing a 6-digit code and then exchanging it for a new
 * password, after which the applicant is logged straight in.
 */
export default function AdmissionAuthGate({ onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [forgotStep, setForgotStep] = useState('request'); // 'request' | 'verify'
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // Counts the resend button back down to zero, one second at a time.
  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const clearMessages = () => {
    setErrors({});
    setFormError('');
    setNotice('');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    clearMessages();
    // Keep whatever email was already typed — it's the one field every mode shares.
    setValues((prev) => ({ ...EMPTY_VALUES, email: prev.email }));
    if (nextMode === 'forgot') setForgotStep('request');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    if (formError) setFormError('');
  };

  const validate = () => {
    const nextErrors = {};
    const needsNewPassword = mode === 'signup' || (mode === 'forgot' && forgotStep === 'verify');

    if (mode === 'signup' && !values.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (mode === 'forgot' && forgotStep === 'verify' && !/^\d{6}$/.test(values.code.trim())) {
      nextErrors.code = 'Enter the 6-digit code from your email.';
    }

    // The request step of a password reset only needs the email address.
    if (mode !== 'forgot' || forgotStep === 'verify') {
      if (!values.password) {
        nextErrors.password = 'Password is required.';
      } else if (needsNewPassword && values.password.length < 6) {
        nextErrors.password = 'Password must be at least 6 characters.';
      }
    }

    if (needsNewPassword && values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  };

  const sendResetCode = async () => {
    const response = await requestPasswordReset(values.email.trim());
    setForgotStep('verify');
    setResendIn(RESEND_COOLDOWN_SECONDS);
    setNotice(
      response.emailConfigured === false
        ? `${response.message} Email sending isn't configured on this server yet, so the code was printed to the server console instead.`
        : response.message,
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setFormError('');

    try {
      if (mode === 'forgot' && forgotStep === 'request') {
        await sendResetCode();
      } else if (mode === 'forgot') {
        const account = await resetPassword({
          email: values.email.trim(),
          code: values.code.trim(),
          password: values.password,
        });
        onAuthenticated(account);
      } else {
        const account =
          mode === 'signup' ? await createAccount(values) : await verifyLogin(values.email, values.password);
        onAuthenticated(account);
      }
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || submitting) return;

    setSubmitting(true);
    clearMessages();
    try {
      await sendResetCode();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isForgot = mode === 'forgot';
  const isVerifyStep = isForgot && forgotStep === 'verify';
  const screen = isForgot ? forgotStep : mode;

  const [heading, subheading] = {
    login: ['Log In to Apply', 'Log in to continue or review your online admission application.'],
    signup: [
      'Create Your Applicant Account',
      'Create an account first, then fill out your application step by step. You can return and log in any time to check your submission.',
    ],
    request: [
      'Reset Your Password',
      "Enter the email address you signed up with and we'll send you a 6-digit reset code.",
    ],
    verify: [
      'Enter Your Reset Code',
      `We've sent a 6-digit code to ${values.email.trim()}. Enter it below along with your new password.`,
    ],
  }[screen];

  const submitLabel = {
    login: 'Log In',
    signup: 'Create Account & Continue',
    request: 'Send Reset Code',
    verify: 'Update Password & Log In',
  }[screen];

  return (
    <div
      key={screen}
      className="step-enter rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9"
    >
      {isForgot ? (
        <button
          type="button"
          onClick={() => switchMode('login')}
          className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-spist-green transition-colors hover:text-spist-accent"
        >
          <ChevronLeft width="14" height="14" />
          Back to log in
        </button>
      ) : (
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
      )}

      <h2 className="font-display text-2xl font-bold">{heading}</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-spist-muted">{subheading}</p>

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
          icon={isForgot ? Mail : undefined}
          readOnly={isVerifyStep}
        />

        {isVerifyStep && (
          <TextField
            id="code"
            label="6-Digit Reset Code"
            required
            value={values.code}
            onChange={handleChange}
            error={errors.code}
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="123456"
          />
        )}

        {(!isForgot || isVerifyStep) && (
          <div>
            <TextField
              id="password"
              label={isVerifyStep ? 'New Password' : 'Password'}
              type="password"
              required
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="mt-2 text-[13px] font-semibold text-spist-green transition-colors hover:text-spist-accent hover:underline"
              >
                Forgot your password?
              </button>
            )}
          </div>
        )}

        {(mode === 'signup' || isVerifyStep) && (
          <TextField
            id="confirmPassword"
            label={isVerifyStep ? 'Confirm New Password' : 'Confirm Password'}
            type="password"
            required
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        )}

        {notice && (
          <p
            role="status"
            className="rounded-md bg-spist-accent-soft/60 px-4 py-3 text-[13.5px] leading-relaxed text-spist-charcoal"
          >
            {notice}
          </p>
        )}

        {formError && (
          <p role="alert" className="text-[13.5px] font-medium text-spist-maroon">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-70 sm:w-auto">
            <Check width="15" height="15" />
            {submitting ? 'Please wait…' : submitLabel}
          </button>

          {isVerifyStep && (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendIn > 0 || submitting}
              className="text-[13px] font-semibold text-spist-green transition-colors hover:text-spist-accent hover:underline disabled:cursor-not-allowed disabled:text-spist-muted disabled:no-underline"
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 rounded-lg border-l-4 border-spist-accent bg-spist-accent-soft/60 p-4" role="note">
        <p className="text-[13px] leading-relaxed text-spist-charcoal">
          Your password is hashed before it's stored — SPIST never keeps it in plain text. Reset
          codes are hashed too, expire after 15 minutes, and lock out after 5 wrong attempts. This
          is still a student build without signup email verification, so please use a throwaway
          password rather than one you use elsewhere.
        </p>
      </div>
    </div>
  );
}
