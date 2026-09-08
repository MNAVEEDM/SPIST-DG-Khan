import { useEffect, useRef } from 'react';
import { portals } from '../data/site';
import { ChevronDown, User } from './Icons';

/**
 * The header's Login control — a solid maroon button that drops a short list
 * of the four Smart-SMS sign-in pages (student, teacher, admin, registrar).
 *
 * Each row links straight at that role's own login page rather than a shared
 * one, so the visitor never has to pick a role twice. The URLs live in
 * `portals` in data/site.js.
 *
 * Open/close mirrors MegaMenu deliberately, so the header behaves the same way
 * everywhere: hover opens with a short grace period on the way out, click
 * toggles for touch, Escape closes and restores focus, and Tabbing out closes
 * it on the way past.
 *
 * It sits at the far right of the primary nav row rather than in the utility
 * strip above it, so it survives the strip collapsing away on scroll — a
 * sign-in control that disappears the moment you scroll is the one control
 * that should not.
 */
export default function PortalMenu({ open, onOpen, onClose }) {
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    onOpen();
  };

  // Grace period so diagonal mouse travel into the panel doesn't close it.
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(onClose, 160);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          onClose();
          triggerRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget)) onClose();
      }}
    >
      {/* Solid maroon — intentionally not glassed, same as the bar's other CTA */}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={openNow}
        onClick={() => (open ? onClose() : openNow())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            openNow();
          }
        }}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded bg-spist-maroon px-3.5 py-2 text-[12.5px] font-semibold uppercase tracking-wide text-white shadow-e1 transition-colors duration-200 hover:bg-spist-maroon-dark"
      >
        <User width="13" height="13" />
        Login
        <ChevronDown
          width="12"
          height="12"
          className={`mt-px transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ---------- Role panel ---------- */}
      <div
        className={[
          'absolute right-0 top-full z-50 pt-1.5 transition-all duration-200 ease-out',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
        ].join(' ')}
      >
        <ul
          className="glass-panel min-w-[220px] rounded-xl border-t-[3px] border-t-spist-maroon py-2 shadow-panel"
          role="menu"
          aria-label="Portal login"
        >
          {portals.map((portal) => (
            <li key={portal.role} role="none">
              <a
                href={portal.url}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                onClick={onClose}
                className="block border-l-[3px] border-transparent px-5 py-2.5 text-[13.5px] normal-case leading-snug tracking-normal text-spist-charcoal transition-all duration-150 hover:border-spist-accent hover:bg-spist-accent-soft hover:text-spist-green"
              >
                {portal.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
