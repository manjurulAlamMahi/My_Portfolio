# Dashboard Admin Improvements — Design

Date: 2026-08-22
Scope: `/dashboard` only (frontend-only admin, `Store`/`SEED` + `localStorage`
pattern). No live-site files (`/about.html`, `/contact.html`, etc.) are
touched — the dashboard remains decoupled from the published site, per its
existing README.

## A. Remove Media Library

- Delete `dashboard/pages/media.html`, `dashboard/assets/js/pages/media.js`,
  `dashboard/assets/css/modules/media.css`.
- `assets/js/shell.js`: remove the `media` entry from `NAV`.
- `assets/js/pages/dashboard-home.js`: remove the "Media Library" tile from
  the `jumps` array (Quick Jump card).
- `assets/js/seed-data.js`: remove the `media` collection.
- `dashboard/README.md`: drop "Media Library" from the Modules list.

## B. Visual fixes

### B1. Delete/remove button contrast
`assets/css/tokens.css` `.db-pill-btn.danger` currently has
`background: transparent`, making every remove-x control (toolbox, services,
testimonials, soft skills, tech tags, screenshots, project categories) hard
to see against card backgrounds in both themes. Change the resting state to
a soft red fill:

```css
.db-pill-btn.danger {
    background: rgba(229, 72, 77, 0.1);
    border-color: var(--db-danger);
    color: var(--db-danger);
}
.db-pill-btn.danger:hover { background: var(--db-danger); color: #fff; }
```

This is the same treatment `.db-logout-btn:hover` already uses. `.db-remove-x`
inherits it automatically since it only overrides sizing, not color.

### B2. Sidebar collapse arrow direction
`assets/js/shell.js` `bindBehavior()`: the collapse button's icon must
reflect state, not stay fixed on `fa-angle-double-left`.

- On init, after reading `COLLAPSE_KEY` from localStorage, set the icon to
  `fa-angle-double-right` if collapsed, `fa-angle-double-left` if expanded.
- In the click handler, after toggling `.collapsed`, update the icon the
  same way (`right` when now collapsed, `left` when now expanded).

Implementation: a small `updateCollapseIcon()` helper that sets
`collapseBtn.querySelector('i').className = 'fa fa-angle-double-' + (collapsed ? 'right' : 'left')`,
called once on init and once per toggle.

### B3. Identity toggle placement
`dashboard/pages/profile.html`: the "Available for freelance work" toggle
is currently a bare `.db-toggle` checkbox+label sitting under the Location
field, visually disconnected from the rest of the card. Wrap it in a new
`.db-toggle-row` component: a bordered row with the label text on the left
and the switch on the right, styled like a standard settings row.

```html
<div class="db-toggle-row">
    <span>Available for freelance work</span>
    <label class="db-toggle"><input type="checkbox" id="pAvailable"><span class="track"></span></label>
</div>
```

```css
.db-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    border: 1px solid var(--db-border); border-radius: 8px;
    padding: 12px 16px; margin-top: 4px;
}
.db-toggle-row span { font-size: 13px; color: var(--db-ink); }
```

Add `.db-toggle-row` to `components.css`. No JS/data changes — `pAvailable`
keeps its id and read/write logic in `profile.js`.

## C. Content model upgrades

### C1. Social Links → dynamic list
**Data model change**: `profile.social` moves from a fixed object
(`{ facebook, twitter, linkedin, instagram }`) to an array:

```js
social: [
    { icon: "fa-facebook", title: "Facebook", link: "#" },
    { icon: "fa-twitter", title: "Twitter", link: "#" },
    { icon: "fa-linkedin", title: "LinkedIn", link: "#" },
    { icon: "fa-instagram", title: "Instagram", link: "#" }
]
```

- `seed-data.js`: update `profile.social` to the array above.
- `pages/profile.html`: replace the 4 fixed inputs with a `db-list-item`
  container (`id="socialLinksList"`) + "Add Social Link" button, following
  the same list pattern as Services (icon class input, title input, link
  input, remove-x button per row).
- `assets/js/pages/profile.js`: add render/add/remove functions for the
  list (mirrors `renderServices` in `about.js`), and update the save handler
  to serialize the array instead of 4 named fields.

### C2. Toolbox — icon class → image upload
**Data model change**: toolbox items go from `{ icon, label }` to
`{ image, label }`, where `image` is a Store-relative path or data URL (same
convention as `profile.avatar` / project thumbnails).

- `seed-data.js`: add `assets/images/tool-placeholder.svg` (new neutral
  placeholder asset, see below) and set all seeded toolbox entries to
  `{ image: "assets/images/tool-placeholder.svg", label: "..." }`.
