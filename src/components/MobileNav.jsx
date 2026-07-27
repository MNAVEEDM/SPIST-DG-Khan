import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navigation, institution } from '../data/site';
import { ChevronDown, Close, Mail, Phone, User } from './Icons';
import Logo from './Logo';

/**
 * Slide-in drawer for tablet and mobile.
 * Purely tap-driven: every level is an accordion, nothing depends on hover.
 */
export default function MobileNav({ open, onClose }) {
  const [expanded, setExpanded] = useState({});
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

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

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
            {navigation.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const key = item.label;

              if (!hasChildren) {
                return (
                  <li key={key} className="border-b border-spist-line/70">
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        [
                          'block border-l-4 px-5 py-3.5 text-[15px] font-semibold transition-colors',
                          isActive
                            ? 'border-spist-maroon bg-spist-accent-soft text-spist-green'
                            : 'border-transparent text-spist-charcoal hover:bg-spist-accent-soft',
                        ].join(' ')
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              }

              return (
                <li key={key} className="border-b border-spist-line/70">
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    aria-expanded={!!expanded[key]}
                    className="flex w-full items-center justify-between gap-3 border-l-4 border-transparent px-5 py-3.5 text-left text-[15px] font-semibold text-spist-charcoal transition-colors hover:bg-spist-accent-soft"
                  >
                    {item.label}
                    <ChevronDown
                      className={`shrink-0 text-spist-green transition-transform duration-200 ${
                        expanded[key] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: expanded[key] ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <ul className="bg-spist-accent-soft/50 py-1">
                        {item.children.map((child) => {
                          const hasFlyout =
                            Array.isArray(child.children) && child.children.length > 0;
                          const subKey = `${key}::${child.label}`;

                          if (!hasFlyout) {
                            return (
                              <li key={child.href}>
                                <NavLink
                                  to={child.href}
                                  className={({ isActive }) =>
                                    [
                                      'block border-l-4 py-2.5 pl-8 pr-5 text-[14px] transition-colors',
                                      isActive
                                        ? 'border-spist-maroon font-semibold text-spist-green'
                                        : 'border-transparent text-spist-muted hover:text-spist-green',
                                    ].join(' ')
                                  }
                                >
                                  {child.label}
                                </NavLink>
                              </li>
                            );
                          }

                          return (
                            <li key={subKey}>
                              <button
                                type="button"
                                onClick={() => toggle(subKey)}
                                aria-expanded={!!expanded[subKey]}
                                className="flex w-full items-center justify-between gap-3 border-l-4 border-transparent py-2.5 pl-8 pr-5 text-left text-[14px] font-medium text-spist-charcoal transition-colors hover:text-spist-green"
                              >
                                {child.label}
                                <ChevronDown
                                  width="14"
                                  height="14"
                                  className={`shrink-0 text-spist-accent transition-transform duration-200 ${
                                    expanded[subKey] ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>

                              <div
                                className="grid transition-[grid-template-rows] duration-300 ease-out"
                                style={{ gridTemplateRows: expanded[subKey] ? '1fr' : '0fr' }}
                              >
                                <div className="overflow-hidden">
                                  <ul className="border-l-2 border-spist-accent/40 py-1 pl-2 ml-8">
                                    {child.children.map((grandchild) => (
                                      <li key={grandchild.href}>
                                        <NavLink
                                          to={grandchild.href}
                                          className={({ isActive }) =>
                                            [
                                              'block py-2 pl-3 pr-5 text-[13.5px] transition-colors',
                                              isActive
                                                ? 'font-semibold text-spist-green'
                                                : 'text-spist-muted hover:text-spist-green',
                                            ].join(' ')
                                          }
                                        >
                                          {grandchild.label}
                                        </NavLink>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
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
