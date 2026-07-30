# PROJECT_OVERVIEW.md

Generated documentation of the SPIST website codebase — for anyone (developer, reviewer, or future contributor) who needs to get oriented quickly.

---

## 1. Project Summary

This repository is the **official website frontend for the South Punjab Institute of Science & Technology (SPIST)**, a higher-education institute in Dera Ghazi Khan, Pakistan.

It is a **static, content-driven marketing/informational site** — not a web app with user accounts or dynamic data. It presents:

- A slim **homepage**: a rotating hero banner, animated institute stats, a campus photo gallery, and a closing admissions call-to-action.
- Dedicated inner pages reachable from the navbar for content that used to live on the homepage: **Chairperson's Message**, **Vision & Mission**, **Our Faculty** (department-by-department roster), and **Latest News**.
- An **Academic** section with a faculty/program directory and dedicated department pages (Chemistry, Computer Science, English), each listing programs offered and a teaching-staff card grid.
- A **Diploma & Certificate Programs** page listing 10 six-month diplomas (as expandable accordions) and 16 three-month certificate courses.
- A **Contact** page with institute details and a client-side-only contact form.
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
| Icons | Hand-written inline SVG components (`src/components/Icons.jsx`, 24 icons) — no icon library dependency |
| Fonts | Google Fonts — **Inter** (body) and **Poppins** (headings), loaded via `<link>` in `index.html` |
| Package manager | npm (`package-lock.json` present) |
| Module system | ESM (`"type": "module"` in `package.json`) |