- `pages/about.html` / `about.js` (toolbox tab): each grid item mounts an
  `Uploader.mount(...)` (reusing the existing component) instead of an icon
  text input, plus the label input. Grid item thumbnail size increases from
  the current 20px icon to ~48px image (`.db-toolbox-item img { width: 48px;
  height: 48px; object-fit: contain; }` in `about.css`).
- New tool rows default to the same placeholder image until the admin
  uploads one.

### C3. Services — icon class → image upload
Same treatment as Toolbox:
- **Data model**: `{ icon, title, description }` → `{ image, title, description }`.
- `seed-data.js`: seeded services get `image: "assets/images/tool-placeholder.svg"`.
- `about.js` (services tab): each service list item mounts an `Uploader`
  instead of the icon text input.

### C4. Soft Skills — editable icon field
No data model change (`icon` already exists on `softSkills` items) — this
is a UI gap fix. `resume-skills.js` `renderSoftSkills()`: add an "Icon
(Font Awesome class)" text input to each card (same pattern as the label
input), bound to `data-field="icon"`, so newly-added soft skills aren't
stuck on the default `fa-star-o`.

### C5. Testimonials — review source
**Data model change**: testimonial items gain a `source` field:
`{ name, role, quote, stars, source }`.

- `seed-data.js`: add a plausible `source` value to each seeded testimonial
  (e.g. `"Google Reviews"`, `"Upwork"`, `"Direct Email"`).
- `about.js` `renderTestimonials()`: add a "Review Source" text input
  alongside Name/Role, and include it in the save handler.

### New asset: tool/service placeholder image
Add `dashboard/assets/images/tool-placeholder.svg` — a simple neutral square
icon (matching the flat style of `avatar-placeholder.svg`) used as the
default image for seeded Toolbox and Services entries now that both use
image upload instead of icon classes.

## D. Projects

### D1. Category management tab
`pages/projects.html`: add a `db-tabstrip` with two tabs, "Projects" (the
existing list/search/filter view) and "Categories" (new), using the
`?tab=` query param and `Shell.init({ active: 'projects-' + tab })` pattern
already used by About/Resume/Settings. `shell.js`'s `NAV` entry for
`projects` changes from a flat link to a `children` array (like
`about`/`resume`), with `projects-list` and `projects-categories` sub-items.

Categories tab UI: a simple list of `projectCategories` entries, each with
an inline-editable name input + remove-x button, plus an "Add Category" text
input + button at the top (same shape as the Toolbox/Services add flow).
Renaming edits the string in place; removing a category prompts
`Modal.confirm` (danger) and, on confirm, just removes it from
`projectCategories` — any projects still using that category keep their
existing (now unlisted) value as free text, matching how the project-form's
inline "+ Add new category" already tolerates categories not in the list.

`assets/js/pages/projects.js` splits into the existing list logic (unchanged
behavior) plus new category CRUD logic, both gated behind the active tab.

### D2. Publish/Unpublish toggle in the project list
`projects.js` `render()`: add a toggle switch (`.db-toggle`, compact) in the
Actions column between Edit and Delete. Clicking it flips the project's
`status` between `Published`/`Draft` immediately, calls `Store.save`, shows
a toast (`"Project published."` / `"Project unpublished."`), and re-renders
the status pill — no navigation to the full editor required.

## E. Contact page

**Data model change**: `contact` drops `skype` and `formEndpoint`, gains
`whatsapp` and `phone`:

```js
contact: {
    location: "Remote — available worldwide",
    email: "hello@yourdomain.com",
    whatsapp: "",
    phone: ""
}
```

- `pages/contact.html`: the 3-card row (Based In / Email / Skype) becomes a
  4-card row (Address / Email / WhatsApp / Phone Number) — reuse
  `db-grid-4`, one icon+field card each (`fa-map` / `fa-envelope-open` /
  `fa-whatsapp` / `fa-phone`).
- The "Form Settings" card (`formEndpoint`) is removed entirely.
- `assets/js/pages/contact.js`: updated field ids/bindings; save handler
  writes the new shape.

## F. Settings — Account tab + OTP relaxation

### F1. New "Account" tab (first tab)
`pages/settings.html`: `TABS` becomes `['account', 'mail', 'ai']`. New
`data-tab="account"` panel with two cards:

**Change Email card**
- Shows current email as read-only text.
- "New Email" input + "Send Code" button.
- On send: reveal a 6-box OTP row labeled "Enter the code sent to your
  current email" + Verify button (reuses the digit-box markup/behavior from
  `verify-otp.html`/`verify-otp.js`, inlined into `settings.js` as a small
  local helper since it's used twice on this page).
- On verify: reveal a second 6-box OTP row labeled "Enter the code sent to
  your new email" + Verify button.
