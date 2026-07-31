/* ============================================================================
 * SPIST — Named office-holder staff cards.
 *
 * Compact profile shown at the top of select Discover SPIST > Office pages,
 * keyed by route path, rendered by `src/components/StaffCard.jsx` above the
 * page's descriptive content (see `src/pages/InnerPage.jsx`). Follows the
 * photo + name + designation + email card format used by the reference site
 * (ue.edu.pk/office.php) rather than a long-form message.
 *
 * Each entry: { name, designation, email, photo }.
 * ==========================================================================*/

export const officePersons = {
  '/discover/offices/administration-offices/registrar': {
    name: 'Mr. Muhammad Usman',
    designation: 'Registrar',
    email: 'registrar@spist.edu.pk',
    photo: null, // PLACEHOLDER — '/images/registrar.jpg'
  },

  '/discover/offices/qec/director-office': {
    name: 'Dr. Muhammad Ijaz Hussain',
    designation: 'Director QEC',
    email: 'qec@spist.edu.pk',
    photo: null, // PLACEHOLDER — '/images/director-qec.jpg'
  },

  '/discover/offices/examination-department/controller-examination': {
    name: 'Ms. Mahrukh',
    designation: 'Controller of Examination',
    email: 'controller@spist.edu.pk',
    photo: null, // PLACEHOLDER — '/images/controller-examination.jpg'
  },

  '/oric': {
    name: 'Dr. Muhammad Sher Jahan',
    designation: 'Director ORIC',
    email: 'oric@spist.edu.pk',
    photo: null, // PLACEHOLDER — '/images/director-oric.jpg'
  },
};
