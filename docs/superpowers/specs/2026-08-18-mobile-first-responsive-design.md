# Mobile-First Responsive Redesign

## Context

The site (`index.html`, `about.html`, `resume.html`, `projects.html`,
`project-details.html`, `contact.html`, `ai-chat.html`) is a static, no-build
Bootstrap 3 portfolio ("Pretty" template base). Desktop (≥992px) already has a
polished custom shell: a fixed profile sidebar, a floating glass nav pill, and
a dark-mode toggle. Below 992px, every page still falls back to the stock
Bootstrap hamburger/collapse menu — a scaled-down desktop layout, not an
app-like mobile experience.

Goal: give phones (`<768px`) a dedicated, native-app-feeling shell (bottom tab
bar, no cramped top header, touch-sized everything), give tablets
(`768–991px`) a lighter touch-up of the existing nav, and leave desktop
(≥992px) untouched.

## Breakpoint strategy

| Range | Treatment |
|---|---|
| `<768px` (phones) | New app shell: bottom tab bar, no top header bar, floating theme-toggle button, AI FAB removed. **Highest priority.** |
| `768–991px` (tablets) | Keep the existing hamburger top nav; touch-target and spacing refinements only. No bottom bar, no shell rebuild. |
| `≥992px` (desktop) | Unchanged — sidebar + floating glass nav already handle this. |

All shell changes are scoped to `max-width: 767px` media queries so the
tablet/desktop CSS paths are never touched by this work.

## Mobile app shell (`<768px`)

### Bottom tab bar

A new fixed `.mobile-tabbar`, rendered only below 768px, added to every page
except `ai-chat.html`:

- 5 tabs: **Home, About, Projects, Contact, AI Chat** — Font Awesome icon
  (already loaded site-wide) + short label, minimum 48px tap height.
- Active tab is set per-file with a hardcoded `class="active"`, the same
  convention the existing header nav and floating glass nav already use — no
  client-side routing, no JS needed for active-state.
- `body` gets bottom padding on mobile so page content and the footer never
  sit underneath the bar.
- Visual language matches the existing site (near-black `#131212` / white,
  Segoe UI, sharp corners) — no new colors introduced.
- Tapping **AI Chat** navigates to `ai-chat.html`, which is a full-screen
  experience with its own top bar and its own bottom input bar. The tab bar
  intentionally does not appear on that page — this mirrors how a messaging
  screen in a native app replaces the tab bar with its own input control.

### AI FAB

The existing `.ai-fab` (floating "AI Assistant" button, already present on
every non-chat page) is hidden `<768px` since AI Chat now has a dedicated tab.
It stays visible on tablet (`768–991px`), which has no tab bar.

### Floating theme toggle

A small circular button, visually consistent with the AI FAB (dark circle,
sun/moon Font Awesome icon), fixed top-right, `<768px` only. Reuses the
existing `theme.js` dark/light logic. Because `id="themeToggle"` is already
used by the desktop floating nav on the same page, the mobile button gets a
distinct id (`themeToggleMobile`); `theme.js` is extended to wire up every
element matching a shared class rather than a single hardcoded id.

### Top of the page

No fixed top header bar on mobile. Content (or each page's existing hero/page
title) starts immediately below the floating theme toggle, maximizing content
space — the same pattern most native apps use on content-heavy screens.

## Resume access on mobile

`about.html` gets a **"View Full Resume →"** card, `<768px` only, placed
right after the About hero (profile photo + bio) block. It links to
`resume.html`, which is otherwise unchanged. Desktop and tablet keep Resume as
a full nav/sidebar entry exactly as today — this card is additive and
mobile-scoped only. The existing `about-resume-cta` block further down the
page is untouched and still renders at all breakpoints.

`resume.html` itself is not a bottom-tab destination on mobile, but it still
receives the general mobile content-audit pass below.

## Mobile content audit (`<768px`, all 6 non-chat pages)

CSS-only work, applied consistently:

- **Touch targets:** every interactive element (project filter buttons, skill
  tabs, testimonial nav dots, social icons, footer links, form controls) gets
  a minimum 44×44px hit area.
- **Spacing scale:** replace desktop-derived paddings (e.g. `.header-bg`'s
  `80px 0`, 30px card gutters) with a tighter, consistent mobile rhythm
  (roughly 16/24/32px) instead of a shrunk desktop layout.
- **Typography:** re-tune heading sizes already partially addressed in
  `responsive.css` (e.g. `.welcome-image-area h2` at 40px) for real phone
  widths; body copy gets comfortable line-length and line-height in a single
  column.
- **Cards:** project cards (already tap-friendly), `whatido-card`,
  `testimonial-card`, `edu-card`, timeline items — reflow to full-bleed
  single-column with consistent internal padding, no leftover hover-only
  affordances.
- **Contact form:** inputs get a larger tap height, the two-column name/email
  row stacks to one column, and the submit button becomes full-width and
  thumb-reachable instead of `text-right`-aligned.
- **project-details.html:** case-study sections get the same spacing/
  typography sweep.

No HTML structural changes beyond what's explicitly called out above (tab
bar markup, floating toggle, Resume card).

## Tablet touch-up (`768–991px`)

Light touch only: keep the existing hamburger top nav and layout, but raise
tap targets on the collapsed menu links, filter chips, and buttons to the
same 44px minimum, and fill in the "Tablet Layout: 768px" block in
`responsive.css`, which currently exists but is empty. No new components.

## File plan

- **New:** `assets/css/mobile-shell.css` — bottom tab bar + floating theme
  toggle, scoped entirely to `<768px`. Kept separate from `sidebar.css` /
  `floating-nav.css` (their desktop equivalents) rather than folded into
  `responsive.css`.
- **Edited:**
  - `responsive.css` — expanded mobile + tablet audit rules.
  - `theme.js` — support multiple toggle buttons via a shared class.
  - `ai-fab.css` — hide the FAB `<768px`.
  - `theme-dark.css` — dark-mode rules for the new shell elements, following
    the existing additive-override pattern.
  - `about.html` — adds the mobile-only Resume card.
  - All 7 HTML pages — add bottom tab bar markup (6 of them) with the correct
    per-page `active` state; `ai-chat.html` is excluded from the tab bar but
    still gets any shared touch-target fixes relevant to it.

## Out of scope

- No changes to desktop (≥992px) sidebar, floating glass nav, or layout.
- No JavaScript routing/SPA behavior — every page remains a static HTML file
  with hardcoded nav state, consistent with the current codebase.
- No visual redesign of `ai-chat.html`'s own chat UI beyond touch-target
  sizing already present there.
