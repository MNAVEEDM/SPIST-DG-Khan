import { useState } from 'react';
import { Check, Close, Plus, User } from './Icons';
import { uploadAdmissionFile } from '../data/admissionAuth';

/* ---------------------------------------------------------------------------
 * Photo & document uploads for the admission wizard.
 *
 * Files are uploaded the moment they're picked, so submitting the application
 * only sends storage paths — a 5 MB scan never rides along with the form POST.
 * Nothing here is required: an applicant who has no scans yet can still submit
 * and bring the originals to the admissions office.
 * ------------------------------------------------------------------------ */

/** Fixed slots, one file each. Must match DOCUMENT_SLOTS in server/src/routes/uploads.js. */
const NAMED_SLOTS = [
  { id: 'matric', label: 'Matric / O-Level Certificate' },
  { id: 'intermediate', label: 'Intermediate / A-Level Certificate' },
  { id: 'cnic', label: 'CNIC or B-Form' },
  { id: 'domicile', label: 'Domicile' },
  { id: 'character', label: 'Character Certificate' },
];

const ACCEPT_DOCUMENT = 'image/jpeg,image/png,image/webp,application/pdf';
const ACCEPT_IMAGE = 'image/jpeg,image/png,image/webp';

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdmissionDocuments({ values, onChange }) {
  const documents = values.documents ?? [];
  const [busy, setBusy] = useState({}); // key -> percent uploaded
  const [errors, setErrors] = useState({}); // key -> message

  const otherRows = documents.filter((doc) => doc.slot === 'other');

  /** Uploads one file under `key`, tracking progress and errors against it. */
  const runUpload = async (key, { file, slot, label }, apply) => {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setBusy((prev) => ({ ...prev, [key]: 0 }));

    try {
      const uploaded = await uploadAdmissionFile({
        file,
        slot,
        label,
        onProgress: (percent) => setBusy((prev) => ({ ...prev, [key]: percent })),
      });
      apply(uploaded);
      return true;
    } catch (error) {
      setErrors((prev) => ({ ...prev, [key]: error.message }));
      return false;
    } finally {
      setBusy((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  /* ---------------------------------- Photo --------------------------------- */

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // so picking the same file twice still fires onChange
    if (!file) return;

    // Previewed from the local file, not from storage — the bucket is private.
    const preview = URL.createObjectURL(file);

    const uploaded = await runUpload('photo', { file, slot: 'photo' }, (result) => {
      if (values.photoPreview) URL.revokeObjectURL(values.photoPreview);
      onChange({ photoPath: result.path, photoName: result.name, photoPreview: preview });
    });

    if (!uploaded) URL.revokeObjectURL(preview);
  };

  const removePhoto = () => {
    if (values.photoPreview) URL.revokeObjectURL(values.photoPreview);
    onChange({ photoPath: '', photoName: '', photoPreview: '' });
  };

  /* -------------------------------- Documents ------------------------------- */

  /** Replaces a named slot in place, or appends it the first time. */
  const putNamed = (slotId, uploaded) => {
    const entry = { slot: slotId, label: uploaded.label, path: uploaded.path, name: uploaded.name, size: uploaded.size };
    const index = documents.findIndex((doc) => doc.slot === slotId);
    const next = index === -1 ? [...documents, entry] : documents.map((doc, i) => (i === index ? entry : doc));
    onChange({ documents: next });
  };

  const handleNamedFile = (slotId) => async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await runUpload(slotId, { file, slot: slotId }, (uploaded) => putNamed(slotId, uploaded));
  };

  const removeNamed = (slotId) => {
    onChange({ documents: documents.filter((doc) => doc.slot !== slotId) });
    setErrors((prev) => ({ ...prev, [slotId]: undefined }));
  };

  /* ------------------------------ Other documents --------------------------- */

  const addOtherRow = () => {
    const uid = `other-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    onChange({ documents: [...documents, { uid, slot: 'other', label: '', path: '', name: '', size: 0 }] });
  };

  const patchOtherRow = (uid, patch) => {
    onChange({ documents: documents.map((doc) => (doc.uid === uid ? { ...doc, ...patch } : doc)) });
  };

  const removeOtherRow = (uid) => {
    onChange({ documents: documents.filter((doc) => doc.uid !== uid) });
    setErrors((prev) => ({ ...prev, [uid]: undefined }));
  };

  const handleOtherFile = (row) => async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    await runUpload(row.uid, { file, slot: 'other', label: row.label }, (uploaded) => {
      // Keep the label the applicant typed; the server only falls back to a
      // generic one when the field was still empty at upload time.
      patchOtherRow(row.uid, {
        path: uploaded.path,
        name: uploaded.name,
        size: uploaded.size,
        label: row.label || uploaded.label,
      });
    });
  };

  return (
    <>
      <h2 className="font-display text-xl font-bold">Photo &amp; Documents</h2>
      <p className="text-[14px] leading-relaxed text-spist-muted">
        Upload a photograph and scans of your certificates if you have them. Everything on this
        step is optional — you can submit now and bring the originals to the admissions office.
        JPG, PNG, WEBP or PDF, up to 5&nbsp;MB each.
      </p>

      {/* ---------- Photo ---------- */}
      <div className="rounded-lg border border-spist-line p-5">
        <h3 className="text-[14px] font-bold text-spist-charcoal">Applicant Photograph</h3>
        <p className="mt-1 text-[13px] text-spist-muted">A recent passport-style photo. Images only.</p>

        <div className="mt-4 flex flex-wrap items-center gap-5">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-spist-line bg-spist-accent-soft/40">
            {values.photoPreview ? (
              <img src={values.photoPreview} alt="Selected applicant photograph" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-spist-muted/50">
                {values.photoPath ? (
                  <Check width="26" height="26" strokeWidth={3} className="text-spist-green" />
                ) : (
                  <User width="30" height="30" />
                )}
              </span>
            )}
          </div>

          <div className="min-w-[180px] flex-1">
            {busy.photo !== undefined ? (
              <UploadProgress percent={busy.photo} />
            ) : (
              <>
                <p className="text-[13.5px] font-medium text-spist-charcoal">
                  {values.photoPath ? values.photoName || 'Photo uploaded' : 'No photo uploaded yet'}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <FilePickerButton
                    id="photo-input"
                    accept={ACCEPT_IMAGE}
                    onChange={handlePhoto}
                    label={values.photoPath ? 'Replace photo' : 'Upload photo'}
                  />
                  {values.photoPath && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-[13px] font-semibold text-spist-muted transition-colors hover:text-spist-maroon"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </>
            )}
            {errors.photo && <FieldMessage message={errors.photo} />}
          </div>
        </div>
      </div>

      {/* ---------- Named slots ---------- */}
      <div className="rounded-lg border border-spist-line p-5">
        <h3 className="text-[14px] font-bold text-spist-charcoal">Supporting Documents</h3>

        <ul className="mt-4 divide-y divide-spist-line">
          {NAMED_SLOTS.map((slot) => {
            const uploaded = documents.find((doc) => doc.slot === slot.id);
            const percent = busy[slot.id];

            return (
              <li key={slot.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    uploaded ? 'bg-spist-green text-white' : 'border border-spist-line text-spist-muted/50'
                  }`}
                  aria-hidden="true"
                >
                  {uploaded ? <Check width="12" height="12" strokeWidth={3} /> : null}
                </span>

                <div className="min-w-[170px] flex-1">
                  <p className="text-[13.5px] font-semibold text-spist-charcoal">{slot.label}</p>
                  {percent === undefined && (
                    <p className="mt-0.5 text-[12.5px] text-spist-muted">
                      {uploaded
                        ? `${uploaded.name || 'Uploaded'}${uploaded.size ? ` · ${formatSize(uploaded.size)}` : ''}`
                        : 'Not uploaded'}
                    </p>
                  )}
                  {percent !== undefined && <UploadProgress percent={percent} />}
                  {errors[slot.id] && <FieldMessage message={errors[slot.id]} />}
                </div>

                {percent === undefined && (
                  <div className="flex items-center gap-3">
                    <FilePickerButton
                      id={`doc-${slot.id}`}
                      accept={ACCEPT_DOCUMENT}
                      onChange={handleNamedFile(slot.id)}
                      label={uploaded ? 'Replace' : 'Upload'}
                    />
                    {uploaded && (
                      <button
                        type="button"
                        onClick={() => removeNamed(slot.id)}
                        className="text-[13px] font-semibold text-spist-muted transition-colors hover:text-spist-maroon"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------- Other documents ---------- */}
      <div className="rounded-lg border border-spist-line p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[14px] font-bold text-spist-charcoal">Other Documents</h3>
            <p className="mt-1 text-[13px] text-spist-muted">
              Anything else worth attaching — name it yourself. Add as many as you need.
            </p>
          </div>
          <button type="button" onClick={addOtherRow} className="btn-ghost shrink-0">
            <Plus width="14" height="14" />
            Add document
          </button>
        </div>

        {otherRows.length > 0 && (
          <ul className="mt-4 space-y-3">
            {otherRows.map((row) => {
              const percent = busy[row.uid];

              return (
                <li key={row.uid} className="rounded-md border border-spist-line bg-spist-accent-soft/20 p-3.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <input
                      type="text"
                      value={row.label}
                      onChange={(event) => patchOtherRow(row.uid, { label: event.target.value })}
                      placeholder="Document name, e.g. Migration Certificate"
                      maxLength={120}
                      aria-label="Document name"
                      className="min-w-[170px] flex-1 rounded-md border border-spist-line bg-white px-3 py-2 text-[13.5px] text-spist-charcoal transition-colors placeholder:text-spist-muted/60 focus:border-spist-accent focus:outline-none focus:ring-2 focus:ring-spist-accent/30"
                    />

                    {percent === undefined && (
                      <FilePickerButton
                        id={`doc-${row.uid}`}
                        accept={ACCEPT_DOCUMENT}
                        onChange={handleOtherFile(row)}
                        label={row.path ? 'Replace' : 'Choose file'}
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => removeOtherRow(row.uid)}
                      aria-label="Remove this document"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-spist-muted transition-colors hover:bg-spist-maroon/10 hover:text-spist-maroon"
                    >
                      <Close width="14" height="14" />
                    </button>
                  </div>

                  {percent !== undefined ? (
                    <div className="mt-2">
                      <UploadProgress percent={percent} />
                    </div>
                  ) : (
                    row.path && (
                      <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-spist-green">
                        <Check width="12" height="12" strokeWidth={3} />
                        {row.name || 'Uploaded'}
                        {row.size ? ` · ${formatSize(row.size)}` : ''}
                      </p>
                    )
                  )}

                  {errors[row.uid] && <FieldMessage message={errors[row.uid]} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Small shared pieces
 * ------------------------------------------------------------------------ */

/** A styled label driving a visually hidden file input, so it matches the buttons around it. */
function FilePickerButton({ id, accept, onChange, label }) {
  return (
    <>
      <input id={id} type="file" accept={accept} onChange={onChange} className="sr-only" />
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-spist-line bg-white px-3.5 py-2 text-[13px] font-semibold text-spist-green transition-colors hover:border-spist-accent hover:bg-spist-accent-soft/40"
      >
        {label}
      </label>
    </>
  );
}

function UploadProgress({ percent }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-full max-w-[190px] overflow-hidden rounded-full bg-spist-line">
        <div
          className="h-full rounded-full bg-spist-green transition-all duration-200"
          style={{ width: `${Math.max(4, percent)}%` }}
        />
      </div>
      <span className="text-[12.5px] font-medium text-spist-muted">
        {percent >= 100 ? 'Saving…' : `${percent}%`}
      </span>
    </div>
  );
}

function FieldMessage({ message }) {
  return (
    <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-spist-maroon">
      {message}
    </p>
  );
}
