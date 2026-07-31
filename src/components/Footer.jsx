import { Link } from 'react-router-dom';
import { footerDepartments, institution, navigation } from '../data/site';
import { ArrowRight, Clock, Facebook, Mail, MapPin, Phone, WhatsApp } from './Icons';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-spist-green-deep text-white/75">
      {/* Top accent rule */}
      <span
        className="block h-1 bg-gradient-to-r from-spist-maroon via-spist-accent to-spist-maroon"
        aria-hidden="true"
      />

      <div className="container-spist grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
        {/* ---------- About ---------- */}
        <div>
          <Logo chip className="h-14 w-auto" />

          <h2 className="mt-5 font-display text-base font-bold leading-snug text-white">
            {institution.name}
          </h2>

          <p className="mt-3 text-[14px] leading-relaxed">
            An institute of higher learning in {institution.city} committed to affordable, quality
            education in the sciences, arts and languages — combining rigorous academics with
            practical, skills-based training.
          </p>

          <p className="mt-4 font-display text-[15px] text-spist-accent" dir="rtl" lang="ar">
            وَلَا غَالِبَ إِلَّا اللّٰه
          </p>
        </div>

        {/* ---------- Quick links (mirrors main nav) ---------- */}
        <nav aria-labelledby="footer-quick-links">
          <h2
            id="footer-quick-links"
            className="font-display text-sm font-bold uppercase tracking-[0.13em] text-white"
          >
            Quick Links
          </h2>
          <span className="mt-3 block h-0.5 w-10 bg-spist-maroon" aria-hidden="true" />

          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 lg:grid-cols-1 lg:gap-y-2.5">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  title={item.title}
                  className="group inline-flex items-center gap-1.5 text-[14px] transition-colors hover:text-white"
                >
                  <ArrowRight
                    width="12"
                    height="12"
                    className="text-spist-accent transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------- Departments ---------- */}
        <nav aria-labelledby="footer-departments">
          <h2
            id="footer-departments"
            className="font-display text-sm font-bold uppercase tracking-[0.13em] text-white"
          >
            Faculties &amp; Departments
          </h2>
          <span className="mt-3 block h-0.5 w-10 bg-spist-maroon" aria-hidden="true" />

          <ul className="mt-5 space-y-2.5">
            {footerDepartments.map((department) => (
              <li key={department.href}>
                <Link
                  to={department.href}
                  className="group inline-flex items-start gap-1.5 text-[14px] leading-snug transition-colors hover:text-white"
                >
                  <ArrowRight
                    width="12"
                    height="12"
                    className="mt-1 shrink-0 text-spist-accent transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                  {department.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------- Contact ---------- */}
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.13em] text-white">
            Contact Us
          </h2>
          <span className="mt-3 block h-0.5 w-10 bg-spist-maroon" aria-hidden="true" />

          <address className="mt-5 space-y-3.5 text-[14px] not-italic leading-relaxed">
            <p className="flex items-start gap-2.5">
              <MapPin width="15" height="15" className="mt-1 shrink-0 text-spist-accent" />
              {institution.address}
            </p>

            <p className="flex items-start gap-2.5">
              <Phone width="15" height="15" className="mt-1 shrink-0 text-spist-accent" />
              <span className="flex flex-col">
                {institution.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/-/g, '')}`}
                    className="transition-colors hover:text-white"
                  >
                    {phone}
                  </a>
                ))}
              </span>
            </p>

            <p className="flex items-start gap-2.5">
              <Mail width="15" height="15" className="mt-1 shrink-0 text-spist-accent" />
              <a
                href={`mailto:${institution.email}`}
                className="break-all transition-colors hover:text-white"
              >
                {institution.email}
              </a>
            </p>

            <p className="flex items-start gap-2.5">
              <Clock width="15" height="15" className="mt-1 shrink-0 text-spist-accent" />
              Monday – Saturday, 8:00 AM – 4:00 PM
            </p>
          </address>

          {/* Socials */}
          <div className="mt-5 flex items-center gap-2.5">
            <a
              href={institution.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors duration-200 hover:bg-spist-accent hover:text-white"
              aria-label="SPIST on Facebook (opens in a new tab)"
            >
              <Facebook width="15" height="15" />
            </a>
            <a
              href={institution.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors duration-200 hover:bg-spist-accent hover:text-white"
              aria-label="Contact SPIST on WhatsApp (opens in a new tab)"
            >
              <WhatsApp width="15" height="15" />
            </a>
          </div>

          {/* Campus map */}
          <div className="mt-5 overflow-hidden rounded-lg border border-white/12">
            <iframe
              title={`Map showing the ${institution.shortName} campus location`}
              src={institution.location.mapEmbedUrl}
              className="h-28 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className="border-t border-white/12">
        <div className="container-spist flex flex-col items-center justify-between gap-3 py-5 text-[13px] sm:flex-row">
          <p>
            &copy; {year} {institution.name} ({institution.shortName}), {institution.city}. All
            rights reserved.
          </p>

          <ul className="flex items-center gap-5">
            <li>
              <Link to="/contact" className="transition-colors hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/students" className="transition-colors hover:text-white">
                Students
              </Link>
            </li>
            <li>
              <a href={institution.portalUrl} className="transition-colors hover:text-white">
                Student Portal
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
