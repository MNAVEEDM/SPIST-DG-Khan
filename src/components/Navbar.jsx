import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { institution, navigation } from '../data/site';
import { Facebook, Mail, MapPin, Menu, Phone, WhatsApp } from './Icons';
import Logo from './Logo';
import MegaMenu from './MegaMenu';
import MobileNav from './MobileNav';
import PortalMenu from './PortalMenu';

/**
 * Two-tier glass header:
 *   tier 1 — thin utility strip (contact details, socials, portal button)
 *   tier 2 — primary navigation bar, glass green, logo on the left
 *
 * The header is FIXED and sits on top of the hero / page banner, so both
 * tiers are translucent with a backdrop blur. Past 40px the main bar steps
 * up from 78% to 92% opacity and gains a shadow, which keeps white text
 * above 4.5:1 once white page content is scrolling underneath. The utility
 * strip collapses away at the same point to keep the fixed header compact.
 *
 * Deliberately NOT glassed: the maroon active-item underline and the maroon
 * Login button both stay fully solid for emphasis.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Publishes the header's real height as `--header-h`, which `.header-offset`
   * and `scroll-padding-top` both consume (see index.css).
   *
   * It has to be measured rather than hard-coded: the height moves with the
   * logo size, and the utility strip above it wraps to a second line on narrow
   * screens. A fixed padding guess was leaving every inner page's <h1> partly
   * behind the bar.
   *
   * The height is read while unscrolled — that is when the utility strip is
   * expanded and the header is at its tallest, and it is also the only moment
   * the offset matters, since the banner sits at the very top of the page.
   */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const publish = () => {
      if (window.scrollY > 40) return;
      document.documentElement.style.setProperty(
        '--header-h',
        `${Math.round(header.getBoundingClientRect().height)}px`,
      );
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 w-full">
      {/* ---------------- Tier 1 — utility bar ---------------- */}
      <div
        className={`glass-utility overflow-hidden text-white transition-[max-height,opacity] duration-300 ease-out ${
          scrolled ? 'max-h-0 border-b-0 opacity-0' : 'max-h-20 opacity-100'
        }`}
      >
        <div className="container-spist on-dark flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5 text-[12.5px]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="hidden items-center gap-1.5 text-white/85 lg:inline-flex">
              <MapPin width="13" height="13" className="text-spist-accent" />
              {institution.city}, Punjab, Pakistan
            </span>

            <a
              href={`tel:${institution.phones[0].replace(/-/g, '')}`}
              className="inline-flex items-center gap-1.5 py-1.5 text-white/90 transition-colors duration-200 hover:text-white"
            >
              <Phone width="13" height="13" className="text-spist-accent" />
              {institution.phones[0]}
            </a>

            <a
              href={`tel:${institution.phones[1].replace(/-/g, '')}`}
              className="hidden items-center gap-1.5 py-1.5 text-white/90 transition-colors duration-200 hover:text-white sm:inline-flex"
            >
              <Phone width="13" height="13" className="text-spist-accent" />
              {institution.phones[1]}
            </a>

            <a
              href={`mailto:${institution.email}`}
              className="hidden items-center gap-1.5 py-1.5 text-white/90 transition-colors duration-200 hover:text-white md:inline-flex"
            >
              <Mail width="13" height="13" className="text-spist-accent" />
              {institution.email}
            </a>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={institution.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target rounded p-1.5 text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label="SPIST on Facebook (opens in a new tab)"
            >
              <Facebook width="14" height="14" />
            </a>
            <a
              href={institution.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target rounded p-1.5 text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Contact SPIST on WhatsApp (opens in a new tab)"
            >
              <WhatsApp width="14" height="14" />
            </a>
          </div>
        </div>
      </div>

      {/* ---------------- Tier 2 — primary navigation ---------------- */}
      <div className={`on-dark glass-nav ${scrolled ? 'glass-nav-scrolled' : ''}`}>
        {/* Every child below is placed on an explicit column. Auto-placement
            cannot be relied on here: below `nav:` the desktop menu is
            display:none, which takes it out of the grid entirely, and the
            drawer button then slides into the empty middle column and renders
            mid-screen instead of at the right edge.

            Padded rather than wrapped in `container-spist`: the desktop menu
            is close to 1220px on its own, so capping this row at the
            container's 1280px would push it off the right edge. */}
        <div className="grid w-full grid-cols-[minmax(110px,1fr)_auto_minmax(110px,1fr)] items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand — white chip keeps the crest crisp against the glass. The
              minmax() floor on this column (matched on the mirror column on
              the right) keeps the logo from ever being squeezed by the grid
              — it just reserves an equal gutter on both sides so the nav
              block below tracks the true center of the row. */}
          <Link
            to="/"
            className="col-start-1 flex shrink-0 items-center justify-self-start py-2"
            aria-label={`${institution.shortName} — home`}
          >
            <Logo
              chip
              className={`w-auto transition-[height] duration-300 ease-out ${
                scrolled ? 'h-11' : 'h-14'
              }`}
            />
          </Link>

          {/* Desktop navigation — centered across the full row via the flanking columns */}
          <nav aria-label="Main navigation" className="col-start-2 hidden nav:block">
            <ul className="flex items-center">
              {navigation.map((item, index) => (
                <MegaMenu
                  key={item.label}
                  item={item}
                  isOpen={openIndex === index}
                  onOpen={() => setOpenIndex(index)}
                  onClose={() => setOpenIndex((current) => (current === index ? null : current))}
                />
              ))}
            </ul>
          </nav>

          {/* Right gutter — the column that mirrors the logo's, so the nav
              block above stays centred on the row. Login sits at the far edge
              on every size; the drawer trigger joins it below xl. */}
          <div className="flex items-center justify-end gap-1.5 justify-self-end">
            <PortalMenu
              open={portalOpen}
              onOpen={() => setPortalOpen(true)}
              onClose={() => setPortalOpen(false)}
            />

            {/* Drawer trigger — 44x44 minimum */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="-mr-1 flex h-11 w-11 items-center justify-center rounded-md text-white transition-colors duration-200 hover:bg-white/10 xl:hidden"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-navigation"
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
