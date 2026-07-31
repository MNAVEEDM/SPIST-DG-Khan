/* ============================================================================
 * SPIST — Office landing-page groups.
 *
 * The Office menu under Discover SPIST is a flat list of top-level offices
 * (see `navigation` in `src/data/site.js`). Every top-level office that has
 * more than one sub-role — Rector, Administration Office, Finance Office,
 * Examination Department, DSA, QEC, Central Library, Security Office — gets
 * its own landing page (rendered by `src/pages/OfficeGroupPage.jsx`) showing
 * a "View details" card for each sub-role; each card links through to that
 * sub-role's own dedicated page (content in `src/data/officeContent.js`,
 * unchanged by this grouping).
 *
 * ORIC Office has no sub-items, so it isn't listed here — it stays a normal
 * single page (`/oric`), same as before.
 *
 * Each group: { label, href, intro, items: [{ label, href }] }.
 * ==========================================================================*/

export const officeGroups = [
  {
    label: 'Rector',
    href: '/discover/offices/rector-office',
    intro:
      "The Rector provides institutional leadership for SPIST, supported by the Rector's Office and the PS to Rector.",
    items: [
      { label: 'Rector Office', href: '/discover/offices/rector-office/rector-office' },
      { label: 'PS to Rector', href: '/discover/offices/rector-office/ps-to-rector' },
    ],
  },
  {
    label: 'Administration Office',
    href: '/discover/offices/administration-offices',
    intro:
      'The Administration Office covers the day-to-day administrative functions of the institute — student records, general administration, and registration.',
    items: [
      { label: 'Registrar', href: '/discover/offices/administration-offices/registrar' },
      { label: 'Admin Office', href: '/discover/offices/administration-offices/admin-office' },
      {
        label: 'Registration Branch',
        href: '/discover/offices/administration-offices/registration-branch',
      },
    ],
  },
  {
    label: 'Finance Office',
    href: '/discover/offices/finance-office',
    intro:
      'The Finance Office manages budgeting, fee collection, and the day-to-day financial operations of the institute.',
    items: [
      { label: 'Treasurer Office', href: '/discover/offices/finance-office/treasurer-office' },
      { label: 'Account Office', href: '/discover/offices/finance-office/account-office' },
      { label: 'Staff Office', href: '/discover/offices/finance-office/staff-office' },
    ],
  },
  {
    label: 'Examination Department',
    href: '/discover/offices/examination-department',
    intro:
      'The Examination Department oversees the planning, conduct, and results of examinations across all programs offered at SPIST.',
    items: [
      {
        label: 'Controller Examination',
        href: '/discover/offices/examination-department/controller-examination',
      },
      {
        label: 'Asst Controller of Examination',
        href: '/discover/offices/examination-department/asst-controller-of-examination',
      },
      { label: 'Form Section', href: '/discover/offices/examination-department/form-section' },
      {
        label: 'Conduct Branch',
        href: '/discover/offices/examination-department/conduct-branch',
      },
      {
        label: 'Results Section',
        href: '/discover/offices/examination-department/results-section',
      },
    ],
  },
  {
    label: 'DSA',
    href: '/discover/offices/dsa',
    intro:
      'The Directorate of Student Affairs (DSA) is responsible for student welfare, discipline, and campus life outside the classroom.',
    items: [
      {
        label: 'Director Student Office',
        href: '/discover/offices/dsa/director-student-office',
      },
    ],
  },
  {
    label: 'QEC',
    href: '/discover/offices/qec',
    intro:
      'The Quality Enhancement Cell (QEC) monitors and continuously improves academic and administrative quality across the institute.',
    items: [
      { label: 'Director Office', href: '/discover/offices/qec/director-office' },
      { label: 'Deputy Director', href: '/discover/offices/qec/deputy-director' },
      { label: 'Our Staff Office', href: '/discover/offices/qec/our-staff-office' },
    ],
  },
  {
    label: 'Central Library',
    href: '/discover/offices/central-library',
    intro:
      "The Central Library is SPIST's principal academic resource centre, providing print and digital collections and research support.",
    items: [{ label: 'Librarian', href: '/discover/offices/central-library/librarian' }],
  },
  {
    label: 'Security Office',
    href: '/discover/offices/security-office',
    intro:
      "The Security Office is responsible for the safety and security of SPIST's campus.",
    items: [
      {
        label: 'Chief Security Office',
        href: '/discover/offices/security-office/chief-security-office',
      },
    ],
  },
];
