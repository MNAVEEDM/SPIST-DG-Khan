/* ============================================================================
 * API client for the online admission signup/login/application flow.
 *
 * Talks to the Express + MongoDB backend in /server. Only a JWT session
 * token is kept in the browser (localStorage) — never the password, and
 * never application data beyond what's needed to render the current page,
 * since the source of truth is now the database, not the browser.
 * ==========================================================================*/

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';
const TOKEN_KEY = 'spist_admission_token_v1';

function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private browsing, quota, etc). The session just
    // won't survive a refresh — the rest of the flow still works.
  }
}

function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* noop */
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Could not reach the admissions server. Please check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message ?? 'Something went wrong. Please try again.');
    // Some failures are a state the caller must act on rather than just report
    // — an unverified account, for instance, has to be sent to the code screen.
    error.data = data;
    throw error;
  }

  return data;
}

/* ---------------------------------------------------------------------------
 * Auth
 * ------------------------------------------------------------------------ */
/**
 * Starts signup. No session comes back: the account is inert until the code
 * emailed to the address is entered, which is the whole point.
 */
export async function createAccount({ fullName, email, password }) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  });
}

/** Finishes signup: trades the emailed code for a real session. */
export async function verifyEmail({ email, code }) {
  const data = await apiFetch('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
  setToken(data.token);
  return data.user;
}

/** Sends another verification code to an address still waiting on one. */
export async function resendVerificationCode(email) {
  return apiFetch('/api/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyLogin(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

/**
 * Step 1 of forgot-password: asks the server to email a 6-digit code.
 * Resolves even for unknown addresses — the server deliberately doesn't
 * reveal whether an account exists.
 */
export async function requestPasswordReset(email) {
  return apiFetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/** Step 2: trades the emailed code for a new password, and logs the user in. */
export async function resetPassword({ email, code, password }) {
  const data = await apiFetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, code, password }),
  });
  setToken(data.token);
  return data.user;
}

/** Resumes a session from a stored token, if there is one and it's still valid. */
export async function getSession() {
  if (!getToken()) return null;
  try {
    const data = await apiFetch('/api/auth/me');
    return data.user;
  } catch {
    clearToken();
    return null;
  }
}

export function clearSession() {
  clearToken();
}

/* ---------------------------------------------------------------------------
 * Application — one per logged-in account
 * ------------------------------------------------------------------------ */
export async function getApplication() {
  const data = await apiFetch('/api/applications/me');
  return data.application;
}

export async function saveApplication(formValues) {
  const data = await apiFetch('/api/applications/me', {
    method: 'POST',
    body: JSON.stringify(formValues),
  });
  return data.application;
}

/**
 * Public status check — no account needed, just the reference number and the
 * email the application was submitted with.
 *
 * Deliberately not routed through apiFetch: that attaches the session token,
 * and this endpoint must work (identically) for a signed-out visitor.
 */
export async function checkApplicationStatus({ referenceNumber, email }) {
  let response;

  try {
    response = await fetch(`${API_BASE}/api/applications/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceNumber, email }),
    });
  } catch {
    throw new Error('Could not reach the admissions server. Please check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? 'Something went wrong. Please try again.');
  }

  return data.application;
}

/**
 * A short-lived signed link to the applicant's own uploaded photograph.
 * Resolves to null when they never uploaded one, so callers can simply render
 * without a photo rather than branching on an error.
 */
export async function getApplicationPhotoUrl() {
  const data = await apiFetch('/api/applications/me/photo');
  return data.url ?? null;
}

/**
 * Records that the applicant has paid their admission fee voucher.
 *
 * A claim only: the money is confirmed by an admissions officer checking the
 * bank statement, never by this call.
 */
export async function claimFeePayment({ paymentReference, paymentNote, paymentReceiptPath }) {
  const data = await apiFetch('/api/applications/me/payment', {
    method: 'POST',
    body: JSON.stringify({ paymentReference, paymentNote, paymentReceiptPath }),
  });
  return data.application;
}

export async function clearApplication() {
  await apiFetch('/api/applications/me', { method: 'DELETE' });
}

/* ---------------------------------------------------------------------------
 * Courses
 * ------------------------------------------------------------------------ */

/**
 * The institute's real course list, straight from Smart-SMS.
 *
 * Public, so it deliberately skips apiFetch and its session token: an
 * applicant needs to see the courses before they have an account.
 */
export async function fetchCourses() {
  let response;

  try {
    response = await fetch(`${API_BASE}/api/courses`);
  } catch {
    throw new Error('Could not reach the admissions server.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? 'The course list could not be loaded.');
  }

  return Array.isArray(data.courses) ? data.courses : [];
}

/* ---------------------------------------------------------------------------
 * Uploads — applicant photo and supporting documents
 * ------------------------------------------------------------------------ */

/**
 * Sends one file to the admissions server, which stores it in a private
 * bucket and returns { path, name, size, slot, label } to keep on the form.
 *
 * Deliberately not routed through apiFetch: that sets a JSON content type,
 * which would break the multipart boundary. XHR rather than fetch so the form
 * can show real upload progress on a slow connection.
 */
export function uploadAdmissionFile({ file, slot, label = '', onProgress }) {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('file', file);
    body.append('slot', slot);
    if (label) body.append('label', label);

    const request = new XMLHttpRequest();
    request.open('POST', `${API_BASE}/api/uploads`);

    const token = getToken();
    if (token) request.setRequestHeader('Authorization', `Bearer ${token}`);

    request.upload.addEventListener('progress', (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    request.addEventListener('load', () => {
      let data = {};
      try {
        data = JSON.parse(request.responseText);
      } catch {
        // A proxy or crash can answer with HTML — fall through to the generic message.
      }

      if (request.status >= 200 && request.status < 300) resolve(data);
      else reject(new Error(data.message ?? 'The file could not be uploaded. Please try again.'));
    });

    request.addEventListener('error', () =>
      reject(new Error('Could not reach the admissions server. Please check your connection and try again.')),
    );

    request.send(body);
  });
}
