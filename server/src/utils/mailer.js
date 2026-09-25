import nodemailer from 'nodemailer';

/**
 * Outgoing mail for the admission flow.
 *
 * Two ways out, because the host decides which one can work:
 *
 *   BREVO_API_KEY — Brevo's HTTPS API. Render's free instances block outbound
 *     traffic on the SMTP ports (25, 465, 587), so nodemailer cannot open a
 *     connection there at all. It fails silently from the applicant's side:
 *     the verification and reset codes are saved, the response says a code is
 *     on its way, and no mail is ever sent. Port 443 is not blocked, so the
 *     API gets through. This is the same provider and endpoint the Smart-SMS
 *     portal already sends its admission-decision mail through.
 *
 *   Supabase Vault — the same Brevo key, fetched through the
 *     mail_provider_key() function (server/sql/2026-09-25-mail-provider-key.sql)
 *     when BREVO_API_KEY is not in the environment. The deployed service was
 *     created under an account that can no longer be signed in to, so its
 *     environment cannot be edited; the Supabase service-role key it already
 *     holds is enough to ask for the Brevo one. It also means the secret lives
 *     in a single place for both this API and the portal.
 *
 *   EMAIL_USER / EMAIL_PASS — Gmail over SMTP. Fine locally, and the fallback
 *     when no Brevo key can be found either way.
 *
 * Credentials are optional on purpose: with none configured we print the
 * message to the server console instead, so the flow can still be tested end
 * to end on a machine with no mail set up at all.
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

let cachedTransport;
/** Resolved once per process: { brevoApiKey, fromEmail } or null. */
let vaultPromise;

function brevoKey() {
  return process.env.BREVO_API_KEY?.trim() || '';
}

function canAskVault() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Asks Supabase for the Brevo credentials, once. A failure resolves to null
 * rather than throwing, so a Supabase outage costs the send its provider and
 * drops to SMTP instead of taking the whole signup down with it — the caller
 * treats a missing key the same as one that was never configured.
 */
