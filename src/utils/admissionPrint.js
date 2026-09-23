import { institution } from '../data/site';

/* ---------------------------------------------------------------------------
 * Printable documents for the applicant: a copy of their own application, and
 * an admission letter once they've been approved.
 *
 * Both are plain HTML opened in a new window and handed to the browser's own
 * print dialog — which is also where "Save as PDF" lives. No PDF library, and
 * nothing rendered on the server.
 * ------------------------------------------------------------------------ */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Everything printed here is applicant-supplied, so it all gets escaped. */
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ESCAPES[character]);
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Absolute, because the print window is about:blank and has no base URL. */
function assetUrl(path) {
  return `${window.location.origin}${path}`;
}

const SHARED_STYLES = `
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 12.5px;
    line-height: 1.6;
    color: #26302b;
    background: #fff;
  }
  .sheet { max-width: 190mm; margin: 0 auto; padding: 8mm 0; }
  .letterhead {
    display: flex; align-items: center; gap: 14px;
    border-bottom: 3px solid #14532d; padding-bottom: 12px;
  }
  .letterhead img { width: 58px; height: 58px; object-fit: contain; }
  .letterhead h1 { margin: 0; font-size: 17px; color: #14532d; letter-spacing: .2px; }
  .letterhead p { margin: 2px 0 0; font-size: 11px; color: #6b7873; }
  h2.doc-title {
    margin: 18px 0 0; font-size: 15px; color: #14532d;
    text-transform: uppercase; letter-spacing: 1.2px;
  }
  .rule { height: 1px; background: #dfe6e2; margin: 14px 0 18px; }
  section { margin-bottom: 18px; }
  h3 {
    margin: 0 0 8px; font-size: 11px; font-weight: 700; color: #6b7873;
    text-transform: uppercase; letter-spacing: 1px;
  }
  dl { display: grid; grid-template-columns: 1fr 1fr; gap: 9px 22px; margin: 0; }
  dl .wide { grid-column: 1 / -1; }
  dt { font-size: 10.5px; color: #6b7873; text-transform: uppercase; letter-spacing: .6px; }
  dd { margin: 1px 0 0; font-weight: 600; }
  ul { margin: 0; padding-left: 18px; }
  li { margin-bottom: 5px; }
  .muted { color: #6b7873; font-weight: 400; }
  .footer {
    margin-top: 26px; padding-top: 10px; border-top: 1px solid #dfe6e2;
    font-size: 10.5px; color: #6b7873;
  }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

/**
 * Hands the finished document to the print dialog once its images have settled
 * — printing too early would produce a page with an empty photo box.
 */
function printWhenReady(printWindow) {
  let printed = false;
  const print = () => {
    if (printed) return;
    printed = true;
    printWindow.focus();
    printWindow.print();
  };

  const images = Array.from(printWindow.document.images);
  if (images.length === 0) {
    print();
    return;
  }

  let pending = images.length;
  const settle = () => {
    pending -= 1;
    if (pending === 0) print();
  };

  images.forEach((image) => {
    if (image.complete) settle();
    else {
      image.addEventListener('load', settle);
      image.addEventListener('error', settle); // a broken photo shouldn't block the print
    }
  });

  // Nothing should hang the dialog behind a slow asset.
  printWindow.setTimeout(print, 4000);
}

function openPrintWindow({ title, bodyHtml, extraStyles = '' }) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');

  if (!printWindow) {
    throw new Error('Your browser blocked the print window. Please allow pop-ups for this site and try again.');
  }

  printWindow.document.write(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>` +
      `<style>${SHARED_STYLES}${extraStyles}</style></head><body><div class="sheet">${bodyHtml}</div></body></html>`,
  );
  printWindow.document.close();

  printWhenReady(printWindow);
}

function letterhead() {
  return `
    <div class="letterhead">
      <img src="${escapeHtml(assetUrl(institution.logo))}" alt="">
      <div>
        <h1>${escapeHtml(institution.name)}</h1>
        <p>${escapeHtml(institution.address)}</p>
        <p>${escapeHtml(institution.phones.join(' · '))} &nbsp;|&nbsp; ${escapeHtml(institution.email)}</p>
      </div>
    </div>`;
}

function field(label, value, wide) {
  return `
    <div${wide ? ' class="wide"' : ''}>
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value || '—')}</dd>
    </div>`;
}

/* ---------------------------------------------------------------------------
 * 1. The applicant's own copy of what they submitted
 * ------------------------------------------------------------------------ */

