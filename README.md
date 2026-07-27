# SPIST — Official Website (Frontend)

Frontend for the **South Punjab Institute of Science & Technology (SPIST), Dera Ghazi Khan**.
React + Vite + Tailwind CSS. No backend, no database — all content is static data.

---

## Logo

The official logo is at:

```
public/logo/spist_logo.png
```

served at the root-relative URL `/logo/spist_logo.png`. `institution.logo` in
[`src/data/site.js`](src/data/site.js) is the single source for that path — every
place the logo appears (navbar, footer, mobile drawer, favicon) reads from it via
[`Logo.jsx`](src/components/Logo.jsx). There is no text-lockup fallback; the image is
the only logo asset site-wide, so if this file is ever moved or renamed, update
`institution.logo` (and `index.html`'s favicon `<link>`) to match — there's no
degraded state if the path is wrong.

The logo is never redrawn or recoloured; it is used exactly as supplied.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

---

## Editing content

**Everything the site renders lives in [`src/data/site.js`](src/data/site.js).**
No component holds hard-coded copy. Items marked `// PLACEHOLDER` need real
institutional content (see *Placeholder content* below).

### Navigation order

The `navigation` array is the single source of truth. It drives the desktop mega-menu,
the mobile accordion drawer, the footer "Quick Links" column, **and the router** — adding
an item with an `href` automatically produces a working page.

```js
{ label: 'Admissions', href: '/admissions/online', children: [...] }  // level-2 dropdown
{ label: 'Offices', children: [...] }                                // level-3 flyout (»)
```

Reordering the nav = reordering that array. Nothing else to touch.

### Images

Every image field is `null` by default and renders a branded placeholder. Drop real files
into `public/images/` and set the path:

| Data key | Field | Example |
|---|---|---|
| `heroSlides[]` | `image` | `'/images/hero-excellence.jpg'` |
| `chairperson` | `photo` | `'/images/chairperson.jpg'` |
| `facultyMembers[].members[]` | `photo` | `'/images/faculty/asif.jpg'` |
| `galleryItems[]` | `src` | `'/images/lab-chemistry.jpg'` |

### Adding a real inner page

Inner pages currently share the `InnerPage` template. To give one real content, build a
component and register it in [`src/routes.jsx`](src/routes.jsx):

```js
const CUSTOM_PAGES = {
  '/': Home,
  '/contact': Contact,
  '/discover/overview': Overview,   // ← your new page
};
```

---

## Structure

```
src/
├── data/
│   ├── site.js          ← ALL content + navigation config
│   └── navUtils.js      flattens nav into routes + breadcrumbs
├── components/
│   ├── Navbar.jsx       two-tier sticky header
│   ├── MegaMenu.jsx     desktop hover dropdown + nested flyout
│   ├── MobileNav.jsx    slide-in drawer with accordions
│   ├── Hero.jsx         auto-rotating 4-slide hero
│   ├── StatsCounter.jsx animated count-up on scroll
│   ├── ChairpersonMessage.jsx
│   ├── VisionMission.jsx
│   ├── AcademicPrograms.jsx   tabbed by faculty
│   ├── ShortCourses.jsx       diplomas + certificates
│   ├── FacultyGrid.jsx
│   ├── NewsCards.jsx
│   ├── Gallery.jsx      filterable grid + lightbox
│   ├── CTASection.jsx
│   ├── Footer.jsx
│   ├── PageBanner.jsx   inner-page banner + breadcrumb
│   ├── DepartmentPage.jsx    shared template: programs + faculty roster table
│   ├── Reveal.jsx       fade-in-on-scroll wrapper
│   ├── Logo.jsx         spist_logo.png with text fallback
│   └── Icons.jsx        inline SVG set (no icon library)
├── hooks/useReveal.js   IntersectionObserver + count-up
├── pages/
│   ├── Home.jsx, Contact.jsx, InnerPage.jsx, NotFound.jsx
│   ├── Academic.jsx           faculty directory + diploma/certificate quick-access card
│   ├── ShortCoursesPage.jsx   full Diploma & Certificate Programs page
│   └── departments/
│       ├── ChemistryDepartment.jsx        real 6-person faculty roster
│       ├── ComputerScienceDepartment.jsx  empty roster → "coming soon" state
│       └── EnglishDepartment.jsx          empty roster → "coming soon" state
├── routes.jsx           routes derived from the nav config
└── index.css            design tokens + component classes
```

### Department pages

Every department page (`/academic/chemistry`, `/academic/computer-science`,
`/academic/english`) renders through the single [`DepartmentPage`](src/components/DepartmentPage.jsx)
component: a banner, a "Programs Offered" card section (pulled from `faculties` in
`site.js` by matching `program.department`), and a "Department Faculty" table
(desktop) / card list (mobile) with columns S/No, Name, Qualification,
Institution/University, Designation, Nature of Appointment — sourced from
`departmentFaculty` in `site.js`.

To add a new department, create a one-file wrapper in `src/pages/departments/`
that filters `faculties` for its program(s) and passes a roster from
`departmentFaculty`, then register its route in `src/routes.jsx`. Departments
with no roster yet (currently `departmentFaculty['computer-science']`, `[]`)
automatically show a "Faculty List Coming Soon" panel instead of fabricated
names; drop real entries into the array to replace it.

A department page can also take an optional `deanEmail` prop (see
[`EnglishDepartment.jsx`](src/pages/departments/EnglishDepartment.jsx)), which
renders a small "Dean's Office" `mailto:` line under the department header. It's
opt-in per department — omit the prop and nothing renders.

---

## Brand palette

Defined once as Tailwind theme tokens in [`src/index.css`](src/index.css).

| Token | Hex | Usage |
|---|---|---|
| `spist-green` | `#186F42` | navbar, section headers, buttons, footer |
| `spist-accent` | `#56A975` | hover states, secondary buttons, tags, borders |
| `spist-maroon` | `#9D120F` | badges, primary CTAs, **active nav underline** |
| `spist-charcoal` | `#282823` | body text (never pure black) |
| white | `#FFFFFF` | page background, cards |

Supporting shades (`spist-green-dark`, `spist-green-deep`, `spist-maroon-dark`,
`spist-accent-soft`, `spist-muted`, `spist-line`) are derived from the same five.

Type: **Inter** (body) / **Poppins** (headings), loaded in `index.html`.

---

## Navigation behaviour

**Desktop (≥ 1280px)** — hover a top-level item to reveal its panel below it
(fade + slide, 180ms). Rows with a `»` chevron open a third-level flyout to the right.
A 160ms close delay lets the cursor travel diagonally into the panel.

**Keyboard** — `Tab` focuses and opens, `Enter`/`Space`/`↓` opens a dropdown,
`→` opens a nested flyout, `Esc` closes and restores focus, tabbing out closes.

**Mobile / tablet (< 1280px)** — slide-in drawer, tap-to-expand accordions at every
level. No hover dependency anywhere.

**Active page** — maroon underline on desktop, maroon left-border on mobile. Parent
items stay marked while any child route is active.

---

## Glass navigation

The header is **fixed** and sits on top of the hero / page banner. Both tiers are
translucent with `backdrop-filter: blur(12px) saturate(160%)` and a
`rgba(255,255,255,0.12)` hairline. Past 40px the main bar steps from 0.75 → 0.90
opacity and gains `0 4px 24px rgba(0,0,0,0.15)`; the utility strip collapses away.

The glass is tinted with **`#0F4F2E` (spist-green-dark)** rather than the primary
`#186F42`. At the specified 0.75 translucency the primary green composites to only
**3.64:1** against white nav text once white page content scrolls behind it — below
AA. The darker tint holds **4.87:1** in that same worst case while keeping the full
25% see-through, which reads glassier than dimming the effect by pushing the primary
green to 0.86 (the opacity it would need to pass). Dropdown panels use a
white glass at 0.92 so charcoal menu text stays at 13:1+ over anything.

Deliberately **not** glassed, per brief: the maroon active-item underline and the
maroon Student Portal button both stay fully solid.

Browsers without `backdrop-filter` get opaque fallbacks via `@supports not`.

Every page's first section carries `.header-offset` to clear the fixed header —
if you add a page that does not start with `Hero` or `PageBanner`, add that class
or the nav will overlap its content.

## Hero & banner artwork

No image-generation capability existed in the build environment, so the artwork is
the layered vector scene the brief specifies as the fallback:

- [`public/images/hero-campus.svg`](public/images/hero-campus.svg) — gradient mesh,
  contour lines, line-art academic building, atomic/orbital motif (6.2 KB)
- [`public/images/banner-campus.svg`](public/images/banner-campus.svg) — quieter
  version for inner-page banners, no building (2.2 KB)

SVG rather than WebP+JPG: both files are far smaller than a raster equivalent,
scale to any viewport without a `srcset`, and need no fallback chain.

The `.hero-bg` / `.banner-bg` rules composite the specified overlay
`linear-gradient(120deg, rgba(11,46,29,0.92), rgba(24,111,66,0.75) 55%, rgba(24,111,66,0.4))`
**on top of** the illustration, holding white hero text at 14.9:1. A matching
`background-color` paints before the SVG decodes, and the hero's height is fixed,
so there is no flash and no layout shift.

To swap in real photography, set `image: '/images/your-photo.jpg'` on any slide in
`heroSlides` — that slide then uses the photo with its own dark overlay instead.

## Accessibility

- Skip-to-content link as the first tab stop
- Full keyboard operation of menus, tabs, slider, gallery and lightbox
- `aria-expanded` / `aria-haspopup` / `role="menu"` on navigation; WAI-ARIA tabs pattern
  on the programs section; `aria-live` slide announcements
- Visible focus ring everywhere (white on dark green, maroon on light)
- Descriptive `alt` text; decorative graphics marked `aria-hidden`
- `prefers-reduced-motion` disables the reveal animations, count-up and hero autoplay
- **Contrast**: all 16 audited combinations meet WCAG AA. Worst case is the glass
  navbar at its most transparent over white content, at 4.87:1 (body-text
  threshold 4.5:1). Hero text sits at 14.9:1.
- **Touch targets**: every interactive control is ≥44×44px. Controls that must stay
  visually small (utility-bar social icons, hero slider dots) use the `.tap-target`
  helper, which expands the hit area to 44×44 without changing layout.

### Motion scale

| Token | Value | Used for |
|---|---|---|
| `--dur-fast` | 150ms | colour-only hovers |
| `--dur-base` | 200ms | buttons, links, nav items |
| `--dur-slow` | 300ms | cards, transforms, panels, glass density |
| — | 600ms | hero crossfade + scroll reveal (entrances) |

### Elevation scale

`shadow-e1` (chips) → `shadow-card` (resting cards) → `shadow-e3` (card hover) →
`shadow-panel` (menus, modals) → `shadow-glass` (scrolled navbar).

---

## Placeholder content to replace

These are marked `// PLACEHOLDER` in `src/data/site.js`:

| Item | Status |
|---|---|
| `spist_logo.png` | **real file, supplied** — `public/logo/spist_logo.png` |
| Six-month diploma list (10) | as supplied |
| Three-month certificate list (16) | as supplied |
| Chemistry faculty (6 members) | **real roster, as supplied** — name, qualification, institution, designation, appointment |
| English faculty (6 members) | **real roster, as supplied** — includes a Dean's Office contact link (`Dean@spist.edu.pk`), shown only on this department page |
| Computer Science faculty roster | **not yet supplied** — page shows a "Faculty List Coming Soon" state rather than invented names |
| Chairperson's message | drafted from the brief — needs approved text |
| Stats (years, students, faculty count) | estimated figures |
| Credit hours per program | estimated |
| News items (3) | sample notices |
| Gallery captions (8) | sample; all images are placeholders |
| Facebook URL, student portal URL | not supplied |
| Faculty of Arts & Social Sciences programs | none supplied — shows "announced shortly" |

---

## Notes

- Frontend only. The contact form validates and gives feedback but **submits nowhere** —
  it states this in the UI.
- No external runtime dependencies beyond React, React Router and the Google Fonts link.
  Icons are inline SVG.
- Routing is client-side (`BrowserRouter`); when deploying, configure the host to rewrite
  all paths to `index.html`.