function fetchFromVault() {
  if (!vaultPromise) {
    const url = `${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/mail_provider_key`;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    vaultPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: '{}',
    })
      .then(async (response) => {
        if (!response.ok) {
          const detail = await response.text().catch(() => '');
          throw new Error(`${response.status} ${detail}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error('[mailer] Could not read the Brevo key from Supabase:', error.message);
        return null;
      });
  }
  return vaultPromise;
}

/** The key and sender to send with, or null when neither source has one. */
async function resolveBrevo() {
  const fromEnv = brevoKey();
  const envSender = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (fromEnv) return { key: fromEnv, from: envSender };

  if (!canAskVault()) return null;

  const secrets = await fetchFromVault();
  if (!secrets?.brevoApiKey) return null;

  // The env wins for the sender when it is set: this API may well be sending
  // as a different address than the portal does.
  return { key: secrets.brevoApiKey, from: envSender || secrets.fromEmail };
}

/**
 * Reported to the applicant, so it has to answer synchronously — before any
 * Vault round trip has happened. Having the Supabase credentials counts as
 * configured: if the lookup then comes back empty, the send falls through to
 * SMTP or the console, which is what an unconfigured server does anyway.
 */
export function isMailConfigured() {
  return Boolean(
    brevoKey() || canAskVault() || (process.env.EMAIL_USER && process.env.EMAIL_PASS),
  );
}

function getTransport() {
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return cachedTransport;
}

/**
 * Splits the `EMAIL_FROM` setting into the two fields Brevo wants. It is
 * written as either `admissions@spistpk.com` or `SPIST Admissions
 * <admissions@spistpk.com>`; SMTP takes that string whole, Brevo does not.
 */
function parseSender(value) {
  const match = /^\s*(.*?)\s*<\s*([^>]+?)\s*>\s*$/.exec(value ?? '');
  if (match) return { name: match[1] || undefined, email: match[2] };
  return { email: (value ?? '').trim() };
}

async function sendViaBrevo({ to, subject, text, html }, { key, from }) {
  const sender = parseSender(from);

  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'api-key': key,
    },
    body: JSON.stringify({
      sender,
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    // Brevo explains refusals properly — an unverified sender, a spent quota.
    // Carry that text into the error so the log says what to fix, rather than
    // just the status code.
    const detail = await response.text().catch(() => '');
    throw new Error(`Brevo refused the message (${response.status}): ${detail}`);
  }

  return true;
}

async function send({ to, subject, text, html }) {
  const brevo = await resolveBrevo();

  if (brevo) {
    return sendViaBrevo({ to, subject, text, html }, brevo);
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await getTransport().sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    return true;
  }

  console.log(`\n[mailer] Email not configured — would have sent to ${to}:\n${subject}\n${text}\n`);
  return false;
}

/** Shared shell so both emails look like they come from the same institute. */
function layout({ heading, bodyHtml }) {
  return `
  <div style="margin:0;padding:24px;background:#f4f6f5;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e3e8e5;border-radius:12px;overflow:hidden;">
      <div style="background:#14532d;padding:20px 28px;">
        <p style="margin:0;color:#ffffff;font-size:17px;font-weight:700;letter-spacing:.2px;">
          South Punjab Institute of Science &amp; Technology
        </p>
        <p style="margin:4px 0 0;color:#c9ddd0;font-size:12.5px;">Dera Ghazi Khan &middot; Online Admissions</p>
      </div>
      <div style="padding:28px;color:#26302b;font-size:14.5px;line-height:1.65;">
        <h1 style="margin:0 0 14px;font-size:19px;color:#14532d;">${heading}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:16px 28px;border-top:1px solid #eef2f0;color:#7a8781;font-size:12px;">
        This is an automated message from the SPIST admission portal — please do not reply.
      </div>
    </div>
  </div>`;
}

/** Long-form date, matching how the portal shows it on screen. */
function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function sendRegistrationEmail({ to, fullName }) {
  return send({
    to,
    subject: 'Your SPIST applicant account is ready',
    text:
      `Assalam-o-Alaikum ${fullName},\n\n` +
      'Your SPIST applicant account has been created. You can now log in to the admission ' +
      'portal to fill out, save and review your application.\n\n— SPIST Admissions',
    html: layout({
      heading: `Welcome, ${fullName}`,
      bodyHtml:
        '<p style="margin:0 0 12px;">Your applicant account has been created successfully.</p>' +
        '<p style="margin:0;">You can now log in to the admission portal to fill out, save and review ' +
        'your application at any time.</p>',
    }),
  });
}

/**
 * Confirms a submitted application.
 *
 * The reference number is the point of this email — it's what the applicant
 * needs to check their status later, and resubmitting mints a new one — so it
 * gets the same visual weight the code gets in the password reset email.
 */
export async function sendApplicationReceivedEmail({
  to,
  fullName,
  referenceNumber,
  program,
  submittedAt,
  statusUrl,
}) {
  const submittedOn = formatDate(submittedAt);

  const detailRows =
    `<tr><td style="padding:6px 0;color:#7a8781;font-size:13px;width:38%;">Program</td>` +
    `<td style="padding:6px 0;font-weight:600;">${program}</td></tr>` +
    (submittedOn
      ? `<tr><td style="padding:6px 0;color:#7a8781;font-size:13px;">Submitted on</td>` +
        `<td style="padding:6px 0;font-weight:600;">${submittedOn}</td></tr>`
      : '');

  return send({
    to,
    subject: `Application received — ${referenceNumber}`,
    text:
      `Assalam-o-Alaikum ${fullName},\n\n` +
      'Your admission application has been received.\n\n' +
      `Reference number: ${referenceNumber}\n` +
      `Program: ${program}\n` +
      (submittedOn ? `Submitted on: ${submittedOn}\n` : '') +
      '\nPlease keep this reference number — you will need it, along with this email ' +
      `address, to check the progress of your application at:\n${statusUrl}\n\n` +
      '— SPIST Admissions',
    html: layout({
      heading: 'Application received',
      bodyHtml:
        `<p style="margin:0 0 16px;">Assalam-o-Alaikum ${fullName}, your admission application ` +
        'has been received. Your reference number is:</p>' +
        '<p style="margin:0 0 18px;text-align:center;">' +
        '<span style="display:inline-block;padding:14px 24px;background:#f1f6f2;border:1px solid #cfe0d5;' +
        'border-radius:10px;font-size:23px;font-weight:700;letter-spacing:2.5px;color:#14532d;">' +
        `${referenceNumber}</span></p>` +
        '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 18px;">' +
        `${detailRows}</table>` +
        '<p style="margin:0 0 18px;"><strong>Please keep this reference number.</strong> You will ' +
        'need it, together with this email address, to check the progress of your application.</p>' +
        '<p style="margin:0;text-align:center;">' +
        `<a href="${statusUrl}" style="display:inline-block;padding:12px 26px;background:#14532d;` +
        'color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">' +
        'Check application status</a></p>' +
        `<p style="margin:14px 0 0;color:#7a8781;font-size:12.5px;text-align:center;">${statusUrl}</p>`,
    }),
  });
}