export function printApplicationCopy({ submission, photoUrl }) {
  const documents = submission.documents ?? [];

  // The photo sits beside the personal details; with no photo the details
  // simply take the full width instead of leaving a gap.
  const photoBlock = photoUrl
    ? `<img src="${escapeHtml(photoUrl)}" alt="Applicant photograph"
         style="width:32mm;height:32mm;object-fit:cover;border:1px solid #dfe6e2;border-radius:3px;">`
    : '';

  const documentList = documents.length
    ? `<ul>${documents
        .map(
          (doc) =>
            `<li>${escapeHtml(doc.label || 'Document')}` +
            (doc.name ? ` <span class="muted">(${escapeHtml(doc.name)})</span>` : '') +
            '</li>',
        )
        .join('')}</ul>`
    : '<p class="muted">No documents were attached to this application.</p>';

  openPrintWindow({
    title: `SPIST Application — ${submission.referenceNumber}`,
    bodyHtml: `
      ${letterhead()}
      <h2 class="doc-title">Admission Application — Applicant Copy</h2>
      <div class="rule"></div>

      <section>
        <div style="display:flex;gap:16px;align-items:flex-start;">
          <div style="flex:1;">
            <h3>Personal Information</h3>
            <dl>
              ${field('Full Name', submission.fullName)}
              ${field("Father's Name", submission.fatherName)}
              ${field('CNIC / B-Form', submission.cnic)}
              ${field('Date of Birth', submission.dob)}
              ${field('Gender', submission.gender)}
            </dl>
          </div>
          ${photoBlock}
        </div>
      </section>

      <section>
        <h3>Contact Information</h3>
        <dl>
          ${field('Contact Number', submission.phone)}
          ${field('Email Address', submission.email)}
          ${field('Residential Address', submission.address, true)}
        </dl>
      </section>

      <section>
        <h3>Academic Background &amp; Program</h3>
        <dl>
          ${field('Previous Qualification', submission.qualification, true)}
          ${field('Program Applied For', submission.program, true)}
        </dl>
      </section>

      <section>
        <h3>Documents Attached</h3>
        ${documentList}
      </section>

      <section>
        <h3>Submission</h3>
        <dl>
          ${field('Reference Number', submission.referenceNumber)}
          ${field('Submitted On', formatDate(submission.createdAt))}
        </dl>
      </section>

      <p class="footer">
        Applicant copy generated from the ${escapeHtml(institution.shortName)} online admission portal.
        Please quote your reference number in any correspondence with the admissions office.
      </p>`,
  });
}

/* ---------------------------------------------------------------------------
 * 2. Admission letter — only reachable once an application is approved
 * ------------------------------------------------------------------------ */

const DOCUMENTS_TO_BRING = [
  'Original academic certificates and transcripts, with one attested photocopy of each',
  'Original CNIC / B-Form of the applicant, with one photocopy',
  "Original CNIC of the parent or guardian, with one photocopy",
  'Original domicile certificate, with one photocopy',
  'Character certificate from the institution last attended',
  'Four recent passport-size photographs',
];

export function printAdmissionLetter({ submission }) {
  openPrintWindow({
    title: `SPIST Admission Letter — ${submission.referenceNumber}`,
    bodyHtml: `
      ${letterhead()}
      <h2 class="doc-title">Letter of Admission</h2>
      <div class="rule"></div>

      <p style="margin:0 0 16px;">
        <strong>Date:</strong> ${escapeHtml(formatDate(new Date()))}<br>
        <strong>Reference:</strong> ${escapeHtml(submission.referenceNumber)}
      </p>

      <p style="margin:0 0 4px;"><strong>${escapeHtml(submission.fullName)}</strong></p>
      <p style="margin:0 0 18px;" class="muted">
        Son / Daughter of ${escapeHtml(submission.fatherName || '—')}
      </p>

      <p style="margin:0 0 12px;">Dear ${escapeHtml(submission.fullName)},</p>

      <p style="margin:0 0 12px;">
        We are pleased to inform you that your application for admission to
        <strong>${escapeHtml(submission.program)}</strong> at
        ${escapeHtml(institution.name)} has been <strong>approved</strong>.
        Congratulations on your selection.
      </p>

      <p style="margin:0 0 16px;">
        To complete your enrolment, please report to the admissions office in person with the
        documents listed below. Your admission is confirmed once these have been verified and the
        applicable dues have been paid.
      </p>

      <section>
        <h3>Documents to Bring in Person</h3>
        <ul>
          ${DOCUMENTS_TO_BRING.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </section>

      <p style="margin:0 0 30px;">
        Please bring this letter with you. If you have any questions before then, contact the
        admissions office at ${escapeHtml(institution.phones[0])} or
        ${escapeHtml(institution.email)}.
      </p>

      <div style="margin-top:34px;">
        <div style="width:62mm;border-top:1px solid #26302b;padding-top:6px;">
          <strong>Admissions Officer</strong><br>
          <span class="muted">${escapeHtml(institution.name)}</span>
        </div>
      </div>

      <p class="footer">
        This letter was generated from the ${escapeHtml(institution.shortName)} online admission
        portal against reference ${escapeHtml(submission.referenceNumber)}.
      </p>`,
  });
}

/* ---------------------------------------------------------------------------
 * 3. Admission fee voucher — taken to the bank and paid
 * ------------------------------------------------------------------------ */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
  'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

/** Under a hundred, spelled out. */
function twoDigitsInWords(value) {
  if (value < 20) return ONES[value];
  const tens = TENS[Math.floor(value / 10)];
  const unit = ONES[value % 10];
  return unit ? `${tens} ${unit}` : tens;
}