- On second verify: update the displayed email, persist via
  `Store.save('account', ...)`, reset the mini-wizard back to step 1, toast
  "Email updated."

**Change Password card**
- Old Password / New Password / Confirm Password fields.
- Client-side checks: new matches confirm, new is ≥6 chars (matching the
  existing reset-password rule) — no OTP step (per your scope, only email
  change and the pre-login forgot-password flow use OTP).
- On save: persist via `Store.save('account', ...)`, clear the fields,
  toast "Password updated."

**Data model addition**: new `account` collection —
`{ email: "admin@maxdev.com", password: "MaxDev@2026" }` (seed values only;
never displayed in plaintext — the password field always starts empty).
This is a separate persisted record from the actual demo login credentials
(`Auth.ADMIN_EMAIL`/`ADMIN_PASSWORD`, unchanged) — consistent with how Mail/AI
settings are already stored but not functionally wired to a backend.

`shell.js` `NAV_BOTTOM`'s `settings` children list gains an "Account" entry
first: `{ id: 'settings-account', label: 'Account', href: 'pages/settings.html?tab=account' }`.

### F2. OTP verification becomes UI-only everywhere
`assets/js/auth.js` `verifyOtp(code)`: instead of comparing against the
stored generated code, accept any syntactically valid 6-digit code:

```js
verifyOtp: function (code) {
    var ok = /^\d{6}$/.test(String(code));
    if (ok) sessionStorage.setItem(OTP_VERIFIED_KEY, "1");
    return ok;
}
```

This covers the existing Forgot Password flow (`verify-otp.html`), which
already calls `Auth.verifyOtp`. The new Settings email-change steps (F1) are
a separate in-page flow that never calls `Auth.requestOtp`/`verifyOtp` in
the first place (there's no session-wide OTP to request — it's two
independent inline steps) — they apply the identical rule locally (`/^\d{6}$/`
on each 6-box entry) so both places behave the same way for the same reason,
without introducing a dependency between them. The dev-mode toast that
reveals the real generated code can stay as-is; it's just no longer required
reading to proceed.

## File-level summary

**Deleted:**
- `dashboard/pages/media.html`
- `dashboard/assets/js/pages/media.js`
- `dashboard/assets/css/modules/media.css`

**New:**
- `dashboard/assets/images/tool-placeholder.svg`

**Modified:**
- `dashboard/assets/js/seed-data.js` — social (array), toolbox/services
  (image), testimonials (source), contact (whatsapp/phone, drop
  skype/formEndpoint), new `account` collection, drop `media`.
- `dashboard/assets/js/auth.js` — `verifyOtp` relaxed.
- `dashboard/assets/js/shell.js` — remove media nav, collapse-icon
  direction, projects sub-nav (list/categories), settings sub-nav gains
  Account.
- `dashboard/assets/js/pages/dashboard-home.js` — remove Media Library
  Quick Jump tile.
- `dashboard/assets/js/pages/profile.js` — social links list, toggle-row
  markup untouched logic.
- `dashboard/assets/js/pages/about.js` — toolbox/services image upload,
  testimonial source field.
- `dashboard/assets/js/pages/resume-skills.js` — soft skill icon input.
- `dashboard/assets/js/pages/projects.js` — tabs (list/categories split),
  publish/unpublish toggle.
- `dashboard/assets/js/pages/contact.js` — new field shape.
- `dashboard/assets/js/pages/settings.js` — Account tab logic (email/password
  change flows).
- `dashboard/pages/profile.html` — social list markup, toggle-row markup.
- `dashboard/pages/about.html` — toolbox/services upload mounts.
- `dashboard/pages/resume-skills.html` — (no structural change; JS-only).
- `dashboard/pages/projects.html` — tabstrip + categories panel.
- `dashboard/pages/contact.html` — 4-card layout, drop Form Settings.
- `dashboard/pages/settings.html` — Account tab panel.
- `dashboard/assets/css/tokens.css` — `.db-pill-btn.danger` fill.
- `dashboard/assets/css/components.css` — `.db-toggle-row`.
- `dashboard/assets/css/modules/about.css` — larger toolbox image sizing.
- `dashboard/assets/css/modules/settings.css` — Account tab OTP-step styles.
- `dashboard/README.md` — module list update (drop Media Library, note
  Account settings).

## Out of scope
- No changes to the live site (`/about.html`, `/contact.html`, etc.) — the
  dashboard remains a frontend-only demo layered on `localStorage`.
- No real backend wiring for mail, AI assistant, or account
  email/password — all three remain stored-but-not-functionally-connected,
  consistent with the dashboard's existing design.
- No change to the actual demo login credentials
  (`Auth.ADMIN_EMAIL`/`ADMIN_PASSWORD`).