/**
 * Sends the 6-digit forgot-password code. Returns false when mail isn't
 * configured (the code is printed to the server console instead), so the
 * caller can tell the applicant where to look.
 */
export async function sendPasswordResetEmail({ to, fullName, code, minutesValid }) {
  return send({
    to,
    subject: `${code} is your SPIST password reset code`,
    text:
      `Assalam-o-Alaikum ${fullName},\n\n` +
      `Your password reset code is: ${code}\n\n` +
      `It expires in ${minutesValid} minutes. If you didn't request a password reset, ` +
      'you can ignore this email — your password stays unchanged.\n\n— SPIST Admissions',
    html: layout({
      heading: 'Password reset code',
      bodyHtml:
        `<p style="margin:0 0 16px;">Assalam-o-Alaikum ${fullName}, use this code to set a new password:</p>` +
        '<p style="margin:0 0 16px;text-align:center;">' +
        '<span style="display:inline-block;padding:14px 26px;background:#f1f6f2;border:1px solid #cfe0d5;' +
        'border-radius:10px;font-size:28px;font-weight:700;letter-spacing:7px;color:#14532d;">' +
        `${code}</span></p>` +
        `<p style="margin:0 0 10px;">This code expires in <strong>${minutesValid} minutes</strong>.</p>` +
        "<p style=\"margin:0;color:#7a8781;font-size:13px;\">If you didn't request a password reset, " +
        'you can safely ignore this email — your password stays unchanged.</p>',
    }),
  });
}

/**
 * Documents an admitted applicant has to produce in person. Mirrors the list
 * on the printed admission letter (src/utils/admissionPrint.js) so the email
 * and the letter never disagree.
 */
const DOCUMENTS_TO_BRING = [
  'Original academic certificates and transcripts, with one attested photocopy of each',
  'Original CNIC / B-Form of the applicant, with one photocopy',
  'Original CNIC of the parent or guardian, with one photocopy',
  'Original domicile certificate, with one photocopy',
  'Character certificate from the institution last attended',
  'Four recent passport-size photographs',
];

/** `<tr>` for the small details table, skipped entirely when there's no value. */
function detailRow(label, value) {
  if (!value) return '';
  return (
    `<tr><td style="padding:6px 0;color:#7a8781;font-size:13px;width:40%;">${label}</td>` +
    `<td style="padding:6px 0;font-weight:600;">${value}</td></tr>`
  );
}

/** The applicant-facing note the office chose to publish, if they wrote one. */
function reasonBlock(publicReason) {
  if (!publicReason) return '';
  return (
    '<div style="margin:0 0 18px;padding:14px 16px;background:#f1f6f2;border-left:4px solid #14532d;border-radius:6px;">' +
    '<p style="margin:0 0 4px;color:#7a8781;font-size:11.5px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;">' +
    'Message from the admissions office</p>' +
    `<p style="margin:0;">${publicReason}</p></div>`
  );
}

