/**
 * Inline SVG icon set — no icon library dependency, no external requests.
 * Every icon inherits `currentColor` and is hidden from screen readers
 * (icons here are always paired with visible or sr-only text).
 */

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

export const ChevronDown = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronRight = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ChevronLeft = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ArrowRight = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const Phone = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const Mail = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const MapPin = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const Clock = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const User = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Menu = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </svg>
);

export const Close = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const Plus = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const Facebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z" />
  </svg>
);

export const WhatsApp = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.19 8.19 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23z" />
  </svg>
);

export const Search = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const Quote = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M9.5 5C6.46 5 4 7.46 4 10.5S6.46 16 9.5 16c.17 0 .34 0 .5-.03V16c0 1.66-1.34 3-3 3v2c2.76 0 5-2.24 5-5v-5.5C12 7.46 9.54 5 9.5 5zm10 0C16.46 5 14 7.46 14 10.5S16.46 16 19.5 16c.17 0 .34 0 .5-.03V16c0 1.66-1.34 3-3 3v2c2.76 0 5-2.24 5-5v-5.5C22 7.46 19.54 5 19.5 5z" />
  </svg>
);

export const Check = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Calendar = (props) => (
  <svg {...base} width="16" height="16" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const Beaker = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <path d="M9 2v6.5L3.8 17a2 2 0 0 0 1.7 3h13a2 2 0 0 0 1.7-3L15 8.5V2" />
    <path d="M8 2h8M6.5 14h11" />
  </svg>
);

export const Book = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const Cpu = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
  </svg>
);

export const Globe = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const Target = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const Eye = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <path d="M2 12s3.64-7 10-7 10 7 10 7-3.64 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Trophy = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M7 5H4a1 1 0 0 0-1 1c0 2.5 1.5 4.5 4 5M17 5h3a1 1 0 0 1 1 1c0 2.5-1.5 4.5-4 5" />
  </svg>
);

export const Award = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <circle cx="12" cy="8" r="6" />
    <path d="m9 13.5-1.5 7L12 18l4.5 2.5-1.5-7" />
  </svg>
);

export const Heart = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <path d="M20.8 8.6a5.5 5.5 0 0 0-9.8-3.4 5.5 5.5 0 0 0-9.8 3.4c0 3.4 3.4 6.2 8.6 10.8l1.2 1.1 1.2-1.1c5.2-4.6 8.6-7.4 8.6-10.8z" />
  </svg>
);

export const MessageCircle = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const Users = (props) => (
  <svg {...base} width="24" height="24" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