No test runner, linter config, or CI pipeline is present in the repository (see [Notes / Known Issues](#8-notesknown-issues)).

---

## 3. Folder & File Structure

*(Tracked files only — `git ls-files`. `dist/` and `node_modules/` are build/install output, gitignored, and omitted below.)*

```
SPIST-DG-Khan/
├── index.html                      Vite entry HTML: fonts, favicon, meta tags, mounts <div id="root">
├── package.json                    npm scripts + dependency manifest
├── vite.config.js                  Vite config — React + Tailwind plugins, dev server on port 5173
├── README.md                       Contributor-facing docs (content editing guide, design tokens, a11y notes —
│                                    partly out of date, see Notes/Known Issues)
├── .gitignore                      Ignores node_modules, dist, .env*, editor folders, .qodo
│
├── public/                         Static assets served as-is at the site root
│   ├── hero/
│   │   └── hero background.png     Real photo used as the hero section's background image
│   ├── campus gallary/events/
│   │   └── event 1.jpeg            The only real (non-placeholder) gallery photo currently wired in
│   ├── images/
│   │   ├── hero-campus.svg         Vector campus illustration — UNUSED (superseded by the photo above)
│   │   ├── banner-campus.svg       Quieter vector art still used behind every inner-page banner
│   │   └── .gitkeep                Keeps the folder tracked
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
    │   ├── site.js                 SINGLE SOURCE OF TRUTH for all site content and the nav tree (~750 lines)
    │   └── navUtils.js             Flattens the nav tree into a lookup for page titles + breadcrumbs
    │
    ├── hooks/
    │   └── useReveal.js            useReveal (scroll-reveal via IntersectionObserver) + useCountUp
    │
    ├── components/                 Reusable UI building blocks (20 files)
    │   ├── Navbar.jsx               Fixed two-tier glass header (utility strip + main nav)
    │   ├── MegaMenu.jsx             Desktop hover dropdown with nested flyout (levels 2 & 3)
    │   ├── MobileNav.jsx            Slide-in drawer with tap-to-expand accordions
    │   ├── Logo.jsx                 Renders spist_logo.png everywhere — no text-lockup fallback
    │   ├── Hero.jsx                 Auto-rotating 4-slide hero banner (used on the homepage)
    │   ├── StatsCounter.jsx         Animated count-up statistics strip (used on the homepage)
    │   ├── Gallery.jsx              Filterable photo grid + keyboard-navigable lightbox (used on the homepage)
    │   ├── CTASection.jsx           "Begin your journey" call-to-action banner (homepage + short-courses page)
    │   ├── ChairpersonMessage.jsx   ⚠ UNUSED — homepage teaser superseded by ChairpersonMessagePage.jsx
    │   ├── VisionMission.jsx        ⚠ UNUSED — homepage teaser superseded by VisionMissionPage.jsx
    │   ├── AcademicPrograms.jsx     ⚠ Default export UNUSED (tabbed programs section); only its exported
    │   │                             `iconFor()` helper is still imported (by Academic.jsx, DepartmentPage.jsx)
    │   ├── ShortCourses.jsx         ⚠ UNUSED — homepage teaser; ShortCoursesPage.jsx reimplements its own version
    │   ├── FacultyGrid.jsx          Default export UNUSED; its named export `FacultyDirectory` is used by
    │   │                             the homepage-teaser export itself and by the new /academic/faculty page
    │   ├── NewsCards.jsx            Default export UNUSED; its named export `NewsDirectory` is used by
    │   │                             the new /latest-news page
    │   ├── Footer.jsx               Site footer: about, quick links, departments, contact, socials
    │   ├── PageBanner.jsx           Shared inner-page banner (title + breadcrumb)
    │   ├── DepartmentPage.jsx       Shared template for all department subpages
    │   ├── Reveal.jsx               Fade-in-on-scroll wrapper (used almost everywhere)
    │   ├── ScrollToTop.jsx          Resets scroll position on route change
    │   └── Icons.jsx                24 inline SVG icon components
    │
    └── pages/                       Route-level components
        ├── Home.jsx                 Composes ONLY Hero + StatsCounter + Gallery + CTASection
        ├── Contact.jsx               Contact info cards + a client-side-only contact form
        ├── InnerPage.jsx             Generic fallback template for nav items with no page yet
        ├── Academic.jsx              Faculty/program directory (3 faculties) + short-courses shortcut card
        ├── ShortCoursesPage.jsx      Full Diploma & Certificate Programs landing page
        ├── ChairpersonMessagePage.jsx  Dedicated Chairperson's Message page (portrait + full message)
        ├── VisionMissionPage.jsx    Dedicated Vision & Mission page
        ├── FacultyPage.jsx          Dedicated "Our Faculty" page — renders FacultyGrid's FacultyDirectory
        ├── LatestNewsPage.jsx       Dedicated "Latest News" page — renders NewsCards' NewsDirectory
        ├── NotFound.jsx             404 page
        └── departments/
            ├── ChemistryDepartment.jsx        Chemistry programs + real 6-person faculty roster
            ├── ComputerScienceDepartment.jsx  CS programs + a 4-person roster (institution fields still null)
            └── EnglishDepartment.jsx          English programs + real 6-person roster + Dean's email
```

---

## 4. Key Modules/Components

### Entry & routing
- **`src/main.jsx`** — Creates the React root and renders `<App />` wrapped in `<BrowserRouter>` and `<StrictMode>`.
- **`src/App.jsx`** — The persistent page shell: renders the skip-to-content link, `<Navbar />`, the `<Routes>` outlet (with a catch-all `NotFound` route), and `<Footer />`. Also mounts `<ScrollToTop />` so route changes reset scroll position.
- **`src/routes.jsx`** — Derives the entire route list from `flattenNavigation()` (see below) instead of a hand-maintained list. A `CUSTOM_PAGES` map assigns bespoke components to specific paths: `/`, `/contact`, `/academic`, `/academic/short-courses`, `/academic/faculty`, `/latest-news`, `/discover/chairpersons-message`, `/discover/vision-mission`, and the three department pages. Every other nav path automatically renders the generic `InnerPage` template. A `PAGE_INTROS` map supplies short intro copy for specific stub pages.

### Data layer
- **`src/data/site.js`** (~750 lines) — Every array/object the site renders: `institution` (contact info, socials, logo path), `navigation` (the nav tree — drives menus, footer links, *and* routing), `heroSlides`, `stats`, `chairperson` + `chairpersonFullMessage` (short teaser copy vs. the full message content stream), `vision`/`mission`, `faculties` (with nested `programs`), `diplomaPrograms`/`certificateCourses` (plus `shortCoursesPage` supporting copy), `facultyMembers`, `departmentFaculty` (per-department rosters keyed by route slug), `news`, `galleryCategories`/`galleryItems`, and `footerDepartments`. Items awaiting real institutional content are marked `// PLACEHOLDER`.
- **`src/data/navUtils.js`** — `flattenNavigation()` recursively flattens the (up to 3-level-deep) `navigation` tree into a flat `[{ href, label, trail }]` list; `navEntryFor(pathname)` looks up a route's title + breadcrumb trail from that flat list. Used by `routes.jsx` and by nearly every page component so no page needs a second, separate title/breadcrumb config.

### Hooks
- **`src/hooks/useReveal.js`** — `useReveal()` attaches an `IntersectionObserver` to a ref and flips a `visible` flag (once) when the element scrolls into view, falling back to "always visible" if `IntersectionObserver` is unavailable. `useCountUp(end, { start })` animates an integer from 0 to `end` with an ease-out curve once triggered, and snaps straight to the final value under `prefers-reduced-motion`.

### Navigation components
- **`Navbar.jsx`** — Fixed, translucent ("glass") two-tier header: a utility strip (contact details, socials, Student Portal button) that collapses on scroll, and the main nav bar underneath. Toggles a `scrolled` state past 40px of scroll to increase glass opacity and add a shadow.
- **`MegaMenu.jsx`** — One top-level nav item's desktop dropdown. Handles hover-open with a close-delay (diagonal mouse travel), a nested level-3 "flyout" for items with grandchildren, and full keyboard support (`Enter`/`Space`/`↓` to open, `→` for flyouts, `Esc` to close and restore focus).
- **`MobileNav.jsx`** — Slide-in drawer for viewports under `xl` (1280px). Every level is a tap-to-expand accordion; locks body scroll while open and closes on `Esc` or route change.
- **`Logo.jsx`** — Renders `institution.logo` (`/logo/spist_logo.png`) everywhere the crest appears; an optional `chip` prop wraps it in a white rounded plate for use on dark/glass backgrounds. There is **no** text fallback — the image is the only logo asset site-wide.

### Homepage section components (actively used)
- **`Hero.jsx`** — Auto-advances every 6.5s, pauses on hover/focus/tab-hidden, supports arrow-key and dot navigation, and announces slide changes via `aria-live`. Background artwork is a shared CSS background (`.hero-bg` in `index.css`, `public/hero/hero background.png`); a per-slide `image` field (currently `null` for all 4 slides) can override it.
- **`StatsCounter.jsx`** — Animated count-up statistics strip, driven by `useCountUp`.
- **`Gallery.jsx`** — Category-filterable grid with a keyboard-navigable (arrow keys/`Esc`) lightbox modal.
- **`CTASection.jsx`** — Admissions call-to-action banner; reused at the bottom of `ShortCoursesPage`.

### Dead/orphaned homepage components (see [Notes/Known Issues](#8-notesknown-issues))
`ChairpersonMessage.jsx`, `VisionMission.jsx`, the default export of `AcademicPrograms.jsx`, `ShortCourses.jsx`, and the default exports of `FacultyGrid.jsx`/`NewsCards.jsx` were the original homepage teaser sections. `Home.jsx` no longer renders any of them. `AcademicPrograms.jsx` survives only for its exported `iconFor()` helper; `FacultyGrid.jsx`/`NewsCards.jsx` survive only for their named `FacultyDirectory`/`NewsDirectory` exports (reused by the new dedicated pages below). The other three files (`ChairpersonMessage.jsx`, `VisionMission.jsx`, `ShortCourses.jsx`) are entirely unreferenced — their dedicated-page replacements re-implement equivalent JSX inline rather than importing them.

### Shared/cross-page components
- **`PageBanner.jsx`** — The banner (title + breadcrumb, built from `navEntryFor`) shown at the top of every inner page.
- **`DepartmentPage.jsx`** — Shared template consumed by all three department wrapper pages: renders the banner, a "Programs Offered" card grid, and a "Department Faculty" **card grid** (2 columns on mobile, 4 on desktop — photo/initial tile, name, designation, qualification, institution, appointment badge) with an explicit "Faculty List Coming Soon" empty state instead of fabricated names. Accepts an optional `deanEmail` prop for a small "Dean's Office" contact line. *(Note: this is a uniform responsive card grid, not the desktop table the README still describes — see Notes.)*
- **`Reveal.jsx`** — Thin wrapper around `useReveal()` that adds a fade-and-rise-on-scroll animation to any element; `delay` staggers siblings.
- **`ScrollToTop.jsx`** — Resets `window.scrollTo` on every route change.
- **`Icons.jsx`** — 24 named inline SVG icon components (no external icon library).

### Page components
- **`Home.jsx`** — Composes just four sections, in order: `Hero`, `StatsCounter`, `Gallery`, `CTASection`.
- **`Contact.jsx`** — Info cards (address/phone/email/hours) + a form that calls `event.preventDefault()` and flips local state; explicitly tells the user in the UI that nothing is actually submitted.
- **`InnerPage.jsx`** — Generic template (banner + placeholder body copy + a "Need Help?" / "Admissions Open" sidebar) used for every nav route that doesn't have dedicated content yet.
- **`Academic.jsx`** — Lists all three faculties with their programs, plus a shortcut card to `/academic/short-courses`. (This is a different, simpler implementation than the retired `AcademicPrograms.jsx` tabbed section — it does not use tabs.)
- **`ShortCoursesPage.jsx`** — The full Diploma & Certificate Programs page: intro copy, "Why Choose SPIST" advantages list, an expandable-accordion diploma grid, a plain certificate-course grid, a "Practical Learning" section, a "Career Opportunities" section, and a closing `CTASection`.
- **`ChairpersonMessagePage.jsx`** — Portrait + short quote block, followed by the full message rendered from `chairpersonFullMessage.blocks` (a small content-stream renderer supporting `paragraph`/`heading`/`orderedList`/`unorderedList` block types) and a sign-off.
- **`VisionMissionPage.jsx`** — Two full-width cards (Vision, Mission) with supporting bullet points, rendered from the `vision`/`mission` data objects.
- **`FacultyPage.jsx`** — Banner + `FacultyDirectory` (imported from `FacultyGrid.jsx`), i.e. the department-by-department faculty card grid, now reachable from its own nav entry (`Academic → Our Faculty`) instead of only appearing on the homepage.
- **`LatestNewsPage.jsx`** — Banner + `NewsDirectory` (imported from `NewsCards.jsx`), the full news/notice card grid, reachable from its own top-level nav entry (`Latest News`).
- **`NotFound.jsx`** — 404 page shown for any unmatched route.
- **`departments/*.jsx`** — Three near-identical one-file wrappers: each filters `faculties` for its department's programs and passes the matching `departmentFaculty[...]` roster into `DepartmentPage`. `EnglishDepartment.jsx` is the only one that also passes `deanEmail`.

---

## 5. How It Works

**Boot sequence:** `index.html` loads `/src/main.jsx` as an ES module → `main.jsx` renders `<App />` inside `<BrowserRouter>` → `App.jsx` renders the persistent chrome (`Navbar`, `Footer`, skip-link) around a React Router `<Routes>` outlet.

**Routing is generated, not hand-written.** `routes.jsx` calls `flattenNavigation()` over the `navigation` array in `data/site.js` to get every unique `href` in the nav tree, then builds one `<Route>` per href. A route either renders a bespoke component (from the `CUSTOM_PAGES` map) or falls back to the shared `InnerPage` template. **Practical effect:** adding a new item to the `navigation` array in `site.js` automatically produces a working, navigable page — no separate route list to keep in sync.

**Content flows one way: `data/site.js` → components.** There is no state management library and no server round-trip; every component imports the specific arrays/objects it needs directly from `site.js` and renders them. The same `navigation` array simultaneously feeds the desktop `MegaMenu`, the mobile `MobileNav` drawer, the footer "Quick Links" column, and the router — so navigation stays perfectly in sync across all four surfaces by construction.

**The homepage is intentionally minimal; deep content lives behind the nav.** Rather than a single long scrolling page, `Home.jsx` renders only a hero, stats strip, photo gallery and a closing CTA. Content that used to be homepage sections — the Chairperson's message, Vision & Mission, the tabbed academic-programs browser, the diploma/certificate teaser, the full faculty roster, and the news feed — now each live on their own routed page (`ChairpersonMessagePage`, `VisionMissionPage`, `Academic`/`ShortCoursesPage`, `FacultyPage`, `LatestNewsPage`), reachable from the navbar (`Discover SPIST`, `Academic → Our Faculty`, `Latest News`). The original homepage-teaser components for several of these sections still exist on disk but are no longer imported anywhere (see [Notes/Known Issues](#8-notesknown-issues)).

**Department pages are templated.** Rather than three separate hand-built pages, `DepartmentPage.jsx` is one shared component; each of the three files in `pages/departments/` is a thin wrapper that filters the shared `faculties`/`departmentFaculty` data down to its own department and hands it to the template as props. Adding a fourth department means adding one similar wrapper file plus a route registration — no changes to the template itself.

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

**Editing content:** everything user-visible lives in `src/data/site.js` — see the project `README.md` for a fuller content-editing guide (adding nav items, swapping placeholder images, adding a real inner page, adding a new department), keeping in mind the discrepancies noted below.

---

## 8. Notes/Known Issues

- **Six homepage-section components are now dead code.** `ChairpersonMessage.jsx`, `VisionMission.jsx`, `ShortCourses.jsx`, and the default exports of `AcademicPrograms.jsx`, `FacultyGrid.jsx` and `NewsCards.jsx` were the original homepage teaser sections. Since `Home.jsx` was slimmed down to just `Hero`/`StatsCounter`/`Gallery`/`CTASection`, none of them are imported as default components anywhere in the codebase (verified by grep). `AcademicPrograms.jsx` and `FacultyGrid.jsx`/`NewsCards.jsx` still earn their keep via named exports (`iconFor`, `FacultyDirectory`, `NewsDirectory`) reused elsewhere, but `ChairpersonMessage.jsx`, `VisionMission.jsx`, and `ShortCourses.jsx` are entirely unreferenced — their replacement pages (`ChairpersonMessagePage.jsx`, `VisionMissionPage.jsx`, `ShortCoursesPage.jsx`) re-implement equivalent markup inline rather than importing them. Worth either deleting the three fully-dead files or wiring the still-partially-used ones to share more code with their page-level replacements.
- **README.md is out of date in two places.** (1) Its "Structure" tree and "Department pages" section describe `DepartmentPage.jsx` as rendering a **table** on desktop / card list on mobile; the current implementation is a single responsive **card grid** (2 columns → 4 columns) with no table markup at any breakpoint. (2) Its "Hero & banner artwork" section says the hero uses the generated vector illustration `hero-campus.svg` specifically because no photography was available; `src/index.css`'s `.hero-bg` rule now loads a real photo instead, `public/hero/hero background.png` (a later addition). `hero-campus.svg` is still present in the repo but is unused. The README also doesn't yet mention the `FacultyPage`/`LatestNewsPage`/`ChairpersonMessagePage`/`VisionMissionPage` routes or the homepage's four-section shape.
- **No backend, by design.** The Contact page form validates client-side and shows a confirmation message, but nothing is ever actually sent — this is intentional and stated directly in the UI, not a bug.
- **Extensive placeholder content**, all flagged with `// PLACEHOLDER` in `src/data/site.js`: the founding year, enrollment/faculty/year-of-service stats (estimated), per-program credit-hour figures (estimated), all 3 news items (sample notices), 7 of 8 gallery captions (`src: null` — only "Annual Science Exhibition" has a real photo wired in, at `public/campus gallary/events/event 1.jpeg`), the Facebook URL (`https://facebook.com/`), and the Student Portal URL (`'#'`, currently a dead link in the navbar, mobile drawer, and footer). The **Faculty of Arts and Social Sciences** has no real program list yet — it's represented by a single synthetic placeholder program object ("Programs Announced Shortly").
- **Computer Science's faculty roster is only partially real.** `departmentFaculty['computer-science']` has 4 named staff, but each entry's `institution` field is `null` (marked `// PLACEHOLDER — awarding institution not yet supplied`), so the department card grid will show a blank institution line for all four until that data is supplied.
- **`galleryItems` folder name has a typo/inconsistency.** The one real gallery photo lives at `public/campus gallary/events/event 1.jpeg` — "gallary" (not "gallery") and a literal space in both the folder and file name, unlike the hyphenated convention used elsewhere (`banner-campus.svg`, `hero-campus.svg`). It works today only because the path is used as a quoted string literal in `site.js`; consider renaming to match the project's naming convention.
- **No automated tests, linter, or CI.** There's no test runner (Jest/Vitest), no ESLint/Prettier config, and no `.github/workflows` — correctness currently depends entirely on manual review and manual browser testing.
- **`.env` is git-ignored but nothing reads environment variables** (there's no backend or API calls at all), so the `.env*` rules in `.gitignore` are currently inert — harmless, just worth knowing there's no `.env.example` to fill in.
- A `dist/` folder exists locally from a previous `npm run build` and is git-ignored (not part of the repository) — it still contains an older `hero background.jpeg`, left over from before the hero photo was swapped to `.png`; running `npm run build` again will refresh it and remove the stale file.