/**
 * Rupees in words, the way a bank challan prints them. Grouped the South Asian
 * way — crore, lakh, thousand — because that is what a UBL teller reads.
 */
function amountInWords(amount) {
  let value = Math.floor(Number(amount) || 0);
  if (value <= 0) return '';

  const parts = [];
  const groups = [
    [10000000, 'Crore'],
    [100000, 'Lakh'],
    [1000, 'Thousand'],
    [100, 'Hundred'],
  ];

  groups.forEach(([size, name]) => {
    const count = Math.floor(value / size);
    if (count > 0) {
      parts.push(`${twoDigitsInWords(count)} ${name}`);
      value -= count * size;
    }
  });

  if (value > 0) parts.push(twoDigitsInWords(value));

  return `${parts.join(' ')} Rupees Only`;
}

/** Rs 1,500 */
function rupees(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '';
  return `Rs ${value.toLocaleString('en-PK')}`;
}

const VOUCHER_STYLES = `
  .voucher { border: 1.5px solid #14532d; border-radius: 4px; padding: 7mm; margin-bottom: 6mm; }
  .voucher:last-of-type { margin-bottom: 0; }
  .voucher-head { display: flex; align-items: center; justify-content: space-between; gap: 10px;
    border-bottom: 1px solid #dfe6e2; padding-bottom: 7px; margin-bottom: 9px; }
  .voucher-head .who { display: flex; align-items: center; gap: 10px; }
  .voucher-head img { width: 40px; height: 40px; object-fit: contain; }
  .voucher-head h2 { margin: 0; font-size: 13px; color: #14532d; }
  .voucher-head p { margin: 1px 0 0; font-size: 10px; color: #6b7873; }
  .copy-tag { font-size: 9.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    color: #14532d; border: 1px solid #14532d; border-radius: 999px; padding: 3px 10px; white-space: nowrap; }
  .voucher dl { grid-template-columns: 1fr 1fr; gap: 6px 18px; }
  .amount-box { margin-top: 9px; border-top: 1px dashed #cfd8d3; padding-top: 9px;
    display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .amount-box .figure { font-size: 19px; font-weight: 700; color: #14532d; white-space: nowrap; }
  .amount-box .words { font-size: 11px; color: #6b7873; font-style: italic; }
  .sig { margin-top: 11px; display: flex; justify-content: space-between; gap: 20px; }
  .sig div { flex: 1; border-top: 1px solid #26302b; padding-top: 4px; font-size: 10px; color: #6b7873; }
`;

/**
 * Two copies on one page: one the bank keeps, one the applicant keeps as proof
 * until the admissions office confirms the payment.
 */
export function printFeeVoucher({ submission, fee }) {
  const amount = submission.voucherAmount || fee.amount;
  const issued = submission.voucherIssuedAt || submission.createdAt;

  const copy = (label) => `
    <div class="voucher">
      <div class="voucher-head">
        <div class="who">
          <img src="${escapeHtml(assetUrl(institution.logo))}" alt="">
          <div>
            <h2>${escapeHtml(institution.name)}</h2>
            <p>Admission Fee Voucher &middot; ${escapeHtml(institution.city)}</p>
          </div>
        </div>
        <span class="copy-tag">${escapeHtml(label)}</span>
      </div>

      <dl>
        ${field('Voucher No.', submission.voucherNumber)}
        ${field('Issue Date', formatDate(issued))}
        ${field('Applicant', submission.fullName)}
        ${field("Father's Name", submission.fatherName)}
        ${field('Application Ref.', submission.referenceNumber)}
        ${field('Program', submission.program, true)}
      </dl>

      <dl style="margin-top:9px;border-top:1px dashed #cfd8d3;padding-top:9px;">
        ${field('Bank', fee.bank.name)}
        ${field('Branch', fee.bank.branch)}
        ${field('Account Title', fee.bank.title, true)}
        ${field('IBAN', fee.bank.iban)}
        ${field('Account No.', fee.bank.accountNumber)}
      </dl>

      <div class="amount-box">
        <span class="figure">${escapeHtml(rupees(amount))}</span>
        <span class="words">${escapeHtml(amountInWords(amount))}</span>
      </div>

      <div class="sig">
        <div>Depositor's Signature</div>
        <div>Bank Stamp &amp; Date</div>
      </div>
    </div>`;

  openPrintWindow({
    title: `SPIST Fee Voucher — ${submission.voucherNumber}`,
    extraStyles: VOUCHER_STYLES,
    bodyHtml: `
      ${copy('Bank Copy')}
      ${copy('Applicant Copy')}
      <p class="footer">
        Deposit this voucher at ${escapeHtml(fee.bank.branch || fee.bank.name)}. Afterwards, sign in to the
        admission portal and enter your deposit slip number so the admissions office can verify the
        payment &mdash; your application only moves forward once it has been verified. Keep the
        applicant copy until your admission is confirmed.
      </p>`,
  });
}
