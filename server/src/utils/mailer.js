import nodemailer from 'nodemailer';

/**
 * Outgoing mail for the admission flow.
 *
 * Credentials are optional on purpose: this is a student project that has to
 * keep working on a machine with no SMTP set up. When EMAIL_USER/EMAIL_PASS
 * are blank we skip sending and print the message to the server console
 * instead, so the flow can still be tested end to end.
 */

let cachedTransport;

export function isMailConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
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

async function send({ to, subject, text, html }) {
  if (!isMailConfigured()) {
    console.log(`\n[mailer] Email not configured — would have sent to ${to}:\n${subject}\n${text}\n`);
    return false;
  }

  await getTransport().sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
  return true;
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
