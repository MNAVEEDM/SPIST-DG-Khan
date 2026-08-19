import Home from './pages/Home';
import Contact from './pages/Contact';
import InnerPage from './pages/InnerPage';
import OfficeGroupPage from './pages/OfficeGroupPage';
import Academic from './pages/Academic';
import ShortCoursesPage from './pages/ShortCoursesPage';
import DiplomaProgramsPage from './pages/DiplomaProgramsPage';
import OnlineAdmissionPage from './pages/OnlineAdmissionPage';
import ApplicationStatusPage from './pages/ApplicationStatusPage';
import CertificateCoursesPage from './pages/CertificateCoursesPage';
import ChairpersonMessagePage from './pages/ChairpersonMessagePage';
import VisionMissionPage from './pages/VisionMissionPage';
import FacultyPage from './pages/FacultyPage';
import LatestNewsPage from './pages/LatestNewsPage';
import StudentsPage from './pages/StudentsPage';
import ChemistryDepartment from './pages/departments/ChemistryDepartment';
import ComputerScienceDepartment from './pages/departments/ComputerScienceDepartment';
import EnglishDepartment from './pages/departments/EnglishDepartment';
import { flattenNavigation } from './data/navUtils';
import { officeContent, officeContactEmails } from './data/officeContent';
import { officePersons } from './data/officePersons';
import { officeGroups } from './data/officeGroups';

/**
 * Routes are derived from the navigation config so that adding a nav item in
 * `src/data/site.js` automatically produces a working page — no route list to
 * keep in sync.
 *
 * Pages with bespoke components are registered in `CUSTOM_PAGES`; everything
 * else renders the shared `InnerPage` template, which pulls its title and
 * breadcrumb from the same nav config.
 */
const CUSTOM_PAGES = {
  '/': Home,
  '/contact': Contact,
  '/academic': Academic,
  '/academic/short-courses': ShortCoursesPage,
  '/admissions/online': OnlineAdmissionPage,
  '/admissions/status': ApplicationStatusPage,
  '/admissions/diploma-programs': DiplomaProgramsPage,
  '/admissions/certificate-courses': CertificateCoursesPage,
  '/discover/chairpersons-message': ChairpersonMessagePage,
  '/discover/vision-mission': VisionMissionPage,
  '/academic/chemistry': ChemistryDepartment,
  '/academic/computer-science': ComputerScienceDepartment,
  '/academic/english': EnglishDepartment,
  '/academic/faculty': FacultyPage,
  '/latest-news': LatestNewsPage,
  '/students': StudentsPage,
  ...Object.fromEntries(officeGroups.map((group) => [group.href, OfficeGroupPage])),
};

/** Short intro lines shown in the banner of specific inner pages. */
const PAGE_INTROS = {
  '/discover/overview':
    'An introduction to the South Punjab Institute of Science & Technology — our history, faculties and campus in Dera Ghazi Khan.',
  '/admissions/fee-structure':
    'Semester-wise fee details for all degree, diploma and certificate programs.',
  '/oric':
    'The Office of Research, Innovation & Commercialization supports research activity, industry linkage and the commercialisation of academic work.',
  '/qec':
    'The Quality Enhancement Cell monitors and continuously improves academic and administrative standards across the institute.',
  '/examination':
    'Examination schedules, rules, date sheets and result notifications issued by the Examination Department.',
  '/dsa':
    'The Directorate of Student Affairs oversees student welfare, societies, sports and co-curricular activities.',
  '/treasurer': 'Fee collection, financial services and accounts information for students.',
  '/library':
    'Print and digital collections, reading facilities, and borrowing services for students and faculty.',
  '/students': 'Campus life, facilities and support services for SPIST students.',
};

/** Every unique href in the navigation tree, plus the top-level Academic hub. */
const navHrefs = [...new Set(flattenNavigation().map((entry) => entry.href))];

const navRoutes = navHrefs.map((path) => ({
  path,
  Component: CUSTOM_PAGES[path] ?? InnerPage,
  intro: PAGE_INTROS[path],
  body: officeContent[path],
  contactEmail: officeContactEmails[path],
  person: officePersons[path],
  officeGroup: officeGroups.find((group) => group.href === path),
}));

/**
 * Office sub-role pages (e.g. Registrar, PS to Rector) are no longer part of
 * the nav tree itself — they're reached via "View details" cards on their
 * parent office's landing page (see `OfficeGroupPage` above and
 * `src/data/officeGroups.js`) rather than a nav flyout. They still need a
 * route, and an explicit title/trail since `navEntryFor` won't find them.
 */
const officeSubRoutes = officeGroups.flatMap((group) =>
  group.items.map((item) => ({
    path: item.href,
    Component: InnerPage,
    title: item.label,
    trail: ['Discover SPIST', 'Office', group.label, item.label],
    body: officeContent[item.href],
    contactEmail: officeContactEmails[item.href],
    person: officePersons[item.href],
  })),
);

export const routes = [...navRoutes, ...officeSubRoutes];
