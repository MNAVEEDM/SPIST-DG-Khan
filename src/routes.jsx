import Home from './pages/Home';
import Contact from './pages/Contact';
import InnerPage from './pages/InnerPage';
import Academic from './pages/Academic';
import ShortCoursesPage from './pages/ShortCoursesPage';
import ChemistryDepartment from './pages/departments/ChemistryDepartment';
import ComputerScienceDepartment from './pages/departments/ComputerScienceDepartment';
import EnglishDepartment from './pages/departments/EnglishDepartment';
import { flattenNavigation } from './data/navUtils';

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
  '/academic/chemistry': ChemistryDepartment,
  '/academic/computer-science': ComputerScienceDepartment,
  '/academic/english': EnglishDepartment,
};

/** Short intro lines shown in the banner of specific inner pages. */
const PAGE_INTROS = {
  '/discover/overview':
    'An introduction to the South Punjab Institute of Science & Technology — our history, faculties and campus in Dera Ghazi Khan.',
  '/admissions/online': 'Apply online for degree, diploma and certificate programs at SPIST.',
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
  '/students':
    'Notices, downloads, societies, events and everything else students need day to day.',
};

/** Every unique href in the navigation tree, plus the top-level Academic hub. */
const navHrefs = [...new Set(flattenNavigation().map((entry) => entry.href))];

export const routes = [
  ...navHrefs.map((path) => ({
    path,
    Component: CUSTOM_PAGES[path] ?? InnerPage,
    intro: PAGE_INTROS[path],
  })),
];
