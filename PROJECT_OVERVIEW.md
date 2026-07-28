# PROJECT_OVERVIEW.md

Generated documentation of the SPIST website codebase — for anyone (developer, reviewer, or future contributor) who needs to get oriented quickly.

---

## 1. Project Summary

This repository is the **official website frontend for the South Punjab Institute of Science & Technology (SPIST)**, a higher-education institute in Dera Ghazi Khan, Pakistan.

It is a **static, content-driven marketing/informational site** — not a web app with user accounts or dynamic data. It presents:

- A homepage with a rotating hero banner, institute stats, the chairperson's welcome message, vision/mission, academic programs (tabbed by faculty), short diploma/certificate courses, faculty profiles, news/notices, and a photo gallery.
- An **Academic** section with a faculty directory and dedicated department pages (Chemistry, Computer Science, English), each listing programs offered and teaching staff.
- A **Diploma & Certificate Programs** page listing 10 six-month diplomas and 16 three-month certificate courses.
- A **Contact** page with institute details and a contact form.
- A large number of navigation-only stub pages (Admissions, Discover SPIST, ORIC, QEC, Examination, DSA, Treasurer, Library, Students, etc.) that render a shared placeholder template until real content is supplied.

There is **no backend, no database, and no CMS** — every piece of text, every list, and the entire navigation tree live in one JavaScript data file (`src/data/site.js`), written so it could later be swapped for a real CMS/API without touching component code.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| UI library | **React 19** (`react`, `react-dom`) |
| Routing | **React Router 7** (`react-router-dom`), client-side `BrowserRouter` |
| Build tool / dev server | **Vite 8** (`@vitejs/plugin-react` for JSX + Fast Refresh) |
| Styling | **Tailwind CSS v4**, wired in via the `@tailwindcss/vite` plugin (no separate `tailwind.config.js` — theme tokens live directly in `src/index.css` under an `@theme` block) |
| Language | Plain JavaScript / JSX (no TypeScript) |
| Icons | Hand-written inline SVG components (`src/components/Icons.jsx`) — no icon library dependency |
| Fonts | Google Fonts — **Inter** (body) and **Poppins** (headings), loaded via `<link>` in `index.html` |
| Package manager | npm (`package-lock.json` present) |
| Module system | ESM (`"type": "module"` in `package.json`) |