/**
 * Emails an admission decision, in one of two tones.
 *
 * Called by the Smart-SMS dashboard through /api/notify/decision — that app
 * runs entirely in the browser and has no way to send mail itself.
 *
 * Only ever carries what the office chose to publish: `publicReason`. The
 * reviewer's internal note lives in the dashboard and is never passed here.
 */
export async function sendAdmissionDecisionEmail({
  to,
  fullName,
  referenceNumber,
  program,
  status,
  publicReason,
  rollNumber,
  className,
}) {
  const reason = (publicReason ?? '').toString().trim();
  const roll = (rollNumber ?? '').toString().trim();
  const klass = (className ?? '').toString().trim();

  if (status === 'approved') {
    const placement =
      (roll ? `Roll number: ${roll}\n` : '') + (klass ? `Class: ${klass}\n` : '');

    return send({
      to,
      subject: `Admission approved — ${referenceNumber}`,
      text:
        `Assalam-o-Alaikum ${fullName},\n\n` +
        `We are pleased to tell you that your application for ${program} has been approved.\n\n` +
        `Reference number: ${referenceNumber}\n` +
        placement +
        (reason ? `\nMessage from the admissions office:\n${reason}\n` : '') +
        '\nTo complete your enrolment, please report to the admissions office in person with:\n' +
        DOCUMENTS_TO_BRING.map((item) => `  - ${item}`).join('\n') +
        '\n\nYour admission is confirmed once these have been verified and the applicable dues ' +
        'have been paid.\n\n— SPIST Admissions',
      html: layout({
        heading: 'Admission approved',
        bodyHtml:
          `<p style="margin:0 0 16px;">Assalam-o-Alaikum ${fullName}, we are pleased to tell you ` +
          `that your application for <strong>${program}</strong> has been <strong>approved</strong>. ` +
          'Congratulations.</p>' +
          '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 18px;">' +
          detailRow('Reference number', referenceNumber) +
          detailRow('Roll number', roll) +
          detailRow('Class', klass) +
          '</table>' +
          reasonBlock(reason) +
          '<p style="margin:0 0 10px;">To complete your enrolment, please report to the admissions ' +
          'office in person with:</p>' +
          '<ul style="margin:0 0 16px;padding-left:20px;">' +
          DOCUMENTS_TO_BRING.map((item) => `<li style="margin-bottom:5px;">${item}</li>`).join('') +
          '</ul>' +
          '<p style="margin:0;">Your admission is confirmed once these have been verified and the ' +
          'applicable dues have been paid.</p>',
      }),
    });
  }

  return send({
    to,
    subject: `Update on your SPIST application — ${referenceNumber}`,
    text:
      `Assalam-o-Alaikum ${fullName},\n\n` +
      `Thank you for applying for ${program} at SPIST.\n\n` +
      'After careful review, we are unable to offer you a place on this occasion.\n\n' +
      `Reference number: ${referenceNumber}\n` +
      (reason ? `\nMessage from the admissions office:\n${reason}\n` : '') +
      '\nWe know this is disappointing. If you would like to discuss your application or ask ' +
      'about other programs, please contact the admissions office — they will be glad to help.\n\n' +
      '— SPIST Admissions',
    html: layout({
      heading: 'Update on your application',
      bodyHtml:
        `<p style="margin:0 0 14px;">Assalam-o-Alaikum ${fullName}, thank you for applying for ` +
        `<strong>${program}</strong> at SPIST.</p>` +
        '<p style="margin:0 0 18px;">After careful review, we are unable to offer you a place on ' +
        'this occasion.</p>' +
        '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 18px;">' +
        detailRow('Reference number', referenceNumber) +
        '</table>' +
        reasonBlock(reason) +
        '<p style="margin:0;">We know this is disappointing. If you would like to discuss your ' +
        'application, or ask about other programs, please contact the admissions office — they ' +
        'will be glad to help.</p>',
    }),
  });
}

/**
 * Confirms the applicant actually owns the address they signed up with.
 *
 * Same shape as the password reset code on purpose — an applicant who has seen
 * one recognises the other. Until this code is entered the account cannot log
 * in or submit an application, so a made-up address gets nowhere.
 */
