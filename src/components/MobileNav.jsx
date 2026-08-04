import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navigation, institution } from '../data/site';
import { ChevronDown, Close, Mail, Phone, User } from './Icons';
import Logo from './Logo';

/** Tailwind tiers by nesting depth — reused for depth 2+ so any extra nesting still reads fine. */
const TIERS = [
  {
    leaf: 'block border-l-4 px-5 py-3.5 text-[15px] font-semibold transition-colors',
    leafActive: 'border-spist-maroon bg-spist-accent-soft text-spist-green',
    leafInactive: 'border-transparent text-spist-charcoal hover:bg-spist-accent-soft',
    toggle:
      'flex w-full items-center justify-between gap-3 border-l-4 border-transparent px-5 py-3.5 text-left text-[15px] font-semibold text-spist-charcoal transition-colors hover:bg-spist-accent-soft',
    childWrapper: 'bg-spist-accent-soft/50 py-1',
    chevron: undefined,
  },
  {
    leaf: 'block border-l-4 py-2.5 pl-8 pr-5 text-[14px] transition-colors',
    leafActive: 'border-spist-maroon font-semibold text-spist-green',
    leafInactive: 'border-transparent text-spist-muted hover:text-spist-green',
    toggle:
      'flex w-full items-center justify-between gap-3 border-l-4 border-transparent py-2.5 pl-8 pr-5 text-left text-[14px] font-medium text-spist-charcoal transition-colors hover:text-spist-green',
    childWrapper: 'border-l-2 border-spist-accent/40 py-1 pl-2 ml-8',
    chevron: '14',
  },
  {
    leaf: 'block py-2 pl-3 pr-5 text-[13.5px] transition-colors',
    leafActive: 'font-semibold text-spist-green',
    leafInactive: 'text-spist-muted hover:text-spist-green',
    toggle:
      'flex w-full items-center justify-between gap-3 py-2 pl-3 pr-5 text-left text-[13.5px] font-medium text-spist-charcoal transition-colors hover:text-spist-green',
    childWrapper: 'border-l-2 border-spist-accent/40 py-1 pl-2 ml-6',
    chevron: '13',
  },
];

/**
 * One row of the mobile accordion — a plain link, or, when the item has its
 * own children, a tap-to-expand toggle. Recurses so any nesting depth beyond
 * level 2 (e.g. Office » Administration Offices » Registrar) works the same way.
 */
function AccordionRow({ item, depth, resetKey }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const tier = TIERS[Math.min(depth, TIERS.length - 1)];

  useEffect(() => setExpanded(false), [resetKey]);

  if (!hasChildren) {
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          [tier.leaf, isActive ? tier.leafActive : tier.leafInactive].join(' ')
        }
      >
        {item.label}
      </NavLink>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className={tier.toggle}
      >
        {item.label}
        <ChevronDown
          width={tier.chevron}
          height={tier.chevron}
          className={`shrink-0 text-spist-accent transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <ul className={tier.childWrapper}>
            {item.children.map((child) => (
              <li key={child.href ?? child.label}>
                <AccordionRow item={child} depth={depth + 1} resetKey={resetKey} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

/**
 * Slide-in drawer for tablet and mobile.
 * Purely tap-driven: every level is an accordion, nothing depends on hover.
 */
export default function MobileNav({ open, onClose }) {
  const location = useLocation();

  // Close the drawer on navigation.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll and wire up Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-spist-charcoal/50 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="mobile-navigation"
        className={`glass-drawer fixed inset-y-0 right-0 z-[70] flex w-[88%] max-w-sm flex-col shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between gap-3 border-b border-spist-line px-4 py-3">
          <Logo className="h-11 w-auto" />
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-md text-spist-charcoal transition-colors duration-200 hover:bg-spist-accent-soft hover:text-spist-green"
            aria-label="Close navigation menu"
          >
            <Close />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain py-2">
          <ul>
            {navigation.map((item) => (
              <li key={item.label} className="border-b border-spist-line/70">
                <AccordionRow item={item} depth={0} resetKey={`${location.pathname}|${open}`} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer footer — utility actions that live in the top bar on desktop */}
        <div className="space-y-3 border-t border-spist-line bg-spist-green px-5 py-4 text-white on-dark">
          <a
            href={institution.portalUrl}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-spist-maroon px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-spist-maroon-dark"
          >
            <User width="15" height="15" />
            Student Portal
          </a>
          <a
            href={`tel:${institution.phones[0].replace(/-/g, '')}`}
            className="flex items-center gap-2 text-sm text-white/90 hover:text-white"
          >
            <Phone width="14" height="14" />
            {institution.phones[0]}
          </a>
          <a
            href={`mailto:${institution.email}`}
            className="flex items-center gap-2 text-sm text-white/90 hover:text-white"
          >
            <Mail width="14" height="14" />
            {institution.email}
          </a>
        </div>
      </div>
    </>
  );
}
