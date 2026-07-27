import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from './Icons';

/**
 * Desktop dropdown for one top-level nav item.
 *
 * Interaction model (mirrors ue.edu.pk):
 *  - hovering the top-level item reveals the level-2 panel directly beneath it
 *    with a fade + slight slide-down (180ms)
 *  - a level-2 row that has its own `children` shows a » chevron and opens a
 *    level-3 flyout to the right on hover/focus
 *  - keyboard: Enter/Space/ArrowDown opens, Escape closes and restores focus,
 *    Tab moves through the panel naturally and closes it on the way out
 */
export default function MegaMenu({ item, isOpen, onOpen, onClose }) {
  const [openSub, setOpenSub] = useState(null);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  // Collect every href under this item so the parent can show an active state.
  const containsActivePath = hasChildren
    ? item.children.some(
        (child) =>
          child.href === location.pathname ||
          child.children?.some((g) => g.href === location.pathname),
      )
    : item.href === location.pathname;

  // Close the panel whenever the route changes (a link inside was followed).
  useEffect(() => {
    onClose();
    setOpenSub(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const open = () => {
    clearTimeout(closeTimer.current);
    onOpen();
  };

  // Small grace period so diagonal mouse travel into the panel doesn't close it.
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      onClose();
      setOpenSub(null);
    }, 160);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      onClose();
      setOpenSub(null);
      triggerRef.current?.focus();
    }
  };

  // Closing when focus leaves the whole item keeps Tab-through behaviour sane.
  const handleBlur = (event) => {
    if (!wrapperRef.current?.contains(event.relatedTarget)) {
      onClose();
      setOpenSub(null);
    }
  };

  if (!hasChildren) {
    return (
      <li className="relative">
        <NavLink
          to={item.href}
          title={item.title}
          className={({ isActive }) =>
            [
              'relative flex items-center whitespace-nowrap px-2.5 py-4 text-[13px] font-semibold uppercase tracking-wide transition-colors duration-200',
              'after:absolute after:inset-x-2 after:bottom-2.5 after:h-[3px] after:rounded-full after:transition-all after:duration-200',
              isActive
                ? 'text-white after:bg-spist-maroon'
                : 'text-white/90 hover:text-white after:bg-transparent hover:after:bg-white/40',
            ].join(' ')
          }
        >
          {item.label}
        </NavLink>
      </li>
    );
  }

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <NavLink
        ref={triggerRef}
        to={item.href}
        title={item.title}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onFocus={open}
        onClick={(event) => {
          // First interaction reveals the panel instead of navigating away,
          // which is what touch and keyboard users expect from a parent item.
          if (!isOpen) {
            event.preventDefault();
            open();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            open();
          }
        }}
        className={[
          'relative flex items-center gap-1 whitespace-nowrap px-2.5 py-4 text-[13px] font-semibold uppercase tracking-wide transition-colors duration-200',
          'after:absolute after:inset-x-2 after:bottom-2.5 after:h-[3px] after:rounded-full after:transition-all after:duration-200',
          containsActivePath
            ? 'text-white after:bg-spist-maroon'
            : 'text-white/90 hover:text-white after:bg-transparent hover:after:bg-white/40',
        ].join(' ')}
      >
        {item.label}
        <ChevronDown
          width="13"
          height="13"
          className={`mt-px transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </NavLink>

      {/* ---------- Level 2 panel ---------- */}
      <div
        className={[
          'absolute left-0 top-full z-50 pt-1 transition-all duration-200 ease-out',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0',
        ].join(' ')}
      >
        <ul
          className="glass-panel min-w-[280px] max-w-[340px] rounded-b-xl border-t-[3px] border-t-spist-maroon py-2 shadow-panel"
          role="menu"
          aria-label={item.label}
        >
          {item.children.map((child, index) => {
            const hasFlyout = Array.isArray(child.children) && child.children.length > 0;

            if (!hasFlyout) {
              return (
                <li key={child.href ?? child.label} role="none">
                  <NavLink
                    to={child.href}
                    role="menuitem"
                    className={({ isActive }) =>
                      [
                        'group flex items-center justify-between gap-3 border-l-[3px] px-5 py-2.5 text-[13.5px] leading-snug transition-all duration-150',
                        isActive
                          ? 'border-spist-maroon bg-spist-accent-soft font-semibold text-spist-green'
                          : 'border-transparent text-spist-charcoal hover:border-spist-accent hover:bg-spist-accent-soft hover:text-spist-green',
                      ].join(' ')
                    }
                  >
                    {child.label}
                  </NavLink>
                </li>
              );
            }

            return (
              <li
                key={child.label}
                role="none"
                className="relative"
                onMouseEnter={() => setOpenSub(index)}
                onMouseLeave={() => setOpenSub(null)}
              >
                <button
                  type="button"
                  role="menuitem"
                  aria-expanded={openSub === index}
                  aria-haspopup="true"
                  onFocus={() => setOpenSub(index)}
                  onClick={() => setOpenSub(openSub === index ? null : index)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setOpenSub(index);
                    }
                  }}
                  className={[
                    'flex w-full items-center justify-between gap-3 border-l-[3px] px-5 py-2.5 text-left text-[13.5px] leading-snug transition-all duration-150',
                    openSub === index
                      ? 'border-spist-accent bg-spist-accent-soft font-semibold text-spist-green'
                      : 'border-transparent text-spist-charcoal hover:border-spist-accent hover:bg-spist-accent-soft hover:text-spist-green',
                  ].join(' ')}
                >
                  <span>{child.label}</span>
                  <ChevronRight width="14" height="14" className="shrink-0 opacity-70" />
                </button>

                {/* ---------- Level 3 flyout ---------- */}
                <div
                  className={[
                    'absolute left-full top-0 z-50 pl-1 transition-all duration-200 ease-out',
                    openSub === index
                      ? 'visible translate-x-0 opacity-100'
                      : 'invisible -translate-x-2 opacity-0',
                  ].join(' ')}
                >
                  <ul
                    className="glass-panel min-w-[270px] rounded-xl border-t-[3px] border-t-spist-accent py-2 shadow-panel"
                    role="menu"
                    aria-label={child.label}
                  >
                    {child.children.map((grandchild) => (
                      <li key={grandchild.href} role="none">
                        <NavLink
                          to={grandchild.href}
                          role="menuitem"
                          className={({ isActive }) =>
                            [
                              'flex items-center border-l-[3px] px-5 py-2.5 text-[13.5px] leading-snug transition-all duration-150',
                              isActive
                                ? 'border-spist-maroon bg-spist-accent-soft font-semibold text-spist-green'
                                : 'border-transparent text-spist-charcoal hover:border-spist-accent hover:bg-spist-accent-soft hover:text-spist-green',
                            ].join(' ')
                          }
                        >
                          {grandchild.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
