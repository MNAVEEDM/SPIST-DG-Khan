import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { institution, navigation } from '../data/site';
import { Facebook, Mail, MapPin, Menu, Phone, User, WhatsApp } from './Icons';
import Logo from './Logo';
import MegaMenu from './MegaMenu';
import MobileNav from './MobileNav';

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
 * Student Portal button both stay fully solid for emphasis.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
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

            {/* Solid maroon — intentionally not glassed */}
            <a
              href={institution.portalUrl}
              className="ml-1.5 inline-flex items-center gap-1.5 rounded bg-spist-maroon px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-white shadow-e1 transition-colors duration-200 hover:bg-spist-maroon-dark"
            >
              <User width="13" height="13" />
              <span className="hidden sm:inline">Student Portal</span>
              <span className="sm:hidden">Login</span>
            </a>
          </div>
        </div>
      </div>

      {/* ---------------- Tier 2 — primary navigation ---------------- */}
      <div className={`on-dark glass-nav ${scrolled ? 'glass-nav-scrolled' : ''}`}>
        <div className="container-spist flex items-center justify-between gap-4">
          {/* Brand — white chip keeps the crest crisp against the glass */}
          <Link
            to="/"
            className="flex shrink-0 items-center py-2 pl-0.5"
            aria-label={`${institution.shortName} — home`}
          >
            <Logo
              chip
              className={`w-auto transition-[height] duration-300 ease-out ${
                scrolled ? 'h-9' : 'h-11'
              }`}
            />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main navigation" className="hidden xl:block">
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

      <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
