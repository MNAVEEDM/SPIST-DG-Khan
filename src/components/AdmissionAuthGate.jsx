import { useEffect, useState } from 'react';
import { TextField } from './AdmissionFormFields';
import { Check, ChevronLeft, Mail } from './Icons';
import {
  createAccount,
  requestPasswordReset,
  resendVerificationCode,
  resetPassword,
  verifyEmail,
  verifyLogin,
} from '../data/admissionAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Matches the server's own resend cooldown in server/src/routes/auth.js. */
const RESEND_COOLDOWN_SECONDS = 60;

const EMPTY_VALUES = { fullName: '', email: '', password: '', confirmPassword: '', code: '' };

/**
 * Signup / login gate shown before the multi-step application form, backed by
 * the Express + MongoDB API (see `src/data/admissionAuth.js`).
 *
 * Four screens share this panel:
 *   login   — email + password
 *   signup  — creates an unverified account and emails a code
 *   verify  — the code that finishes signup; no session exists until it passes
 *   forgot  — the same code idea, applied to resetting a password
 *
 * Signup and forgot-password both end on a code screen, so they share the
 * field rendering, the resend countdown and the validation below.
 */
export default function AdmissionAuthGate({ onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'verify' | 'forgot'
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

  const isForgot = mode === 'forgot';
  const isVerifyEmail = mode === 'verify';
  const isForgotVerify = isForgot && forgotStep === 'verify';
  // Both flows end on a screen asking for a 6-digit code.
  const isCodeScreen = isVerifyEmail || isForgotVerify;
  const screen = isVerifyEmail ? 'verify' : isForgot ? forgotStep : mode;

  const validate = () => {
    const nextErrors = {};
    const needsNewPassword = mode === 'signup' || isForgotVerify;

    if (mode === 'signup' && !values.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (isCodeScreen && !/^\d{6}$/.test(values.code.trim())) {
      nextErrors.code = 'Enter the 6-digit code from your email.';
    }

    // Verifying an email asks for nothing but the code; the request step of a
    // password reset asks for nothing but the address.
    const needsPassword = mode === 'login' || mode === 'signup' || isForgotVerify;

    if (needsPassword) {
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

  /** Moves to the code screen after a signup, or a login that needs verifying. */
  const goToVerification = (message, emailConfigured) => {
    setMode('verify');
    setErrors({});
    setFormError('');
    setResendIn(RESEND_COOLDOWN_SECONDS);
    setValues((prev) => ({ ...prev, code: '', password: '', confirmPassword: '' }));
    setNotice(
      emailConfigured === false
        ? `${message} Email sending isn't configured on this server yet, so the code was printed to the server console instead.`
        : message,
    );
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
      if (isVerifyEmail) {
        const account = await verifyEmail({ email: values.email.trim(), code: values.code.trim() });
        onAuthenticated(account);
      } else if (isForgot && forgotStep === 'request') {
        await sendResetCode();
      } else if (isForgot) {
        const account = await resetPassword({
          email: values.email.trim(),
          code: values.code.trim(),
          password: values.password,
        });
        onAuthenticated(account);
      } else if (mode === 'signup') {
        const response = await createAccount(values);
        goToVerification(response.message, response.emailConfigured);
      } else {
        const account = await verifyLogin(values.email, values.password);
        onAuthenticated(account);
      }
    } catch (error) {
      // A correct password on an unverified account isn't a failure — the
      // server has already sent a fresh code, so follow it to the code screen.
      if (error.data?.verificationRequired) {
        goToVerification(error.data.message, error.data.emailConfigured);
      } else {
        setFormError(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || submitting) return;

    setSubmitting(true);
    clearMessages();
    try {
      if (isVerifyEmail) {
        const response = await resendVerificationCode(values.email.trim());
        setResendIn(RESEND_COOLDOWN_SECONDS);
        setNotice(
          response.emailConfigured === false
            ? `${response.message} Email sending isn't configured on this server yet, so the code was printed to the server console instead.`
            : response.message,
        );
      } else {
        await sendResetCode();
      }
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const [heading, subheading] = {
    login: ['Log In to Apply', 'Log in to continue or review your online admission application.'],
    signup: [
      'Create Your Applicant Account',
      'Create an account first, then fill out your application step by step. You can return and log in any time to check your submission.',
    ],
    verify: [
      'Confirm Your Email Address',
      `We've sent a 6-digit code to ${values.email.trim()}. Enter it to finish creating your account.`,
    ],
    request: [
      'Reset Your Password',
      "Enter the email address you signed up with and we'll send you a 6-digit reset code.",
    ],
    'verify-reset': [
      'Enter Your Reset Code',
      `We've sent a 6-digit code to ${values.email.trim()}. Enter it below along with your new password.`,
    ],
  }[screen === 'verify' && isForgot ? 'verify-reset' : screen];

  const submitLabel = {
    login: 'Log In',
    signup: 'Send Verification Code',
    verify: 'Verify & Continue',
    request: 'Send Reset Code',
    'verify-reset': 'Update Password & Log In',
  }[screen === 'verify' && isForgot ? 'verify-reset' : screen];

  const showBackLink = isForgot || isVerifyEmail;

  return (
    <div
      key={screen + (isForgot ? '-reset' : '')}
      className="step-enter rounded-xl border border-spist-line bg-white p-7 shadow-card sm:p-9"
    >
      {showBackLink ? (
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
          icon={showBackLink ? Mail : undefined}
          readOnly={isCodeScreen}
        />

        {isCodeScreen && (
          <TextField
            id="code"
            label="6-Digit Code"
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

        {(mode === 'login' || mode === 'signup' || isForgotVerify) && (
          <div>
            <TextField
              id="password"
              label={isForgotVerify ? 'New Password' : 'Password'}
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

        {(mode === 'signup' || isForgotVerify) && (
          <TextField
            id="confirmPassword"
            label={isForgotVerify ? 'Confirm New Password' : 'Confirm Password'}
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

          {isCodeScreen && (
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
          Your password is hashed before it's stored — SPIST never keeps it in plain text. Every
          new account has to confirm its email address with a 6-digit code, and those codes are
          hashed too, expire after 15 minutes, and lock out after 5 wrong attempts.
        </p>
      </div>
    </div>
  );
}
