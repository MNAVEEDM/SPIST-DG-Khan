import { useState } from 'react';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import { Clock, Facebook, Mail, MapPin, Phone, WhatsApp } from '../components/Icons';
import { institution } from '../data/site';

const CARDS = [
  {
    Icon: MapPin,
    title: 'Campus Address',
    lines: [institution.address],
  },
  {
    Icon: Phone,
    title: 'Phone',
    lines: institution.phones,
    hrefs: institution.phones.map((phone) => `tel:${phone.replace(/-/g, '')}`),
  },
  {
    Icon: Mail,
    title: 'Email',
    lines: [institution.email],
    hrefs: [`mailto:${institution.email}`],
  },
  {
    Icon: Clock,
    title: 'Office Hours',
    lines: ['Monday – Saturday', '8:00 AM – 4:00 PM'],
  },
];

export default function Contact() {
  // Frontend only — nothing is submitted anywhere.
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageBanner
        title="Contact Us"
        trail={['Contact Us']}
        intro={`Get in touch with the ${institution.shortName} administration, admissions office or any department directly.`}
      />

      {/* ---------- Contact cards ---------- */}
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-spist">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map(({ Icon, title, lines, hrefs }, index) => (
              <Reveal key={title} delay={index * 100}>
                <article className="group h-full rounded-xl border border-spist-line bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-spist-accent/60 hover:shadow-e3">
                  <span
                    className="mx-auto inline-flex h-13 w-13 items-center justify-center rounded-lg bg-spist-green/10 p-3.5 text-spist-green transition-colors duration-300 group-hover:bg-spist-green group-hover:text-white"
                    aria-hidden="true"
                  >
                    <Icon width="22" height="22" />
                  </span>

                  <h2 className="mt-4 font-display text-base font-bold">{title}</h2>

                  <div className="mt-2 space-y-1 text-[14px] leading-relaxed text-spist-muted">
                    {lines.map((line, lineIndex) =>
                      hrefs?.[lineIndex] ? (
                        <p key={line}>
                          <a
                            href={hrefs[lineIndex]}
                            className="break-all transition-colors hover:text-spist-green"
                          >
                            {line}
                          </a>
                        </p>
                      ) : (
                        <p key={line}>{line}</p>
                      ),
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* ---------- Form + map ---------- */}
          <div className="mt-14 grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <h2 className="font-display text-2xl font-bold">Send Us a Message</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-spist-muted">
                Fill in the form below and our team will respond during office hours.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="Full Name" required />
                  <Field id="email" label="Email Address" type="email" required />
                  <Field id="phone" label="Phone Number" type="tel" />
                  <Field id="subject" label="Subject" />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-[13.5px] font-semibold text-spist-charcoal"
                  >
                    Message <span className="text-spist-maroon">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full rounded-md border border-spist-line bg-white px-4 py-3 text-[14.5px] text-spist-charcoal transition-colors placeholder:text-spist-muted/60 focus:border-spist-accent focus:outline-none focus:ring-2 focus:ring-spist-accent/30"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-spist-green px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-spist-green-dark hover:shadow-lg"
                >
                  Send Message
                </button>

                {/* This site has no backend — the form is a static demonstration. */}
                <p
                  aria-live="polite"
                  className={`text-[13.5px] ${
                    submitted ? 'text-spist-green' : 'text-spist-muted'
                  }`}
                >
                  {submitted
                    ? 'Thank you — this is a frontend-only demo, so no message has actually been sent. Connect a backend or form service to enable delivery.'
                    : 'Note: this form is not connected to a backend and does not submit anywhere.'}
                </p>
              </form>
            </Reveal>

            {/* ---------- Map + socials ---------- */}
            <Reveal delay={140} className="lg:col-span-5">
              <div className="overflow-hidden rounded-xl border border-spist-line shadow-card">
                <div
                  className="brand-pattern flex h-72 flex-col items-center justify-center bg-gradient-to-br from-spist-green-deep via-spist-green to-spist-green-dark text-center"
                  role="img"
                  aria-label="Map of the SPIST campus location — embed to be added"
                >
                  <MapPin width="34" height="34" className="text-white/45" strokeWidth={1.4} />
                  <p className="mt-3 px-6 font-display text-base font-semibold text-white">
                    {institution.shortName}, {institution.city}
                  </p>
                  <p className="mt-1 px-6 text-[12px] uppercase tracking-[0.14em] text-white/55">
                    Google Maps embed to be added
                  </p>
                </div>

                <div className="border-t border-spist-line p-6">
                  <h2 className="font-display text-base font-bold">Follow SPIST</h2>
                  <p className="mt-1.5 text-[14px] text-spist-muted">
                    Campus news, results and announcements as they happen.
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <a
                      href={institution.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-spist-green px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-spist-green-dark"
                    >
                      <Facebook width="15" height="15" />
                      Facebook
                    </a>
                    <a
                      href={institution.social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border-2 border-spist-green px-4 py-2 text-[13.5px] font-semibold text-spist-green transition-colors hover:bg-spist-green hover:text-white"
                    >
                      <WhatsApp width="15" height="15" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ id, label, type = 'text', required = false }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13.5px] font-semibold text-spist-charcoal">
        {label} {required && <span className="text-spist-maroon">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="w-full rounded-md border border-spist-line bg-white px-4 py-3 text-[14.5px] text-spist-charcoal transition-colors placeholder:text-spist-muted/60 focus:border-spist-accent focus:outline-none focus:ring-2 focus:ring-spist-accent/30"
        placeholder={label}
      />
    </div>
  );
}