No test runner, linter config, or CI pipeline is present in the repository (see [Notes / Known Issues](#8-notesknown-issues)).

---

## 3. Folder & File Structure

```
SPIST-DG-Khan/
├── index.html                      Vite entry HTML: fonts, favicon, meta tags, mounts <div id="root">
├── package.json                    npm scripts + dependency manifest
├── vite.config.js                  Vite config — React + Tailwind plugins, dev server on port 5173
├── README.md                       Contributor-facing docs (content editing guide, design tokens, a11y notes)
├── .gitignore                      Ignores node_modules, dist, .env*, editor folders, .qodo
│
├── public/                         Static assets served as-is at the site root
│   ├── hero/
│   │   └── hero background.jpeg    Photo used as the hero section's background image
│   ├── images/
│   │   ├── hero-campus.svg         Vector campus illustration (legacy hero art — see Notes)
│   │   ├── banner-campus.svg       Quieter vector art behind every inner-page banner
│   │   └── .gitkeep                Keeps the folder tracked before real photos are added
│   └── logo/
│       └── spist_logo.png          Official SPIST crest — the single logo asset used site-wide
│
└── src/
    ├── main.jsx                    React entry point — mounts <App/> in <BrowserRouter>/<StrictMode>
    ├── App.jsx                     App shell: skip-link, Navbar, route outlet, Footer, ScrollToTop
    ├── routes.jsx                  Builds the route table from the navigation config
    ├── index.css                   Tailwind v4 theme tokens + global design system (colors, shadows,
    │                                glass-nav effects, reveal animation, hero/banner backgrounds)
    │
    ├── data/
    │   ├── site.js                 SINGLE SOURCE OF TRUTH for all site content and the nav tree
    │   └── navUtils.js             Flattens the nav tree into a lookup for page titles + breadcrumbs
    │
    ├── hooks/
    │   └── useReveal.js            useReveal (scroll-reveal via IntersectionObserver) + useCountUp
    │
    ├── components/                 Reusable UI building blocks (20 files)
    │   ├── Navbar.jsx               Fixed two-tier glass header (utility strip + main nav)
    │   ├── MegaMenu.jsx             Desktop hover dropdown with nested flyout (levels 2 & 3)
    │   ├── MobileNav.jsx            Slide-in drawer with tap-to-expand accordions
    │   ├── Logo.jsx                 Renders the SPIST crest image everywhere it appears
    │   ├── Hero.jsx                 Auto-rotating 4-slide hero banner
    │   ├── StatsCounter.jsx         Animated count-up statistics strip
    │   ├── ChairpersonMessage.jsx   Chairperson portrait + welcome message
    │   ├── VisionMission.jsx        Vision & mission two-card section
    │   ├── AcademicPrograms.jsx     Tabbed (by faculty) academic programs section
    │   ├── ShortCourses.jsx         Homepage diploma/certificate preview columns
    │   ├── FacultyGrid.jsx          "Meet Our Faculty" card grid
    │   ├── NewsCards.jsx            News / notice board cards
    │   ├── Gallery.jsx              Filterable photo grid + keyboard-navigable lightbox
    │   ├── CTASection.jsx           "Begin your journey" call-to-action banner
    │   ├── Footer.jsx               Site footer: about, quick links, departments, contact, socials
    │   ├── PageBanner.jsx           Shared inner-page banner (title + breadcrumb)
    │   ├── DepartmentPage.jsx       Shared template for all department subpages
    │   ├── Reveal.jsx               Fade-in-on-scroll wrapper (used almost everywhere)
    │   ├── ScrollToTop.jsx          Resets scroll position on route change
    │   └── Icons.jsx                24 inline SVG icon components
    │
    └── pages/                       Route-level components
        ├── Home.jsx                 Composes every homepage section in order
        ├── Contact.jsx               Contact info cards + client-side-only contact form
        ├── InnerPage.jsx             Generic fallback template for nav items with no page yet
        ├── Academic.jsx               Faculty directory (3 faculties) + short-courses shortcut card
        ├── ShortCoursesPage.jsx       Full Diploma & Certificate Programs landing page
        ├── NotFound.jsx               404 page
        └── departments/
            ├── ChemistryDepartment.jsx        Chemistry programs + real 6-person faculty roster
            ├── ComputerScienceDepartment.jsx  CS programs + empty roster → "Coming Soon" state
            └── EnglishDepartment.jsx           English programs + real 6-person roster + Dean's email
```

---

## 4. Key Modules/Components

### Entry & routing
- **`src/main.jsx`** — Creates the React root and renders `<App />` wrapped in `<BrowserRouter>` and `<StrictMode>`.
- **`src/App.jsx`** — The persistent page shell: renders the skip-to-content link, `<Navbar />`, the `<Routes>` outlet (with a catch-all `NotFound` route), and `<Footer />`. Also mounts `<ScrollToTop />` so route changes reset scroll position.
- **`src/routes.jsx`** — Derives the entire route list from `flattenNavigation()` (see below) instead of a hand-maintained list. A small `CUSTOM_PAGES` map assigns bespoke components to specific paths (`/`, `/contact`, `/academic`, the three department pages, `/academic/short-courses`); every other nav path automatically renders the generic `InnerPage` template. A `PAGE_INTROS` map supplies short intro copy for specific stub pages.

### Data layer
- **`src/data/site.js`** (≈500 lines) — Every array/object the site renders: `institution` (contact info, socials, logo path), `navigation` (the nav tree — drives menus, footer links, *and* routing), `heroSlides`, `stats`, `chairperson`, `visionMission`, `faculties` (with nested `programs`), `diplomaPrograms`/`certificateCourses`, `facultyMembers`, `departmentFaculty` (per-department rosters keyed by route slug), `news`, `galleryCategories`/`galleryItems`, and `footerDepartments`. Items awaiting real institutional content are marked `// PLACEHOLDER`.
- **`src/data/navUtils.js`** — `flattenNavigation()` recursively flattens the (up to 3-level-deep) `navigation` tree into a flat `[{ href, label, trail }]` list; `navEntryFor(pathname)` looks up a route's title + breadcrumb trail from that flat list. Used by `routes.jsx`, `InnerPage`, `Academic`, `ShortCoursesPage`, and `DepartmentPage` so no page needs a second, separate title/breadcrumb config.

### Hooks
- **`src/hooks/useReveal.js`** — `useReveal()` attaches an `IntersectionObserver` to a ref and flips a `visible` flag (once) when the element scrolls into view, falling back to "always visible" if `IntersectionObserver` is unavailable. `useCountUp(end, { start })` animates an integer from 0 to `end` with an ease-out curve once triggered, and snaps straight to the final value under `prefers-reduced-motion`.

### Navigation components
- **`Navbar.jsx`** — Fixed, translucent ("glass") two-tier header: a utility strip (contact details, socials, Student Portal button) that collapses on scroll, and the main nav bar underneath. Toggles a `scrolled` state past 40px of scroll to increase glass opacity and add a shadow.
- **`MegaMenu.jsx`** — One top-level nav item's desktop dropdown. Handles hover-open with a close-delay (diagonal mouse travel), a nested level-3 "flyout" for items with grandchildren, and full keyboard support (`Enter`/`Space`/`↓` to open, `→` for flyouts, `Esc` to close and restore focus).
- **`MobileNav.jsx`** — Slide-in drawer for viewports under `xl` (1280px). Every level is a tap-to-expand accordion; locks body scroll while open and closes on `Esc` or route change.
- **`Logo.jsx`** — Renders `institution.logo` (`/logo/spist_logo.png`) everywhere the crest appears; an optional `chip` prop wraps it in a white rounded plate for use on dark/glass backgrounds.

### Homepage section components
`Hero.jsx`, `StatsCounter.jsx`, `ChairpersonMessage.jsx`, `VisionMission.jsx`, `AcademicPrograms.jsx`, `ShortCourses.jsx`, `FacultyGrid.jsx`, `NewsCards.jsx`, `Gallery.jsx`, `CTASection.jsx` — each is a self-contained `<section>` that pulls its own slice of data out of `site.js`, composed together in that order by `pages/Home.jsx`. Notable behavior:
- `Hero.jsx` auto-advances every 6.5s, pauses on hover/focus/tab-hidden, supports arrow-key and dot navigation, and announces slide changes via `aria-live`.
- `Gallery.jsx` supports category filtering and a keyboard-navigable (arrow keys/`Esc`) lightbox modal.
- `AcademicPrograms.jsx` implements the WAI-ARIA tabs pattern (roving tabindex, arrow/Home/End key navigation) and exports `iconFor(department)`, a small helper (also reused by `Academic.jsx` and `DepartmentPage.jsx`) that maps a department name to an icon.

### Shared/cross-page components
- **`PageBanner.jsx`** — The banner (title + breadcrumb, built from `navEntryFor`) shown at the top of every inner page.
- **`DepartmentPage.jsx`** — Shared template consumed by all three department wrapper pages: renders the banner, a "Programs Offered" card grid, and a "Department Faculty" table (desktop) / card list (mobile) with an explicit "Faculty List Coming Soon" empty state instead of fabricated names. Accepts an optional `deanEmail` prop for a small "Dean's Office" contact line.
- **`Reveal.jsx`** — Thin wrapper around `useReveal()` that adds a fade-and-rise-on-scroll animation to any element; `delay` staggers siblings.
- **`ScrollToTop.jsx`** — Resets `window.scrollTo` on every route change.
- **`Icons.jsx`** — 24 named inline SVG icon components (no external icon library).

### Page components
- **`Home.jsx`** — Just composes the ten homepage sections in order.
- **`Contact.jsx`** — Info cards (address/phone/email/hours) + a form that calls `event.preventDefault()` and flips local state; explicitly tells the user in the UI that nothing is actually submitted.
- **`InnerPage.jsx`** — Generic template (banner + placeholder body copy + a "Need Help?" / "Admissions Open" sidebar) used for every nav route that doesn't have dedicated content yet.
- **`Academic.jsx`** — Lists all three faculties with their programs, plus a shortcut card to `/academic/short-courses`.
- **`ShortCoursesPage.jsx`** — The full Diploma & Certificate Programs page: intro copy, "Why Choose SPIST" advantages list, the diploma course grid, the certificate course grid, a "Practical Learning" section, a "Career Opportunities" section, and a closing `CTASection`.
- **`NotFound.jsx`** — 404 page shown for any unmatched route.
- **`departments/*.jsx`** — Three near-identical one-file wrappers: each filters `faculties` for its department's programs and passes the matching `departmentFaculty[...]` roster into `DepartmentPage`. `EnglishDepartment.jsx` is the only one that also passes `deanEmail`.

---

## 5. How It Works

**Boot sequence:** `index.html` loads `/src/main.jsx` as an ES module → `main.jsx` renders `<App />` inside `<BrowserRouter>` → `App.jsx` renders the persistent chrome (`Navbar`, `Footer`, skip-link) around a React Router `<Routes>` outlet.

**Routing is generated, not hand-written.** `routes.jsx` calls `flattenNavigation()` over the `navigation` array in `data/site.js` to get every unique `href` in the nav tree, then builds one `<Route>` per href. A route either renders a bespoke component (from the `CUSTOM_PAGES` map — Home, Contact, Academic, the short-courses page, and the three department pages) or falls back to the shared `InnerPage` template. **Practical effect:** adding a new item to the `navigation` array in `site.js` automatically produces a working, navigable page — no separate route list to keep in sync.

**Content flows one way: `data/site.js` → components.** There is no state management library and no server round-trip; every component imports the specific arrays/objects it needs directly from `site.js` and renders them. The same `navigation` array simultaneously feeds the desktop `MegaMenu`, the mobile `MobileNav` drawer, the footer "Quick Links" column, and the router — so navigation stays perfectly in sync across all four surfaces by construction.

**Department pages are templated.** Rather than four separate hand-built pages, `DepartmentPage.jsx` is one shared component; each of the three files in `pages/departments/` is a thin wrapper that filters the shared `faculties`/`departmentFaculty` data down to its own department and hands it to the template as props. Adding a fourth department means adding one similar wrapper file plus a route registration — no changes to the template itself.

**Animation is scroll- and interaction-driven, not route-driven.** The `useReveal`/`useCountUp` hooks (backed by `IntersectionObserver` and `requestAnimationFrame`) power the fade-in-on-scroll effect (`Reveal.jsx`, used across nearly every section) and the animated stat counters, both of which respect `prefers-reduced-motion`.

**Styling is a single design-token file.** `src/index.css` imports Tailwind v4 and defines the entire brand system (`spist-green`/`spist-maroon`/`spist-accent`/`spist-charcoal` colors, shadow/elevation scale, motion durations, and the "glass" navbar effect) inside one `@theme` block, plus a handful of reusable component classes (`.container-spist`, `.btn-*`, `.eyebrow`, `.section-title`, `.glass-nav`, `.reveal`, `.hero-bg`, `.banner-bg`). There is no `tailwind.config.js` — Tailwind v4's CSS-first configuration is used instead.

**No backend anywhere.** The Contact page form is decorative (client-side `preventDefault` + local `submitted` state, explicit "not connected to a backend" message in the UI); the "Student Portal" links point at `institution.portalUrl`, currently `'#'`.

---

## 6. Dependencies

From `package.json`:

### Runtime dependencies
| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.0 | Core UI library — component model, hooks, rendering |
| `react-dom` | ^19.2.0 | Renders React components to the DOM (`createRoot`) |
| `react-router-dom` | ^7.18.1 | Client-side routing — `BrowserRouter`, `Routes`/`Route`, `Link`/`NavLink`, `useLocation` |

### Dev dependencies
| Package | Version | Purpose |
|---|---|---|
| `vite` | ^8.1.5 | Dev server (HMR) and production bundler; also provides `vite preview` |
| `@vitejs/plugin-react` | ^6.0.4 | Enables JSX transform and React Fast Refresh inside Vite |
| `tailwindcss` | ^4.3.3 | Utility-first CSS framework used for all styling |
| `@tailwindcss/vite` | ^4.3.3 | First-party Vite plugin for Tailwind v4 (CSS-native config, no `tailwind.config.js`) |

No runtime dependency beyond React + React Router + Google Fonts — icons, animations, and the design system are all hand-rolled rather than pulled from a component/icon library.

---

## 7. Setup & Run Instructions

**Prerequisites:** Node.js (a recent LTS; no `engines` field is pinned in `package.json`) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (Vite, hot-reloading)
npm run dev
# → opens http://localhost:5173 automatically (see vite.config.js: server.open = true)

# 3. Build for production
npm run build
# → outputs a static bundle to dist/

# 4. Preview the production build locally
npm run preview
```

**Deployment note:** Routing is client-side (`BrowserRouter`), so whatever static host serves `dist/` must be configured to rewrite all unmatched paths back to `index.html` (an SPA fallback rule) or deep links (e.g. `/academic/chemistry`) will 404 on direct load/refresh.

**Editing content:** everything user-visible lives in `src/data/site.js` — see the project `README.md` for a full content-editing guide (adding nav items, swapping placeholder images, adding a real inner page, adding a new department).

---

## 8. Notes/Known Issues

- **No backend, by design.** The Contact page form validates client-side and shows a confirmation message, but nothing is ever actually sent — this is intentional and stated directly in the UI, not a bug.
- **Extensive placeholder content**, all flagged with `// PLACEHOLDER` in `src/data/site.js`: the founding year, enrollment/faculty/year-of-service stats (estimated), per-program credit-hour figures (estimated), all 3 news items (sample notices), all 8 gallery captions (`src: null` everywhere — no real photos wired in), the Facebook URL (`https://facebook.com/`), and the Student Portal URL (`'#'`, currently a dead link in the navbar, mobile drawer, and footer). The **Faculty of Arts and Social Sciences** has no real program list yet — it's represented by a single synthetic placeholder program object ("Programs Announced Shortly").
- **Computer Science has no faculty roster** (`departmentFaculty['computer-science']` is `[]`). `DepartmentPage` correctly shows an explicit "Faculty List Coming Soon" state rather than inventing names, but the content itself is still outstanding.
- **Homepage faculty grid is incomplete relative to the data that exists.** `FacultyGrid.jsx` (the homepage's "Meet Our Faculty" section) iterates over `facultyMembers`, which currently contains **only the Chemistry department**. The English department's real 6-person roster lives in a separate literal array (`departmentFaculty.english`) that is *not* also included in `facultyMembers` — so English faculty appear correctly on `/academic/english` but never show up on the homepage grid, even though the data for them exists.
- **README is out of date on the hero background.** `README.md`'s "Hero & banner artwork" section describes the hero as using a generated vector illustration (`public/images/hero-campus.svg`) specifically because no photography was available. The current `src/index.css` `.hero-bg` rule instead loads a real photo, `public/hero/hero background.jpeg` (added in a later commit). `hero-campus.svg` is still present in the repo but appears to be unused now — worth either updating the README or removing the stale asset.
- **Hero photo filename/location is inconsistent with the rest of the project.** `hero background.jpeg` contains a literal space and lives in its own `public/hero/` folder, whereas every other asset uses hyphenated names under `public/images/` or `public/logo/`. It works today only because the CSS `url(...)` value is quoted; renaming to something like `hero-background.jpg` under `public/images/` would remove that fragility and match the existing convention.
- **No automated tests, linter, or CI.** There's no test runner (Jest/Vitest), no ESLint/Prettier config, and no `.github/workflows` — correctness currently depends entirely on manual review and manual browser testing.
- **`.env` is git-ignored but nothing reads environment variables** (there's no backend or API calls at all), so the `.env*` rules in `.gitignore` are currently inert — harmless, just worth knowing there's no `.env.example` to fill in.
- A `.qodo/` directory (empty `agents`/`workflows` subfolders) exists locally and is git-ignored — it's a local AI-tool artifact, not part of the shipped project.
