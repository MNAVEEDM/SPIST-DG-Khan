import { ChevronDown } from './Icons';

/**
 * Shared field primitives for the online admission flow (auth forms +
 * application wizard). Same visual language as the Contact page form
 * (src/pages/Contact.jsx), extended with error states.
 */
export const inputClasses = (hasError) =>
  `w-full rounded-md border bg-white px-4 py-3 text-[14.5px] text-spist-charcoal transition-colors placeholder:text-spist-muted/60 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-spist-maroon focus:border-spist-maroon focus:ring-spist-maroon/20'
      : 'border-spist-line focus:border-spist-accent focus:ring-spist-accent/30'
  }`;

function FieldLabel({ id, label, required }) {
  return (
    <label htmlFor={id} className="mb-1.5 block text-[13.5px] font-semibold text-spist-charcoal">
      {label} {required && <span className="text-spist-maroon">*</span>}
    </label>
  );
}

function FieldError({ id, error }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 text-[12.5px] font-medium text-spist-maroon">
      {error}
    </p>
  );
}

export function TextField({ id, label, type = 'text', required, value, onChange, error, icon: Icon, ...rest }) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputClasses(Boolean(error))} ${Icon ? 'pl-10' : ''}`}
          placeholder={rest.placeholder ?? label}
          {...rest}
        />
        {Icon && (
          <Icon
            width="15"
            height="15"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-spist-muted/60"
          />
        )}
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}

export function TextAreaField({ id, label, required, value, onChange, error, rows = 4, ...rest }) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses(Boolean(error))}
        {...rest}
      />
      <FieldError id={id} error={error} />
    </div>
  );
}

export function SelectField({ id, label, required, value, onChange, error, placeholder, options, optionGroups }) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputClasses(Boolean(error))} appearance-none pr-10 ${
            value ? '' : 'text-spist-muted/70'
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}

          {optionGroups?.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown
          width="14"
          height="14"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-spist-muted"
        />
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}