export async function sendEmailVerificationEmail({ to, fullName, code, minutesValid }) {
  return send({
    to,
    subject: `${code} is your SPIST verification code`,
    text:
      `Assalam-o-Alaikum ${fullName},\n\n` +
      `Your verification code is: ${code}\n\n` +
      `Enter it on the admission page to finish creating your account. It expires in ` +
      `${minutesValid} minutes.\n\n` +
      "If you didn't try to create a SPIST applicant account, you can ignore this email — " +
      'no account will be activated without this code.\n\n— SPIST Admissions',
    html: layout({
      heading: 'Verify your email address',
      bodyHtml:
        `<p style="margin:0 0 16px;">Assalam-o-Alaikum ${fullName}, enter this code on the ` +
        'admission page to finish creating your account:</p>' +
        '<p style="margin:0 0 16px;text-align:center;">' +
        '<span style="display:inline-block;padding:14px 26px;background:#f1f6f2;border:1px solid #cfe0d5;' +
        'border-radius:10px;font-size:28px;font-weight:700;letter-spacing:7px;color:#14532d;">' +
        `${code}</span></p>` +
        `<p style="margin:0 0 10px;">This code expires in <strong>${minutesValid} minutes</strong>.</p>` +
        '<p style="margin:0;color:#7a8781;font-size:13px;">If you didn\'t try to create a SPIST ' +
        'applicant account, you can ignore this email — no account will be activated without ' +
        'this code.</p>',
    }),
  });
}

/** Rupee amounts as the voucher prints them: Rs 1,500. */
function money(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '';
  return `Rs ${value.toLocaleString('en-PK')}`;
}

/**
 * Acknowledges that an applicant says they have paid their admission voucher.
 *
 * Careful with the wording: this confirms we received the CLAIM, not that the
 * money has landed. An admissions officer still has to check the bank
 * statement, and telling an applicant their fee is settled before that would
 * be wrong.
 */
export async function sendPaymentClaimEmail({ to, fullName, voucherNumber, amount, paymentReference }) {
  const formatted = money(amount);

  return send({
    to,
    subject: `Payment received for checking — ${voucherNumber}`,
    text:
      `Assalam-o-Alaikum ${fullName},\n\n` +
      'Thank you — we have recorded that you have paid your admission fee voucher.\n\n' +
      `Voucher number: ${voucherNumber}\n` +
      (formatted ? `Amount: ${formatted}\n` : '') +
      `Your bank reference: ${paymentReference}\n\n` +
      'The admissions office will check this against the bank statement and confirm it. ' +
      'Your application moves forward once the payment has been verified — you do not ' +
      'need to do anything else in the meantime.\n\n— SPIST Admissions',
    html: layout({
      heading: 'Payment received for checking',
      bodyHtml:
        `<p style="margin:0 0 16px;">Assalam-o-Alaikum ${fullName}, thank you — we have recorded ` +
        'that you have paid your admission fee voucher.</p>' +
        '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 18px;">' +
        `<tr><td style="padding:6px 0;color:#7a8781;font-size:13px;width:42%;">Voucher number</td>` +
        `<td style="padding:6px 0;font-weight:600;">${voucherNumber}</td></tr>` +
        (formatted
          ? `<tr><td style="padding:6px 0;color:#7a8781;font-size:13px;">Amount</td>` +
            `<td style="padding:6px 0;font-weight:600;">${formatted}</td></tr>`
          : '') +
        `<tr><td style="padding:6px 0;color:#7a8781;font-size:13px;">Your bank reference</td>` +
        `<td style="padding:6px 0;font-weight:600;">${paymentReference}</td></tr>` +
        '</table>' +
        '<p style="margin:0 0 12px;">The admissions office will check this against the bank ' +
        'statement and confirm it. Your application moves forward once the payment has been ' +
        '<strong>verified</strong>.</p>' +
        '<p style="margin:0;color:#7a8781;font-size:13px;">You do not need to do anything else ' +
        'in the meantime. Please keep your deposit slip until your admission is confirmed.</p>',
    }),
  });
}
