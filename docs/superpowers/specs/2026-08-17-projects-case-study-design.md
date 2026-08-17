# Projects Section Redesign + Case Study Page

Date: 2026-08-17
Status: Approved

## Goal

Upgrade `Main/pretty/projects.html` from a static 4-image grid into a data-driven
project gallery with a rich hover overlay, plus a new `project-details.html`
case-study template. Pure HTML/CSS/JS (no backend, no frameworks). Structured so a
future backend swap only requires replacing the data source.

## Data model

`assets/js/projects-data.js` exports `window.PROJECTS`, an array of project objects:

```js
{
  slug, title, category, shortDescription, techStack: [],
  thumbnail, banner,
  overview, problem, journey, functionality,
  features: [],
  screenshots: [],       // optional
  importantPages: [],    // optional, [{ label, image }]
  links: { github, live, app, figma, other: [{ label, url }] }, // all optional
  additionalInfo         // optional
}
```

Only `slug/title/category/thumbnail/banner/shortDescription` are required. The
details page only renders a section when its data is present.

3 placeholder projects (web-dev themed, matching the sidebar's "WordPress
Designer & Developer" persona), reusing `assets/images/work/1-4.jpg` as
thumbnails/banners:
1. **Nimbus Analytics Dashboard** — category Web Development — GitHub + Live links
2. **Solstice Studio** — category WordPress — Live link only
3. **Aperture Brand & Web Design** — category Web Design — Figma + Live links, no GitHub

## Files

New:
- `assets/js/projects-data.js` — data array
- `assets/js/projects-render.js` — builds grid cards + filter buttons from data on `projects.html`, replaces `projects.js`'s filter logic
- `project-details.html` — single template page, reads `?slug=`
- `assets/js/project-details.js` — looks up project by slug, renders case-study sections
- `assets/css/project-cards.css` — hover-overlay card styling
- `assets/css/project-details.css` — case-study page layout

Modified:
- `Main/pretty/projects.html` — grid becomes an empty mount point populated by JS; new CSS/JS includes; drop `projects.js` include
- `Main/pretty/assets/css/theme-dark.css` — dark-mode rules for new classes, following existing `html.dark-mode .selector` pattern
- `Main/pretty/assets/js/projects.js` — removed (superseded by `projects-render.js`)

## Grid & hover card

New classes (`.project-card`, `.project-card-overlay`, etc.) rather than reusing
the old `.project-item`/`.project-overlay`, since the old overlay only fades a
single title and isn't built for multi-element staggered content. Overlay:
`rgba(19,18,18,.85)` background (site's `#131212`), containing category label,
title, short description, tech-stack tags, and a "View Details" button styled
like `.home-btn-outline`. Hover/focus reveals it with a short per-element
stagger via CSS `transition-delay` — no JS animation.

Category filter buttons keep the existing markup/classes (`.project-filters
button`, `data-filter`, `.active`) so current `sections.css`/`theme-dark.css`
styling applies unchanged; they're generated from the data's unique categories
(in first-appearance order, "All" first) instead of hand-written.

## Case study page

`project-details.html` shares the header/sidebar/nav/footer chrome from
`projects.html`. Content, in order: banner with title/category, meta row of
tech tags + link buttons (GitHub/Live/App/Figma/Other — icon + label,
`.home-btn-outline` style, only the ones present), Overview, Problem/Objective,
Journey/Process, Features, Functionality, Screenshots gallery (reuses the
site's existing Magnific Popup lightbox), Important Pages/UI Previews,
Additional Info, then a "Back to Projects" link and the existing `.inline-cta`
block. Section headers reuse the existing `.about-section-title` (eyebrow +
h2) pattern. Missing/empty fields hide their section entirely.

## Responsive

Below 768px the hover overlay collapses to an always-visible bottom-gradient
strip (title + category only); the whole card becomes a tap target that
navigates straight to `project-details.html?slug=...`.

## Visual consistency

No new colors, fonts, radii, or shadows — reuses `#131212`/`#F7F7F7`/`#fff`,
Segoe UI, sharp corners, uppercase-letter-spaced labels, `.home-btn-dark`/
`.home-btn-outline` buttons, and the `.about-section-title` header pattern.
