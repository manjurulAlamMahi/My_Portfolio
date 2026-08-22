# Dashboard Admin Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the 15 requested admin-dashboard fixes/upgrades from
`docs/superpowers/specs/2026-08-22-dashboard-admin-improvements-design.md`
— all scoped to `/dashboard`, none touching the live site.

**Architecture:** No changes to the dashboard's existing architecture. Every
page is a static HTML file + a page-controller script in
`assets/js/pages/*.js` that reads/writes content exclusively through
`Store.get(collection)` / `Store.save(collection, data)`
(`assets/js/store.js`), seeded from `assets/js/seed-data.js` on first load.
`Shell.init({ active })` (`assets/js/shell.js`) renders the sidebar/header on
every page. New UI follows the same patterns already in the codebase:
tabbed sub-pages (`?tab=` query param + `.db-tabstrip`/`.db-tab-panel`,
already used by About/Settings), dynamic add/remove lists
(`.db-list-item` + `.db-remove-x`, already used by Services/Testimonials),
and the drag-and-drop `Uploader` component for images.

**Tech Stack:** Vanilla ES5-style JavaScript (IIFEs, `var`, string
concatenation for templates — no build step, no framework), plain CSS
(custom properties in `tokens.css`), `localStorage` via `Store`.

## Global Constraints

- Every change stays inside `/dashboard`. Never edit the live-site files at
  the repo root (`about.html`, `contact.html`, etc.) — the dashboard is an
  independent, frontend-only demo layered on `localStorage`.
- All content reads/writes go through `Store.get('<collection>')` /
  `Store.save('<collection>', data)`. Never touch `localStorage` directly
  from a page controller.
- Any `<img src>` built from a Store-stored path (not a `data:` URL) must be
  prefixed with `DB_BASE` (from `assets/js/paths.js`), e.g.
  `DB_BASE + profile.avatar`, exactly like every existing page does.
- Match the codebase's existing style: 4-space indents, `var`, function
  expressions, string concatenation with `+` for HTML templates (no
  template literals, no `let`/`const`, no `.map()` arrow functions) — copy
  the style of the surrounding code in every file you touch.
- **No automated test suite exists in this project** (no `package.json`, no
  test runner — confirmed during research) and none is being introduced by
  this plan; a "build step" would contradict the project's stated
  frontend-only, no-build design. Every task's verification step is
  **manual**: serve the `dashboard/` folder (e.g. `npx http-server dashboard
  -p 8080` or any static server) or open the HTML file directly, then
  perform the exact actions listed and confirm the exact expected result
  (visually, and via a `localStorage.getItem(...)` check in the browser
  console where noted).
- Settings/account data (mail, AI assistant, and the new account
  email/password) remains **stored but not functionally wired to a real
  backend** — consistent with how Mail/AI settings already work. Do not
  connect the new Account tab to the actual demo login
  (`Auth.ADMIN_EMAIL`/`ADMIN_PASSWORD` in `auth.js` stay untouched).
- All OTP verification in the dashboard is intentionally non-functional: any
  well-formed 6-digit code is accepted, everywhere. This is deliberate per
  the spec, not a bug to "fix" later.

---

## Task 1: Initialize git and commit the current baseline

This project has no git repository yet. The rest of this plan commits after
every task, so we need a starting point first.

**Files:**
- Create: `.git/` (via `git init` at the repo root, `c:\Users\Max\Desktop\Dash`)

**Interfaces:**
- Consumes: nothing
- Produces: a git repository with an initial commit, so every later task's
  `git commit` has something to diff against.

- [ ] **Step 1: Initialize the repository**

Run (from `c:\Users\Max\Desktop\Dash`):
```bash
git init
```
Expected: `Initialized empty Git repository in c:/Users/Max/Desktop/Dash/.git/`

- [ ] **Step 2: Commit the existing project as-is**

```bash
git add -A
git commit -m "chore: baseline commit of existing Dash project"
```
Expected: a commit listing all current files (live site + dashboard +
docs) with no errors.

- [ ] **Step 3: Verify**

Run: `git log --oneline`
Expected: one commit, message `chore: baseline commit of existing Dash project`.

---

## Task 2: Remove Media Library

**Files:**
- Delete: `dashboard/pages/media.html`
- Delete: `dashboard/assets/js/pages/media.js`
- Delete: `dashboard/assets/css/modules/media.css`
- Modify: `dashboard/assets/js/shell.js`
- Modify: `dashboard/assets/js/pages/dashboard-home.js`
- Modify: `dashboard/assets/js/seed-data.js`
- Modify: `dashboard/README.md`

**Interfaces:**
- Consumes: nothing
- Produces: nothing later tasks depend on (this only removes things)

- [ ] **Step 1: Delete the three Media Library files**

```bash
rm "dashboard/pages/media.html" "dashboard/assets/js/pages/media.js" "dashboard/assets/css/modules/media.css"
```

- [ ] **Step 2: Remove the sidebar nav entry**

In `dashboard/assets/js/shell.js`, find this line inside the `NAV` array
(currently between the `projects` and `messages` entries):

```js
        { id: 'media', label: 'Media Library', icon: 'fa-picture-o', href: 'pages/media.html' },
```

Delete it entirely (the `projects` line above and `messages` line below
stay as-is).

- [ ] **Step 3: Remove the Quick Jump tile**

In `dashboard/assets/js/pages/dashboard-home.js`, find:

```js
    var jumps = [
        { label: 'Add Project', href: 'pages/projects.html', icon: 'fa-plus' },
        { label: 'Messages', href: 'pages/messages.html', icon: 'fa-envelope-o' },
        { label: 'Media Library', href: 'pages/media.html', icon: 'fa-picture-o' },
        { label: 'Settings', href: 'pages/settings.html', icon: 'fa-cog' }
    ];
```

Replace with:

```js
    var jumps = [
        { label: 'Add Project', href: 'pages/projects.html', icon: 'fa-plus' },
        { label: 'Messages', href: 'pages/messages.html', icon: 'fa-envelope-o' },
        { label: 'Settings', href: 'pages/settings.html', icon: 'fa-cog' }
    ];
```

- [ ] **Step 4: Remove the `media` seed collection**

In `dashboard/assets/js/seed-data.js`, find (it sits between `projects: [...]`
and `contact: {...}`):

```js
    media: [
        { id: "media-1", url: "assets/images/avatar-placeholder.svg", label: "Profile Avatar", tag: "avatar" },
        { id: "media-2", url: "assets/images/logo.svg", label: "Site Logo", tag: "logo" },
        { id: "media-3", url: "assets/images/work/1.svg", label: "Nimbus Analytics Thumbnail", tag: "work" },
        { id: "media-4", url: "assets/images/work/2.svg", label: "Solstice Studio Thumbnail", tag: "work" },
        { id: "media-5", url: "assets/images/work/3.svg", label: "Aperture Thumbnail", tag: "work" }
    ],
```

Delete this entire block (5 lines), leaving `projects: [...]`'s closing
`],` directly followed by `contact: {`.

- [ ] **Step 5: Update the README module list**

In `dashboard/README.md`, find:

```
- Projects — searchable list + full add/edit case-study editor
- Media Library — all site images in one grid, with replace/delete
- Contact — contact details and form endpoint
```

Replace with:

```
- Projects — searchable list + full add/edit case-study editor
- Contact — contact details and form endpoint
```

(The Projects/Contact/Settings lines get updated again in Task 16 once
those modules actually change — this step just removes the Media Library
line now so it doesn't linger.)

- [ ] **Step 6: Manual verification**

Serve `dashboard/` and open `login.html`, log in with `admin` / `1`. On
`index.html`:
- Sidebar has no "Media Library" item (Dashboard, Profile & Hero, About,
  Resume, Projects, Messages, Contact, then Settings at the bottom).
- The "Quick Jump" card shows 3 tiles (Add Project, Messages, Settings),
  not 4.
- Open the browser console — no errors (confirms nothing else still
  references `pages/media.html` or the `media` collection).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "remove Media Library module"
```

---

## Task 3: Fix transparent delete/remove button styling

**Files:**
- Modify: `dashboard/assets/css/tokens.css:109-115`

**Interfaces:**
- Consumes: nothing
- Produces: nothing later tasks depend on (pure visual fix, applies
  globally to every `.db-pill-btn.danger` / `.db-remove-x` already in the
  DOM and every one added by later tasks)

- [ ] **Step 1: Give `.db-pill-btn.danger` a visible resting background**

In `dashboard/assets/css/tokens.css`, find:

```css
.db-pill-btn.danger {
    background: transparent;
    border-color: var(--db-danger);
    color: var(--db-danger);
}

.db-pill-btn.danger:hover { background: var(--db-danger); color: #fff; }
```

Replace with:

```css
.db-pill-btn.danger {
    background: rgba(229, 72, 77, 0.1);
    border-color: var(--db-danger);
    color: var(--db-danger);
}

.db-pill-btn.danger:hover { background: var(--db-danger); color: #fff; }
```

- [ ] **Step 2: Manual verification**

Open `pages/about.html?tab=services`. The red trash-icon remove buttons on
each service card should now show a faint red fill at rest (not fully
transparent), turning solid red on hover. Toggle dark mode
(header moon icon) and confirm it still reads clearly in both themes.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "fix transparent delete button styling"
```

---

## Task 4: Sidebar collapse button — direction-aware arrow

**Files:**
- Modify: `dashboard/assets/js/shell.js:106-124`

**Interfaces:**
- Consumes: nothing
- Produces: nothing later tasks depend on

- [ ] **Step 1: Update `bindBehavior()` to flip the icon with state**

In `dashboard/assets/js/shell.js`, find:

```js
    function bindBehavior() {
        var sidebar = document.getElementById('dbSidebar');
        var mainWrap = document.querySelector('.db-main-wrap');
        var collapseBtn = document.getElementById('dbSidebarCollapseBtn');
        var drawerToggle = document.getElementById('dbDrawerToggle');
        var backdrop = document.getElementById('dbSidebarBackdrop');
        var COLLAPSE_KEY = 'maxdev-dashboard-sidebar-collapsed';

        if (localStorage.getItem(COLLAPSE_KEY) === '1') {
            sidebar.classList.add('collapsed');
            if (mainWrap) mainWrap.classList.add('sidebar-collapsed');
        }

        collapseBtn.addEventListener('click', function () {
            var collapsed = sidebar.classList.toggle('collapsed');
            if (mainWrap) mainWrap.classList.toggle('sidebar-collapsed', collapsed);
            localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
        });
```

Replace with:

```js
    function bindBehavior() {
        var sidebar = document.getElementById('dbSidebar');
        var mainWrap = document.querySelector('.db-main-wrap');
        var collapseBtn = document.getElementById('dbSidebarCollapseBtn');
        var drawerToggle = document.getElementById('dbDrawerToggle');
        var backdrop = document.getElementById('dbSidebarBackdrop');
        var COLLAPSE_KEY = 'maxdev-dashboard-sidebar-collapsed';

        function updateCollapseIcon(collapsed) {
            collapseBtn.querySelector('i').className = 'fa fa-angle-double-' + (collapsed ? 'right' : 'left');
        }

        var startCollapsed = localStorage.getItem(COLLAPSE_KEY) === '1';
        if (startCollapsed) {
            sidebar.classList.add('collapsed');
            if (mainWrap) mainWrap.classList.add('sidebar-collapsed');
        }
        updateCollapseIcon(startCollapsed);

        collapseBtn.addEventListener('click', function () {
            var collapsed = sidebar.classList.toggle('collapsed');
            if (mainWrap) mainWrap.classList.toggle('sidebar-collapsed', collapsed);
            localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
            updateCollapseIcon(collapsed);
        });
```

- [ ] **Step 2: Manual verification**

Open `index.html` at a desktop width (>=992px). Click the collapse button
at the bottom of the sidebar — the arrow icon flips from
double-left to double-right as the sidebar shrinks. Click again — flips
back to double-left as it expands. Reload the page while collapsed — the
icon should show double-right immediately on load (not double-left
flashing then correcting).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "sidebar collapse button arrow reflects collapsed state"
```

---

## Task 5: Reposition the "Available for freelance work" toggle

**Files:**
- Modify: `dashboard/pages/profile.html:39-41`
- Modify: `dashboard/assets/css/components.css`

**Interfaces:**
- Consumes: nothing
- Produces: `.db-toggle-row` CSS component, reusable by any future toggle
  (none of the other 15 items need it, but it's a general-purpose addition
  to the shared component sheet, not a one-off inline style)

- [ ] **Step 1: Wrap the toggle in a proper row**

In `dashboard/pages/profile.html`, find:

```html
                        <div class="db-form-group">
                            <label class="db-toggle"><input type="checkbox" id="pAvailable"><span class="track"></span> Available for freelance work</label>
                        </div>
```

Replace with:

```html
                        <div class="db-toggle-row">
                            <span>Available for freelance work</span>
                            <label class="db-toggle"><input type="checkbox" id="pAvailable"><span class="track"></span></label>
                        </div>
```

- [ ] **Step 2: Add the `.db-toggle-row` style**

In `dashboard/assets/css/components.css`, find the end of the `.db-toggle`
block:

```css
.db-toggle input:checked + .track { background: var(--db-accent); }
.db-toggle input:checked + .track::after { transform: translateX(18px); }
```

Add immediately after it:

```css

.db-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--db-border);
    border-radius: 8px;
    padding: 12px 16px;
    margin-top: 4px;
}
.db-toggle-row span { font-size: 13px; color: var(--db-ink); }
```

- [ ] **Step 3: Manual verification**

Open `pages/profile.html`. The Identity card now shows "Available for
freelance work" as a bordered row with the label on the left and the
switch on the right, visually matching the rest of the card's form
groups. Toggle it, click Save Changes, reload — the checked state
persists (confirms `pAvailable`'s id/behavior is unchanged).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "reposition identity availability toggle into its own row"
```

---

## Task 6: Social Links — dynamic add/remove list

**Files:**
- Modify: `dashboard/assets/js/seed-data.js`
- Modify: `dashboard/pages/profile.html:43-50`
- Modify: `dashboard/assets/js/pages/profile.js`

**Interfaces:**
- Consumes: `.db-list-item` / `.db-remove-x` CSS (already exists in
  `modules/about.css`, loaded via `layout.css`... no — confirm: it's in
  `modules/about.css`; `profile.html` does **not** currently load that
  file, so this task must add the link tag too, see Step 2)
- Produces: `profile.social` is now an array of
  `{ icon: string, title: string, link: string }` — any later task reading
  `profile.social` must treat it as an array, not the old
  `{facebook, twitter, linkedin, instagram}` object. (Nothing else in this
  plan reads `profile.social`.)

- [ ] **Step 1: Change the seed data shape**

In `dashboard/assets/js/seed-data.js`, find:

```js
        social: {
            facebook: "#",
            twitter: "#",
            linkedin: "#",
            instagram: "#"
        }
```

Replace with:

```js
        social: [
            { icon: "fa-facebook", title: "Facebook", link: "#" },
            { icon: "fa-twitter", title: "Twitter", link: "#" },
            { icon: "fa-linkedin", title: "LinkedIn", link: "#" },
            { icon: "fa-instagram", title: "Instagram", link: "#" }
        ]
```

- [ ] **Step 2: Replace the fixed fields with a list container, and load `about.css`**

In `dashboard/pages/profile.html`, find the stylesheet links in `<head>`:

```html
    <link rel="stylesheet" href="../assets/css/components.css">
    <link rel="stylesheet" href="../assets/css/modules/uploader.css">
```

Replace with:

```html
    <link rel="stylesheet" href="../assets/css/components.css">
    <link rel="stylesheet" href="../assets/css/modules/uploader.css">
    <link rel="stylesheet" href="../assets/css/modules/about.css">
```

Then find:

```html
                    <div class="db-card">
                        <h3 class="db-card-title">Social Links</h3>
                        <p class="db-card-subtitle">Used in the sidebar, about page and footer</p>
                        <div class="db-form-group"><label for="sFacebook"><i class="fa fa-facebook"></i> Facebook</label><input id="sFacebook" class="db-input"></div>
                        <div class="db-form-group"><label for="sTwitter"><i class="fa fa-twitter"></i> Twitter</label><input id="sTwitter" class="db-input"></div>
                        <div class="db-form-group"><label for="sLinkedin"><i class="fa fa-linkedin"></i> LinkedIn</label><input id="sLinkedin" class="db-input"></div>
                        <div class="db-form-group"><label for="sInstagram"><i class="fa fa-instagram"></i> Instagram</label><input id="sInstagram" class="db-input"></div>
                    </div>
```

Replace with:

```html
                    <div class="db-card">
                        <h3 class="db-card-title">Social Links</h3>
                        <p class="db-card-subtitle">Used in the sidebar, about page and footer</p>
                        <div id="socialLinksList"></div>
                        <button type="button" class="db-pill-btn outline" id="addSocialLink"><i class="fa fa-plus"></i> Add Social Link</button>
                    </div>
```

- [ ] **Step 3: Render/add/remove logic + save handler**

In `dashboard/assets/js/pages/profile.js`, find:

```js
    document.getElementById('pAvailable').checked = !!profile.available;
    document.getElementById('sFacebook').value = profile.social.facebook || '';
    document.getElementById('sTwitter').value = profile.social.twitter || '';
    document.getElementById('sLinkedin').value = profile.social.linkedin || '';
    document.getElementById('sInstagram').value = profile.social.instagram || '';
```

Replace with:

```js
    document.getElementById('pAvailable').checked = !!profile.available;

    var socialLinks = (profile.social || []).slice();
    var socialLinksList = document.getElementById('socialLinksList');
    function renderSocialLinks() {
        socialLinksList.innerHTML = socialLinks.map(function (s, i) {
            return '<div class="db-list-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove social link"><i class="fa fa-trash"></i></button>' +
                '<div class="db-form-row">' +
                    '<div class="db-form-group"><label>Icon (Font Awesome class)</label><input class="db-input" data-social="' + i + '" data-field="icon" value="' + s.icon + '"></div>' +
                    '<div class="db-form-group"><label>Title</label><input class="db-input" data-social="' + i + '" data-field="title" value="' + s.title + '"></div>' +
                '</div>' +
                '<div class="db-form-group"><label>Link</label><input class="db-input" data-social="' + i + '" data-field="link" value="' + s.link + '"></div>' +
            '</div>';
        }).join('');
        socialLinksList.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { socialLinks.splice(Number(btn.dataset.remove), 1); renderSocialLinks(); });
        });
    }
    renderSocialLinks();
    document.getElementById('addSocialLink').addEventListener('click', function () {
        socialLinks.push({ icon: 'fa-link', title: 'New Link', link: '' });
        renderSocialLinks();
    });
```

Then find the save handler:

```js
    document.getElementById('saveBtn').addEventListener('click', function () {
        Store.save('profile', {
            avatar: profile.avatar,
            name: document.getElementById('pName').value,
            designation: document.getElementById('pRole').value,
            location: document.getElementById('pLocation').value,
            available: document.getElementById('pAvailable').checked,
            social: {
                facebook: document.getElementById('sFacebook').value,
                twitter: document.getElementById('sTwitter').value,
                linkedin: document.getElementById('sLinkedin').value,
                instagram: document.getElementById('sInstagram').value
            }
        });
```

Replace with:

```js
    document.getElementById('saveBtn').addEventListener('click', function () {
        socialLinksList.querySelectorAll('input').forEach(function (input) {
            socialLinks[Number(input.dataset.social)][input.dataset.field] = input.value;
        });
        Store.save('profile', {
            avatar: profile.avatar,
            name: document.getElementById('pName').value,
            designation: document.getElementById('pRole').value,
            location: document.getElementById('pLocation').value,
            available: document.getElementById('pAvailable').checked,
            social: socialLinks
        });
```

(The rest of the handler — the `Store.save('hero', ...)` call and the
`Toast.show(...)` line — is unchanged.)

- [ ] **Step 4: Manual verification**

Open `pages/profile.html`. The Social Links card shows 4 rows seeded with
Facebook/Twitter/LinkedIn/Instagram, each with Icon/Title/Link fields.
Click "Add Social Link" — a 5th blank row appears. Click a row's remove
button — it disappears. Click "Save Changes", then in the browser
console run:
```js
JSON.parse(localStorage.getItem('maxdev-dashboard:profile')).social
```
Expected: an array reflecting your edits.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "social links: replace fixed fields with dynamic list"
```

---

## Task 7: Toolbox — icon class replaced by image upload

**Files:**
- Create: `dashboard/assets/images/tool-placeholder.svg`
- Modify: `dashboard/assets/js/seed-data.js`
- Modify: `dashboard/pages/about.html`
- Modify: `dashboard/assets/js/pages/about.js`
- Modify: `dashboard/assets/css/modules/about.css`

**Interfaces:**
- Consumes: nothing
- Produces: `toolbox` items are now `{ image: string, label: string }`
  (was `{ icon, label }`). `image` is either a dashboard-root-relative path
  (needs `DB_BASE` prefix to render) or a `data:` URL (render as-is) — same
  convention as `profile.avatar` / project thumbnails. Task 8 (Services)
  reuses this same `tool-placeholder.svg` asset.

- [ ] **Step 1: Add a neutral placeholder image**

Create `dashboard/assets/images/tool-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="24" fill="#161616"/>
  <path d="M130 55c-16-9-36-6-49 7-12 12-16 30-10 45l-52 52 18 18 52-52c15 6 33 2 45-10 13-13 16-33 7-49l-24 24-16-4-4-16 24-24z" fill="#5b6cff" opacity="0.85"/>
</svg>
```

- [ ] **Step 2: Point seeded toolbox entries at it**

In `dashboard/assets/js/seed-data.js`, find:

```js
    toolbox: [
        { icon: "ri-reactjs-line", label: "React" },
        { icon: "ri-nodejs-line", label: "Node.js" },
        { icon: "ri-javascript-line", label: "JavaScript" },
        { icon: "ri-html5-line", label: "HTML5" },
        { icon: "ri-css3-line", label: "CSS3" },
        { icon: "ri-git-branch-line", label: "Git" }
    ],
```

Replace with:

```js
    toolbox: [
        { image: "assets/images/tool-placeholder.svg", label: "React" },
        { image: "assets/images/tool-placeholder.svg", label: "Node.js" },
        { image: "assets/images/tool-placeholder.svg", label: "JavaScript" },
        { image: "assets/images/tool-placeholder.svg", label: "HTML5" },
        { image: "assets/images/tool-placeholder.svg", label: "CSS3" },
        { image: "assets/images/tool-placeholder.svg", label: "Git" }
    ],
```

- [ ] **Step 3: Drop the now-unused Remixicon CDN link**

In `dashboard/pages/about.html`, find:

```html
    <link rel="stylesheet" href="../assets/fonts/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.9.1/fonts/remixicon.css">
    <link rel="stylesheet" href="../assets/css/tokens.css">
```

Replace with:

```html
    <link rel="stylesheet" href="../assets/fonts/font-awesome.min.css">
    <link rel="stylesheet" href="../assets/css/tokens.css">
```

(Remixicon was only ever used for the `ri-*` toolbox icon classes; nothing
else on this page references it.)

- [ ] **Step 4: Replace the icon-class UI with an image picker**

In `dashboard/assets/js/pages/about.js`, find the entire Toolbox section:

```js
    // ---- Toolbox ----
    var toolbox = Store.get('toolbox');
    var toolboxGrid = document.getElementById('toolboxGrid');
    function renderToolbox() {
        toolboxGrid.innerHTML = toolbox.map(function (t, i) {
            return '<div class="db-toolbox-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove tool"><i class="fa fa-times"></i></button>' +
                '<i class="' + t.icon + '" style="font-size:20px;color:var(--db-accent);"></i>' +
                '<input class="db-input" style="margin-top:8px;text-align:center;" data-tool="' + i + '" data-field="label" value="' + t.label + '">' +
                '<input class="db-input" style="margin-top:6px;text-align:center;font-size:11px;" data-tool="' + i + '" data-field="icon" value="' + t.icon + '">' +
            '</div>';
        }).join('');
        toolboxGrid.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { toolbox.splice(Number(btn.dataset.remove), 1); renderToolbox(); });
        });
    }
    renderToolbox();
    document.getElementById('addTool').addEventListener('click', function () {
        toolbox.push({ icon: 'ri-code-line', label: 'New Tool' });
        renderToolbox();
    });
    document.getElementById('saveToolbox').addEventListener('click', function () {
        toolboxGrid.querySelectorAll('input').forEach(function (input) {
            var i = Number(input.dataset.tool);
            toolbox[i][input.dataset.field] = input.value;
        });
        Store.save('toolbox', toolbox);
        Toast.show('Toolbox saved.', 'success');
    });
```

Replace with:

```js
    // ---- Toolbox ----
    var toolbox = Store.get('toolbox');
    var toolboxGrid = document.getElementById('toolboxGrid');
    function toolboxImageSrc(t) {
        return t.image.indexOf('data:') === 0 ? t.image : DB_BASE + t.image;
    }
    function renderToolbox() {
        toolboxGrid.innerHTML = toolbox.map(function (t, i) {
            return '<div class="db-toolbox-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove tool"><i class="fa fa-times"></i></button>' +
                '<label class="db-toolbox-image">' +
                    '<img src="' + toolboxImageSrc(t) + '" alt="">' +
                    '<input type="file" accept="image/*" data-tool-image="' + i + '">' +
                '</label>' +
                '<input class="db-input" style="margin-top:8px;text-align:center;" data-tool="' + i + '" data-field="label" value="' + t.label + '">' +
            '</div>';
        }).join('');
        toolboxGrid.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { toolbox.splice(Number(btn.dataset.remove), 1); renderToolbox(); });
        });
        toolboxGrid.querySelectorAll('[data-tool-image]').forEach(function (input) {
            input.addEventListener('change', function () {
                var file = input.files[0];
                if (!file) return;
                var i = Number(input.dataset.toolImage);
                var reader = new FileReader();
                reader.onload = function () {
                    toolbox[i].image = reader.result;
                    input.previousElementSibling.src = reader.result;
                };
                reader.readAsDataURL(file);
            });
        });
    }
    renderToolbox();
    document.getElementById('addTool').addEventListener('click', function () {
        toolbox.push({ image: 'assets/images/tool-placeholder.svg', label: 'New Tool' });
        renderToolbox();
    });
    document.getElementById('saveToolbox').addEventListener('click', function () {
        toolboxGrid.querySelectorAll('[data-field="label"]').forEach(function (input) {
            toolbox[Number(input.dataset.tool)].label = input.value;
        });
        Store.save('toolbox', toolbox);
        Toast.show('Toolbox saved.', 'success');
    });
```

- [ ] **Step 5: Size the image thumbnail up (was a 20px icon, now a ~48px image)**

In `dashboard/assets/css/modules/about.css`, find:

```css
.db-toolbox-item { border: 1px solid var(--db-border); border-radius: var(--db-radius-card); padding: 16px 12px 14px; text-align: center; position: relative; overflow: visible; }
.db-toolbox-item .remove-btn { position: absolute; top: -9px; right: -9px; z-index: 2; }
```

Add immediately after it:

```css
.db-toolbox-item .db-toolbox-image { display: block; width: 48px; height: 48px; margin: 0 auto; border-radius: 8px; overflow: hidden; cursor: pointer; border: 1px solid var(--db-border); background: var(--db-surface-alt); }
.db-toolbox-item .db-toolbox-image img { width: 100%; height: 100%; object-fit: contain; }
.db-toolbox-item .db-toolbox-image input[type="file"] { display: none; }
```

- [ ] **Step 6: Manual verification**

Open `pages/about.html?tab=toolbox`. Each of the 6 seeded tools shows a
48px placeholder image (not a small icon) above its label input. Click a
tile's image — a file picker opens; choose any image file — the tile's
image updates immediately to your chosen file. Click "Add Tool" — a new
tile appears with the placeholder image. Click "Save Toolbox", then in
the console:
```js
JSON.parse(localStorage.getItem('maxdev-dashboard:toolbox'))
```
Expected: each item has an `image` field (data URL for the one you
replaced, `assets/images/tool-placeholder.svg` for the rest), no `icon`
field.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "toolbox: replace icon-class input with image upload"
```

---

## Task 8: Services — icon class replaced by image upload

**Files:**
- Modify: `dashboard/assets/js/seed-data.js`
- Modify: `dashboard/assets/js/pages/about.js`
- Modify: `dashboard/assets/css/modules/about.css`

**Interfaces:**
- Consumes: `tool-placeholder.svg` from Task 7
- Produces: `services` items are now
  `{ image: string, title: string, description: string }` (was
  `{ icon, title, description }`)

- [ ] **Step 1: Change the seed data shape**

In `dashboard/assets/js/seed-data.js`, find:

```js
    services: [
        { icon: "fa-code", title: "Frontend Development", description: "Responsive, accessible interfaces built with React and modern JavaScript." },
        { icon: "fa-server", title: "Backend Development", description: "APIs, databases and server-side logic designed to scale with real traffic." },
        { icon: "fa-cloud", title: "DevOps & Deployment", description: "CI/CD pipelines and cloud infrastructure that ship without the drama." }
    ],
```

Replace with:

```js
    services: [
        { image: "assets/images/tool-placeholder.svg", title: "Frontend Development", description: "Responsive, accessible interfaces built with React and modern JavaScript." },
        { image: "assets/images/tool-placeholder.svg", title: "Backend Development", description: "APIs, databases and server-side logic designed to scale with real traffic." },
        { image: "assets/images/tool-placeholder.svg", title: "DevOps & Deployment", description: "CI/CD pipelines and cloud infrastructure that ship without the drama." }
    ],
```

- [ ] **Step 2: Replace the icon-class input with an image picker**

In `dashboard/assets/js/pages/about.js`, find the entire Services section:

```js
    // ---- Services ----
    var services = Store.get('services');
    var servicesList = document.getElementById('servicesList');
    function renderServices() {
        servicesList.innerHTML = services.map(function (s, i) {
            return '<div class="db-list-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove service"><i class="fa fa-trash"></i></button>' +
                '<div class="db-form-row">' +
                    '<div class="db-form-group"><label>Icon (Font Awesome class)</label><input class="db-input" data-service="' + i + '" data-field="icon" value="' + s.icon + '"></div>' +
                    '<div class="db-form-group"><label>Title</label><input class="db-input" data-service="' + i + '" data-field="title" value="' + s.title + '"></div>' +
                '</div>' +
                '<div class="db-form-group"><label>Description</label><textarea class="db-textarea" data-service="' + i + '" data-field="description">' + s.description + '</textarea></div>' +
            '</div>';
        }).join('');
        servicesList.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { services.splice(Number(btn.dataset.remove), 1); renderServices(); });
        });
    }
    renderServices();
    document.getElementById('addService').addEventListener('click', function () {
        services.push({ icon: 'fa-star', title: 'New Service', description: '' });
        renderServices();
    });
    document.getElementById('saveServices').addEventListener('click', function () {
        servicesList.querySelectorAll('input, textarea').forEach(function (field) {
            var i = Number(field.dataset.service);
            services[i][field.dataset.field] = field.value;
        });
        Store.save('services', services);
        Toast.show('Services saved.', 'success');
    });
```

Replace with:

```js
    // ---- Services ----
    var services = Store.get('services');
    var servicesList = document.getElementById('servicesList');
    function serviceImageSrc(s) {
        return s.image.indexOf('data:') === 0 ? s.image : DB_BASE + s.image;
    }
    function renderServices() {
        servicesList.innerHTML = services.map(function (s, i) {
            return '<div class="db-list-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove service"><i class="fa fa-trash"></i></button>' +
                '<div style="display:flex;gap:16px;align-items:flex-start;">' +
                    '<div class="db-form-group" style="flex:0 0 auto;">' +
                        '<label>Icon Image</label>' +
                        '<label class="db-service-image">' +
                            '<img src="' + serviceImageSrc(s) + '" alt="">' +
                            '<input type="file" accept="image/*" data-service-image="' + i + '">' +
                        '</label>' +
                    '</div>' +
                    '<div class="db-form-group" style="flex:1;">' +
                        '<label>Title</label><input class="db-input" data-service="' + i + '" data-field="title" value="' + s.title + '">' +
                    '</div>' +
                '</div>' +
                '<div class="db-form-group"><label>Description</label><textarea class="db-textarea" data-service="' + i + '" data-field="description">' + s.description + '</textarea></div>' +
            '</div>';
        }).join('');
        servicesList.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { services.splice(Number(btn.dataset.remove), 1); renderServices(); });
        });
        servicesList.querySelectorAll('[data-service-image]').forEach(function (input) {
            input.addEventListener('change', function () {
                var file = input.files[0];
                if (!file) return;
                var i = Number(input.dataset.serviceImage);
                var reader = new FileReader();
                reader.onload = function () {
                    services[i].image = reader.result;
                    input.previousElementSibling.src = reader.result;
                };
                reader.readAsDataURL(file);
            });
        });
    }
    renderServices();
    document.getElementById('addService').addEventListener('click', function () {
        services.push({ image: 'assets/images/tool-placeholder.svg', title: 'New Service', description: '' });
        renderServices();
    });
    document.getElementById('saveServices').addEventListener('click', function () {
        servicesList.querySelectorAll('input[data-field], textarea[data-field]').forEach(function (field) {
            var i = Number(field.dataset.service);
            services[i][field.dataset.field] = field.value;
        });
        Store.save('services', services);
        Toast.show('Services saved.', 'success');
    });
```

- [ ] **Step 3: Add the image thumbnail style**

In `dashboard/assets/css/modules/about.css`, add (anywhere after the
`.db-toolbox-image` rules added in Task 7):

```css
.db-service-image { display: block; width: 56px; height: 56px; border-radius: 10px; overflow: hidden; cursor: pointer; border: 1px solid var(--db-border); background: var(--db-surface-alt); }
.db-service-image img { width: 100%; height: 100%; object-fit: contain; }
.db-service-image input[type="file"] { display: none; }
```

- [ ] **Step 4: Manual verification**

Open `pages/about.html?tab=services`. Each of the 3 seeded services shows a
56px placeholder image to the left of its Title field (no more
icon-class text input). Click the image, pick a file — it updates
immediately. Click "Add Service" — new card appears with the placeholder
image and empty Title/Description. Click "Save Services", then in the
console:
```js
JSON.parse(localStorage.getItem('maxdev-dashboard:services'))
```
Expected: each item has `image`, `title`, `description` — no `icon` field.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "services: replace icon-class input with image upload"
```

---

## Task 9: Soft Skills — editable icon-class field

**Files:**
- Modify: `dashboard/assets/js/pages/resume-skills.js`

**Interfaces:**
- Consumes: nothing (no data shape change — `icon` already existed on
  `softSkills` items, this only exposes it as an editable input)
- Produces: nothing later tasks depend on

- [ ] **Step 1: Add the icon-class input to each soft skill card**

In `dashboard/assets/js/pages/resume-skills.js`, find:

```js
    function renderSoftSkills() {
        softGrid.innerHTML = softSkills.map(function (s, i) {
            return '<div class="db-softskill-card">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove soft skill"><i class="fa fa-times"></i></button>' +
                '<i class="fa ' + s.icon + ' icon"></i>' +
                '<input class="db-input" style="margin-bottom:6px;" data-soft="' + i + '" data-field="name" value="' + s.name + '">' +
                '<textarea class="db-textarea" style="min-height:60px;" data-soft="' + i + '" data-field="note">' + s.note + '</textarea>' +
            '</div>';
        }).join('');
```

Replace with:

```js
    function renderSoftSkills() {
        softGrid.innerHTML = softSkills.map(function (s, i) {
            return '<div class="db-softskill-card">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove soft skill"><i class="fa fa-times"></i></button>' +
                '<i class="fa ' + s.icon + ' icon"></i>' +
                '<input class="db-input" style="margin-bottom:6px;font-size:11px;text-align:center;" data-soft="' + i + '" data-field="icon" value="' + s.icon + '" placeholder="fa-star-o">' +
                '<input class="db-input" style="margin-bottom:6px;" data-soft="' + i + '" data-field="name" value="' + s.name + '">' +
                '<textarea class="db-textarea" style="min-height:60px;" data-soft="' + i + '" data-field="note">' + s.note + '</textarea>' +
            '</div>';
        }).join('');
```

The existing `saveSoftSkills` handler already loops over every
`input, textarea` with a `data-field`/`data-soft` pair generically, so no
change is needed there — the new icon input is picked up automatically.

- [ ] **Step 2: Manual verification**

Open `pages/resume-skills.html`. Each soft skill card now shows a small
text input (pre-filled with the current icon class, e.g. `fa-comments-o`)
above the Name field. Click "Add Soft Skill" — the new card's icon input
shows the placeholder text `fa-star-o` and its preview icon is a star.
Change one card's icon input to `fa-heart-o`, click "Save Soft Skills",
reload the page — the star/heart preview above the input should reflect
the saved icon class (confirms it round-trips through `Store`).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "soft skills: expose icon class as an editable field"
```

---

## Task 10: Testimonials — add a Review Source field

**Files:**
- Modify: `dashboard/assets/js/seed-data.js`
- Modify: `dashboard/assets/js/pages/about.js`

**Interfaces:**
- Consumes: nothing
- Produces: `testimonials` items gain a `source` field:
  `{ name, role, quote, stars, source }`

- [ ] **Step 1: Add source values to the seed data**

In `dashboard/assets/js/seed-data.js`, find:

```js
    testimonials: [
        { name: "Sarah K.", role: "Small Business Owner", stars: 5, quote: "Communication was clear from day one and the final build matched the brief almost exactly — no scope surprises, no chasing updates." },
        { name: "James T.", role: "Startup Founder", stars: 5, quote: "Took a messy MVP and turned it into something we could actually launch on schedule. Would bring them onto the next project without a second thought." },
        { name: "Priya M.", role: "Marketing Lead", stars: 5, quote: "Genuinely good at translating vague product ideas into a working plan, then just quietly executing on it. Exactly what a small team needs." }
    ],
```

Replace with:

```js
    testimonials: [
        { name: "Sarah K.", role: "Small Business Owner", stars: 5, source: "Google Reviews", quote: "Communication was clear from day one and the final build matched the brief almost exactly — no scope surprises, no chasing updates." },
        { name: "James T.", role: "Startup Founder", stars: 5, source: "Upwork", quote: "Took a messy MVP and turned it into something we could actually launch on schedule. Would bring them onto the next project without a second thought." },
        { name: "Priya M.", role: "Marketing Lead", stars: 5, source: "Direct Email", quote: "Genuinely good at translating vague product ideas into a working plan, then just quietly executing on it. Exactly what a small team needs." }
    ],
```

- [ ] **Step 2: Add the field to the editor**

In `dashboard/assets/js/pages/about.js`, find:

```js
    function renderTestimonials() {
        testimonialsList.innerHTML = testimonials.map(function (t, i) {
            return '<div class="db-list-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove testimonial"><i class="fa fa-trash"></i></button>' +
                '<div class="db-form-row">' +
                    '<div class="db-form-group"><label>Name</label><input class="db-input" data-testimonial="' + i + '" data-field="name" value="' + t.name + '"></div>' +
                    '<div class="db-form-group"><label>Role</label><input class="db-input" data-testimonial="' + i + '" data-field="role" value="' + t.role + '"></div>' +
                '</div>' +
                '<div class="db-form-group"><label>Quote</label><textarea class="db-textarea" data-testimonial="' + i + '" data-field="quote">' + t.quote + '</textarea></div>' +
                '<div class="db-form-group"><label>Rating</label><div class="db-stars-input">' + starsHtml(i, t.stars) + '</div></div>' +
            '</div>';
        }).join('');
```

Replace with:

```js
    function renderTestimonials() {
        testimonialsList.innerHTML = testimonials.map(function (t, i) {
            return '<div class="db-list-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove testimonial"><i class="fa fa-trash"></i></button>' +
                '<div class="db-form-row">' +
                    '<div class="db-form-group"><label>Name</label><input class="db-input" data-testimonial="' + i + '" data-field="name" value="' + t.name + '"></div>' +
                    '<div class="db-form-group"><label>Role</label><input class="db-input" data-testimonial="' + i + '" data-field="role" value="' + t.role + '"></div>' +
                    '<div class="db-form-group"><label>Review Source</label><input class="db-input" data-testimonial="' + i + '" data-field="source" value="' + (t.source || '') + '" placeholder="e.g. Google Reviews, Upwork"></div>' +
                '</div>' +
                '<div class="db-form-group"><label>Quote</label><textarea class="db-textarea" data-testimonial="' + i + '" data-field="quote">' + t.quote + '</textarea></div>' +
                '<div class="db-form-group"><label>Rating</label><div class="db-stars-input">' + starsHtml(i, t.stars) + '</div></div>' +
            '</div>';
        }).join('');
```

Then find:

```js
    document.getElementById('addTestimonial').addEventListener('click', function () {
        testimonials.push({ name: 'New Client', role: '', quote: '', stars: 5 });
        renderTestimonials();
    });
```

Replace with:

```js
    document.getElementById('addTestimonial').addEventListener('click', function () {
        testimonials.push({ name: 'New Client', role: '', quote: '', stars: 5, source: '' });
        renderTestimonials();
    });
```

(The existing `saveTestimonials` handler already loops over every
`input, textarea` with a `data-field` generically, so it picks up the new
Source field with no change needed.)

- [ ] **Step 3: Manual verification**

Open `pages/about.html?tab=testimonials`. Each of the 3 seeded
testimonials now shows a "Review Source" field alongside Name/Role,
pre-filled (Google Reviews / Upwork / Direct Email). Add a new
testimonial — its Review Source field starts empty. Edit one, save, and
in the console:
```js
JSON.parse(localStorage.getItem('maxdev-dashboard:testimonials'))
```
Expected: every item has a `source` string field.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "testimonials: add review source field"
```

---

## Task 11: Contact page — Address/Email/WhatsApp/Phone, drop Form Settings

**Files:**
- Modify: `dashboard/assets/js/seed-data.js`
- Modify: `dashboard/pages/contact.html`
- Modify: `dashboard/assets/js/pages/contact.js`

**Interfaces:**
- Consumes: nothing
- Produces: `contact` is now
  `{ location, email, whatsapp, phone }` (drops `skype` and
  `formEndpoint`)

- [ ] **Step 1: Change the seed data shape**

In `dashboard/assets/js/seed-data.js`, find:

```js
    contact: {
        location: "Remote — available worldwide",
        email: "hello@yourdomain.com",
        skype: "your.skype.id",
        formEndpoint: "https://formspree.io/f/your-form-id"
    },
```

Replace with:

```js
    contact: {
        location: "Remote — available worldwide",
        email: "hello@yourdomain.com",
        whatsapp: "",
        phone: ""
    },
```

- [ ] **Step 2: Rebuild the page layout**

In `dashboard/pages/contact.html`, find:

```html
                <div class="db-grid db-grid-3">
                    <div class="db-card">
                        <i class="fa fa-map" style="font-size:18px;color:var(--db-accent);margin-bottom:10px;display:block;"></i>
                        <div class="db-form-group"><label for="cLocation">Based In</label><input id="cLocation" class="db-input"></div>
                    </div>
                    <div class="db-card">
                        <i class="fa fa-envelope-open" style="font-size:18px;color:var(--db-accent);margin-bottom:10px;display:block;"></i>
                        <div class="db-form-group"><label for="cEmail">Email</label><input id="cEmail" class="db-input" type="email"></div>
                    </div>
                    <div class="db-card">
                        <i class="fa fa-skype" style="font-size:18px;color:var(--db-accent);margin-bottom:10px;display:block;"></i>
                        <div class="db-form-group"><label for="cSkype">Skype</label><input id="cSkype" class="db-input"></div>
                    </div>
                </div>
                <div class="db-card" style="margin-top:20px;">
                    <h3 class="db-card-title">Form Settings</h3>
                    <p class="db-card-subtitle">Where the live site's contact form submits to</p>
                    <div class="db-form-group"><label for="cFormEndpoint">Form Endpoint URL</label><input id="cFormEndpoint" class="db-input" placeholder="https://formspree.io/f/your-form-id"></div>
                </div>
```

Replace with:

```html
                <div class="db-grid db-grid-4">
                    <div class="db-card">
                        <i class="fa fa-map" style="font-size:18px;color:var(--db-accent);margin-bottom:10px;display:block;"></i>
                        <div class="db-form-group"><label for="cLocation">Address</label><input id="cLocation" class="db-input"></div>
                    </div>
                    <div class="db-card">
                        <i class="fa fa-envelope-open" style="font-size:18px;color:var(--db-accent);margin-bottom:10px;display:block;"></i>
                        <div class="db-form-group"><label for="cEmail">Email</label><input id="cEmail" class="db-input" type="email"></div>
                    </div>
                    <div class="db-card">
                        <i class="fa fa-whatsapp" style="font-size:18px;color:var(--db-accent);margin-bottom:10px;display:block;"></i>
                        <div class="db-form-group"><label for="cWhatsapp">WhatsApp</label><input id="cWhatsapp" class="db-input"></div>
                    </div>
                    <div class="db-card">
                        <i class="fa fa-phone" style="font-size:18px;color:var(--db-accent);margin-bottom:10px;display:block;"></i>
                        <div class="db-form-group"><label for="cPhone">Phone Number</label><input id="cPhone" class="db-input" type="tel"></div>
                    </div>
                </div>
```

- [ ] **Step 3: Update the page controller**

Replace the entire contents of `dashboard/assets/js/pages/contact.js` with:

```js
(function () {
    Shell.init({ active: 'contact' });

    var contact = Store.get('contact');
    document.getElementById('cLocation').value = contact.location;
    document.getElementById('cEmail').value = contact.email;
    document.getElementById('cWhatsapp').value = contact.whatsapp || '';
    document.getElementById('cPhone').value = contact.phone || '';

    document.getElementById('saveContact').addEventListener('click', function () {
        Store.save('contact', {
            location: document.getElementById('cLocation').value,
            email: document.getElementById('cEmail').value,
            whatsapp: document.getElementById('cWhatsapp').value,
            phone: document.getElementById('cPhone').value
        });
        Toast.show('Contact settings saved.', 'success');
    });
})();
```

- [ ] **Step 4: Manual verification**

Open `pages/contact.html`. Four cards now show: Address, Email, WhatsApp,
Phone Number (no Skype, no Form Settings card). Fill in WhatsApp/Phone,
click Save Changes, reload, and in the console:
```js
JSON.parse(localStorage.getItem('maxdev-dashboard:contact'))
```
Expected: `{ location, email, whatsapp, phone }` — no `skype` or
`formEndpoint` keys.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "contact page: address/email/whatsapp/phone, drop form settings"
```

---

## Task 12: Projects — category management tab

**Files:**
- Modify: `dashboard/assets/js/shell.js`
- Modify: `dashboard/pages/projects.html`
- Modify: `dashboard/assets/js/pages/projects.js`
- Modify: `dashboard/assets/js/pages/project-form.js`
- Modify: `dashboard/assets/css/modules/dashboard.css`
- Modify: `dashboard/assets/css/components.css`

**Interfaces:**
- Consumes: `.db-tabstrip`/`.db-tab-panel` CSS (`modules/about.css`),
  `Modal.confirm` (`modal.js`)
- Produces: `shell.js`'s `projects` NAV entry becomes a parent with
  children `projects-list` / `projects-categories` — any page passing
  `Shell.init({ active: 'projects' })` will no longer highlight anything
  (fixed for `project-form.js` in Step 5 of this task; there are no other
  callers). Task 13 modifies the `render()` function this task introduces
  in `projects.js`, so Task 13 must run after this one.

- [ ] **Step 1: Give Projects a sub-nav in the sidebar**

In `dashboard/assets/js/shell.js`, find:

```js
        { id: 'projects', label: 'Projects', icon: 'fa-folder-open-o', href: 'pages/projects.html' },
```

Replace with:

```js
        { id: 'projects', label: 'Projects', icon: 'fa-folder-open-o', children: [
            { id: 'projects-list', label: 'All Projects', href: 'pages/projects.html?tab=list' },
            { id: 'projects-categories', label: 'Categories', href: 'pages/projects.html?tab=categories' }
        ]},
```

- [ ] **Step 2: Add the tabstrip and split the page into two panels**

In `dashboard/pages/projects.html`, find the stylesheet links:

```html
    <link rel="stylesheet" href="../assets/css/components.css">
    <link rel="stylesheet" href="../assets/css/modules/projects.css">
```

Replace with:

```html
    <link rel="stylesheet" href="../assets/css/components.css">
    <link rel="stylesheet" href="../assets/css/modules/about.css">
    <link rel="stylesheet" href="../assets/css/modules/projects.css">
```

(`modules/about.css` is where `.db-tabstrip`/`.db-tab-panel`/`.db-list-item`
live — `settings.html` already loads it for the same reason.)

Then find:

```html
                <div class="db-page-header">
                    <div><h1>Projects</h1><p>Case studies shown on the live Projects page</p></div>
                    <a href="project-form.html" class="db-pill-btn accent"><i class="fa fa-plus"></i> Add Project</a>
                </div>
                <div class="db-table-wrap">
                    <div class="db-table-toolbar">
                        <div class="db-search-input"><i class="fa fa-search"></i><input type="text" id="searchInput" placeholder="Search projects..."></div>
                        <div id="categoryFilters" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
                    </div>
                    <div class="db-row-card-header">
                        <span></span>
                        <span>Project</span>
                        <span>Category</span>
                        <span>Tech Stack</span>
                        <span>Status</span>
                        <span class="col-actions">Actions</span>
                    </div>
                    <div id="projectsRows"></div>
                    <div class="db-empty-state" id="emptyState" style="display:none;">No projects match your search.</div>
                </div>
```

Replace with:

```html
                <div class="db-page-header">
                    <div><h1>Projects</h1><p>Case studies shown on the live Projects page</p></div>
                    <a href="project-form.html" class="db-pill-btn accent"><i class="fa fa-plus"></i> Add Project</a>
                </div>
                <div class="db-tabstrip" id="tabStrip"></div>

                <section class="db-tab-panel" data-tab="list">
                    <div class="db-table-wrap">
                        <div class="db-table-toolbar">
                            <div class="db-search-input"><i class="fa fa-search"></i><input type="text" id="searchInput" placeholder="Search projects..."></div>
                            <div id="categoryFilters" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
                        </div>
                        <div class="db-row-card-header">
                            <span></span>
                            <span>Project</span>
                            <span>Category</span>
                            <span>Tech Stack</span>
                            <span>Status</span>
                            <span class="col-actions">Actions</span>
                        </div>
                        <div id="projectsRows"></div>
                        <div class="db-empty-state" id="emptyState" style="display:none;">No projects match your search.</div>
                    </div>
                </section>

                <section class="db-tab-panel" data-tab="categories">
                    <div class="db-card">
                        <h3 class="db-card-title">Project Categories</h3>
                        <p class="db-card-subtitle">Manage the categories available when adding or editing a project</p>
                        <div class="db-inline-form">
                            <input id="newCategoryInput" class="db-input" placeholder="New category name">
                            <button type="button" class="db-pill-btn accent" id="addCategoryBtn">Add</button>
                        </div>
                        <div id="categoriesList" style="margin-top:18px;"></div>
                        <button type="button" class="db-pill-btn accent" id="saveCategories" style="margin-top:10px;">Save Categories</button>
                    </div>
                </section>
```

- [ ] **Step 3: Move `.db-inline-form` into the shared component sheet**

`.db-inline-form` currently lives in `modules/dashboard.css`, which
`projects.html` doesn't load (and shouldn't — that file is
dashboard-home-specific). Move the rule to `components.css`, which every
page already loads.

In `dashboard/assets/css/modules/dashboard.css`, find:

```css
.db-inline-form { display: flex; gap: 8px; margin-bottom: 16px; }
.db-inline-form input { flex: 1; }
.db-inline-form.db-reminder-form { flex-wrap: wrap; }
.db-inline-form.db-reminder-form input[type="date"] { flex: 0 0 140px; }
```

Delete these 4 lines from `dashboard.css`.

In `dashboard/assets/css/components.css`, add them at the end of the file:

```css

.db-inline-form { display: flex; gap: 8px; margin-bottom: 16px; }
.db-inline-form input { flex: 1; }
.db-inline-form.db-reminder-form { flex-wrap: wrap; }
.db-inline-form.db-reminder-form input[type="date"] { flex: 0 0 140px; }
```

- [ ] **Step 4: Rewrite `projects.js` with tabs and category management**

Replace the entire contents of `dashboard/assets/js/pages/projects.js`
with:

```js
(function () {
    var TABS = ['list', 'categories'];
    var params = new URLSearchParams(window.location.search);
    var activeTab = TABS.indexOf(params.get('tab')) !== -1 ? params.get('tab') : 'list';

    Shell.init({ active: 'projects-' + activeTab });

    document.getElementById('tabStrip').innerHTML = TABS.map(function (t) {
        var labels = { list: 'Projects', categories: 'Categories' };
        return '<a href="projects.html?tab=' + t + '" class="' + (t === activeTab ? 'active' : '') + '">' + labels[t] + '</a>';
    }).join('');

    document.querySelectorAll('.db-tab-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.tab === activeTab);
    });

    // ---- Project list ----
    var projects = Store.get('projects');
    var rowsEl = document.getElementById('projectsRows');
    var emptyEl = document.getElementById('emptyState');
    var searchInput = document.getElementById('searchInput');
    var categoryFiltersEl = document.getElementById('categoryFilters');
    var activeCategory = 'All';

    var knownCategories = Store.get('projectCategories') || [];
    var usedCategories = projects.map(function (p) { return p.category; }).filter(Boolean);
    var filterCategories = ['All'].concat(knownCategories.concat(usedCategories).filter(function (c, i, arr) { return arr.indexOf(c) === i; }));
    categoryFiltersEl.innerHTML = filterCategories.map(function (c) {
        return '<button type="button" class="db-filter-chip' + (c === activeCategory ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
    }).join('');
    categoryFiltersEl.querySelectorAll('[data-cat]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            activeCategory = btn.dataset.cat;
            categoryFiltersEl.querySelectorAll('[data-cat]').forEach(function (b) { b.classList.toggle('active', b === btn); });
            render();
        });
    });

    function render() {
        var query = searchInput.value.trim().toLowerCase();
        var filtered = projects.filter(function (p) {
            var matchesQuery = !query || p.title.toLowerCase().indexOf(query) !== -1 || p.shortDescription.toLowerCase().indexOf(query) !== -1;
            var matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            return matchesQuery && matchesCategory;
        });

        emptyEl.style.display = filtered.length ? 'none' : 'block';
        rowsEl.innerHTML = filtered.map(function (p) {
            var techBadges = p.techStack.slice(0, 3).map(function (t) { return '<span class="db-badge">' + t + '</span>'; }).join('');
            return '<div class="db-row-card">' +
                '<div class="thumb"><img src="' + DB_BASE + p.thumbnail + '" alt=""></div>' +
                '<div><p class="title">' + p.title + '</p><p class="desc">' + p.shortDescription + '</p></div>' +
                '<div><span class="db-badge accent">' + p.category + '</span></div>' +
                '<div class="db-tech-badges">' + techBadges + '</div>' +
                '<div><span class="db-status-pill ' + p.status.toLowerCase() + '">' + p.status + '</span></div>' +
                '<div class="actions">' +
                    '<a class="db-icon-btn" href="project-form.html?slug=' + encodeURIComponent(p.slug) + '" aria-label="Edit"><i class="fa fa-pencil"></i></a>' +
                    '<button type="button" class="db-icon-btn" data-delete="' + p.slug + '" aria-label="Delete"><i class="fa fa-trash"></i></button>' +
                '</div>' +
            '</div>';
        }).join('');

        rowsEl.querySelectorAll('[data-delete]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var slug = btn.dataset.delete;
                var project = projects.find(function (p) { return p.slug === slug; });
                Modal.confirm({ title: 'Delete "' + project.title + '"?', message: 'This cannot be undone.', danger: true, confirmLabel: 'Delete' })
                    .then(function (ok) {
                        if (!ok) return;
                        projects = projects.filter(function (p) { return p.slug !== slug; });
                        Store.save('projects', projects);
                        Toast.show('Project deleted.', 'success');
                        render();
                    });
            });
        });
    }

    searchInput.addEventListener('input', render);
    render();

    var flash = sessionStorage.getItem('db-flash');
    if (flash) {
        Toast.show(flash, 'success');
        sessionStorage.removeItem('db-flash');
    }

    // ---- Categories management ----
    var manageCategories = Store.get('projectCategories') || [];
    var categoriesList = document.getElementById('categoriesList');
    function renderCategories() {
        if (!manageCategories.length) {
            categoriesList.innerHTML = '<p class="db-form-hint">No categories yet. Add one above.</p>';
            return;
        }
        categoriesList.innerHTML = manageCategories.map(function (c, i) {
            return '<div class="db-form-row" style="margin-bottom:12px;align-items:center;">' +
                '<input class="db-input" data-category="' + i + '" value="' + c + '">' +
                '<button type="button" class="db-pill-btn danger db-remove-x" data-remove-category="' + i + '" aria-label="Remove category" style="flex:0 0 auto;"><i class="fa fa-trash"></i></button>' +
            '</div>';
        }).join('');
        categoriesList.querySelectorAll('[data-remove-category]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var i = Number(btn.dataset.removeCategory);
                Modal.confirm({ title: 'Delete "' + manageCategories[i] + '"?', message: 'Projects already using this category will keep it as free text until reassigned.', danger: true, confirmLabel: 'Delete' })
                    .then(function (ok) {
                        if (!ok) return;
                        manageCategories.splice(i, 1);
                        Store.save('projectCategories', manageCategories);
                        renderCategories();
                        Toast.show('Category deleted.', 'success');
                    });
            });
        });
    }
    renderCategories();

    document.getElementById('addCategoryBtn').addEventListener('click', function () {
        var name = document.getElementById('newCategoryInput').value.trim();
        if (!name) { Toast.show('Enter a category name.', 'error'); return; }
        manageCategories.push(name);
        document.getElementById('newCategoryInput').value = '';
        renderCategories();
    });

    document.getElementById('saveCategories').addEventListener('click', function () {
        categoriesList.querySelectorAll('[data-category]').forEach(function (input) {
            manageCategories[Number(input.dataset.category)] = input.value;
        });
        Store.save('projectCategories', manageCategories);
        Toast.show('Categories saved.', 'success');
    });
})();
```

- [ ] **Step 5: Fix `project-form.js`'s now-stale active id**

In `dashboard/assets/js/pages/project-form.js`, find:

```js
    Shell.init({ active: 'projects' });
```

Replace with:

```js
    Shell.init({ active: 'projects-list' });
```

(Without this, editing/adding a project would leave the Projects nav item
unhighlighted, since `'projects'` no longer matches any nav id or child
id after Step 1.)

- [ ] **Step 6: Manual verification**

Open `index.html`, click "Projects" in the sidebar — it expands to show
"All Projects" and "Categories". Click "All Projects" — the existing
searchable project list still works exactly as before (search, category
filter chips, edit link, delete with confirm). Click "Categories" — shows
the 3 seeded categories (Web Development, WordPress, Web Design) each in
an editable text input with a delete button. Type a new category name,
click Add — it appears in the list (not yet saved). Rename one of the
existing rows, click "Save Categories" — toast confirms; in the console:
```js
JSON.parse(localStorage.getItem('maxdev-dashboard:projectCategories'))
```
Expected: reflects your rename and addition. Click a row's delete button
— a confirm modal appears; confirm — it's removed and persisted
immediately (check the console again without needing to click Save).
Finally, open `project-form.html` (Add Project) — the "Projects" sidebar
item should show as active/expanded (not unhighlighted).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "projects: add category management tab"
```

---

## Task 13: Projects — Publish/Unpublish toggle in the list

**Files:**
- Modify: `dashboard/assets/js/pages/projects.js`
- Modify: `dashboard/assets/css/components.css`

**Interfaces:**
- Consumes: the `render()` function from Task 12's `projects.js`
- Produces: nothing later tasks depend on

- [ ] **Step 1: Add the toggle to the Actions column**

In `dashboard/assets/js/pages/projects.js` (as rewritten in Task 12),
find:

```js
                '<div class="actions">' +
                    '<a class="db-icon-btn" href="project-form.html?slug=' + encodeURIComponent(p.slug) + '" aria-label="Edit"><i class="fa fa-pencil"></i></a>' +
                    '<button type="button" class="db-icon-btn" data-delete="' + p.slug + '" aria-label="Delete"><i class="fa fa-trash"></i></button>' +
                '</div>' +
```

Replace with:

```js
                '<div class="actions">' +
                    '<a class="db-icon-btn" href="project-form.html?slug=' + encodeURIComponent(p.slug) + '" aria-label="Edit"><i class="fa fa-pencil"></i></a>' +
                    '<label class="db-toggle" title="Toggle Published/Draft"><input type="checkbox" data-toggle-status="' + p.slug + '"' + (p.status === 'Published' ? ' checked' : '') + '><span class="track"></span></label>' +
                    '<button type="button" class="db-icon-btn" data-delete="' + p.slug + '" aria-label="Delete"><i class="fa fa-trash"></i></button>' +
                '</div>' +
```

Then find (right after the `[data-delete]` handler block, still inside
`render()`):

```js
        rowsEl.querySelectorAll('[data-delete]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var slug = btn.dataset.delete;
                var project = projects.find(function (p) { return p.slug === slug; });
                Modal.confirm({ title: 'Delete "' + project.title + '"?', message: 'This cannot be undone.', danger: true, confirmLabel: 'Delete' })
                    .then(function (ok) {
                        if (!ok) return;
                        projects = projects.filter(function (p) { return p.slug !== slug; });
                        Store.save('projects', projects);
                        Toast.show('Project deleted.', 'success');
                        render();
                    });
            });
        });
    }
```

Replace with:

```js
        rowsEl.querySelectorAll('[data-delete]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var slug = btn.dataset.delete;
                var project = projects.find(function (p) { return p.slug === slug; });
                Modal.confirm({ title: 'Delete "' + project.title + '"?', message: 'This cannot be undone.', danger: true, confirmLabel: 'Delete' })
                    .then(function (ok) {
                        if (!ok) return;
                        projects = projects.filter(function (p) { return p.slug !== slug; });
                        Store.save('projects', projects);
                        Toast.show('Project deleted.', 'success');
                        render();
                    });
            });
        });

        rowsEl.querySelectorAll('[data-toggle-status]').forEach(function (input) {
            input.addEventListener('change', function () {
                var slug = input.dataset.toggleStatus;
                var project = projects.find(function (p) { return p.slug === slug; });
                project.status = input.checked ? 'Published' : 'Draft';
                Store.save('projects', projects);
                Toast.show('Project ' + (project.status === 'Published' ? 'published' : 'unpublished') + '.', 'success');
                render();
            });
        });
    }
```

- [ ] **Step 2: Vertically center the actions row**

In `dashboard/assets/css/components.css`, find:

```css
.db-row-card .actions { display: flex; gap: 10px; justify-content: flex-end; }
```

Replace with:

```css
.db-row-card .actions { display: flex; gap: 10px; justify-content: flex-end; align-items: center; }
```

- [ ] **Step 3: Manual verification**

Open `pages/projects.html?tab=list`. Each row's Actions column now shows
Edit, a toggle switch (on for Published rows, off for Draft), and
Delete, vertically aligned. Click a Published row's toggle off — it
becomes Draft immediately (status pill updates, toast confirms), and in
the console:
```js
JSON.parse(localStorage.getItem('maxdev-dashboard:projects')).find(p => p.slug === '<that-slug>').status
```
Expected: `"Draft"`. Toggle it back on — returns to `"Published"`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "projects: add publish/unpublish toggle to list actions"
```

---

## Task 14: OTP verification becomes UI-only (accepts any 6-digit code)

**Files:**
- Modify: `dashboard/assets/js/auth.js:37-47`

**Interfaces:**
- Consumes: nothing
- Produces: `Auth.verifyOtp(code)` now returns `true` for any string
  matching `/^\d{6}$/`, regardless of what `Auth.requestOtp()` generated.
  Task 15's Settings Account tab implements the same rule independently
  (it never calls `Auth.verifyOtp` — its email-change steps are a
  separate in-page flow with no session-wide OTP to check against), so
  this task and Task 15 don't depend on each other, but both must apply
  the same "any 6 digits passes" behavior for consistency.

- [ ] **Step 1: Relax the check**

In `dashboard/assets/js/auth.js`, find:

```js
        verifyOtp: function (code) {
            var raw = sessionStorage.getItem(OTP_KEY);
            if (!raw) return false;
            var stored = JSON.parse(raw);
            var ok = stored.code === String(code) && Date.now() < stored.expires;
            if (ok) {
                sessionStorage.setItem(OTP_VERIFIED_KEY, "1");
                sessionStorage.removeItem(OTP_KEY);
            }
            return ok;
        },
```

Replace with:

```js
        // DEMO MODE: no real backend sends this code, so verification only
        // checks the code is well-formed (6 digits) rather than matching
        // the generated value — any 6-digit input passes, on purpose.
        verifyOtp: function (code) {
            var ok = /^\d{6}$/.test(String(code));
            if (ok) {
                sessionStorage.setItem(OTP_VERIFIED_KEY, "1");
                sessionStorage.removeItem(OTP_KEY);
            }
            return ok;
        },
```

- [ ] **Step 2: Manual verification**

From `login.html`, click "Forgot Password?" → "Continue to Verification".
On `verify-otp.html`, ignore the dev-mode toast's real code and type any
6 digits (e.g. `000000`) → click Verify. Expected: it proceeds to
`reset-password.html` (previously this would have shown "Invalid or
expired code."). Complete the reset with a new password (min 6 chars) —
should redirect to `login.html` with a success toast.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "auth: OTP verification accepts any well-formed 6-digit code"
```

---

## Task 15: Settings — Account tab (change email + change password)

**Files:**
- Modify: `dashboard/assets/js/seed-data.js`
- Modify: `dashboard/assets/js/shell.js`
- Modify: `dashboard/pages/settings.html`
- Modify: `dashboard/assets/js/pages/settings.js`
- Modify: `dashboard/assets/css/modules/settings.css`

**Interfaces:**
- Consumes: nothing (deliberately does not call `Auth.verifyOtp` — see
  Task 14's Interfaces note)
- Produces: new `account` Store collection:
  `{ email: string, password: string }`. Nothing else in this plan reads
  it.

- [ ] **Step 1: Seed the account collection**

In `dashboard/assets/js/seed-data.js`, find:

```js
    settingsMail: {
        smtpHost: "", smtpPort: 587, smtpUser: "", smtpPassword: "", fromAddress: "", fromName: "MaxDev Portfolio"
    },
```

Replace with:

```js
    account: {
        email: "admin@maxdev.com",
        password: "MaxDev@2026"
    },
    settingsMail: {
        smtpHost: "", smtpPort: 587, smtpUser: "", smtpPassword: "", fromAddress: "", fromName: "MaxDev Portfolio"
    },
```

- [ ] **Step 2: Add "Account" to the Settings sub-nav**

In `dashboard/assets/js/shell.js`, find:

```js
    var NAV_BOTTOM = [
        { id: 'settings', label: 'Settings', icon: 'fa-cog', children: [
            { id: 'settings-mail', label: 'Mail Configuration', href: 'pages/settings.html?tab=mail' },
            { id: 'settings-ai', label: 'AI Assistant Configuration', href: 'pages/settings.html?tab=ai' }
        ]}
    ];
```

Replace with:

```js
    var NAV_BOTTOM = [
        { id: 'settings', label: 'Settings', icon: 'fa-cog', children: [
            { id: 'settings-account', label: 'Account', href: 'pages/settings.html?tab=account' },
            { id: 'settings-mail', label: 'Mail Configuration', href: 'pages/settings.html?tab=mail' },
            { id: 'settings-ai', label: 'AI Assistant Configuration', href: 'pages/settings.html?tab=ai' }
        ]}
    ];
```

- [ ] **Step 3: Add the Account panel to `settings.html`**

In `dashboard/pages/settings.html`, find:

```html
                <div class="db-page-header">
                    <div><h1>Settings</h1><p>Mail delivery and AI Assistant configuration</p></div>
                </div>
                <div class="db-tabstrip" id="tabStrip"></div>

                <section class="db-tab-panel" data-tab="mail">
```

Replace with:

```html
                <div class="db-page-header">
                    <div><h1>Settings</h1><p>Account security, mail delivery and AI Assistant configuration</p></div>
                </div>
                <div class="db-tabstrip" id="tabStrip"></div>

                <section class="db-tab-panel" data-tab="account">
                    <div class="db-grid db-grid-2">
                        <div class="db-card">
                            <h3 class="db-card-title">Change Email</h3>
                            <p class="db-card-subtitle">Verifying both your current and new email keeps the account recoverable</p>
                            <div class="db-form-group"><label>Current Email</label><input class="db-input" id="acCurrentEmail" disabled></div>
                            <div id="acEmailStep1">
                                <div class="db-form-group"><label for="acNewEmail">New Email</label><input type="email" id="acNewEmail" class="db-input"></div>
                                <button type="button" class="db-pill-btn accent" id="acSendCode">Send Code</button>
                            </div>
                            <div id="acEmailStep2" style="display:none;">
                                <div class="db-form-group"><label>Enter the code sent to your current email</label>
                                    <div class="db-otp-row" id="acOtpCurrent">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                    </div>
                                </div>
                                <button type="button" class="db-pill-btn accent" id="acVerifyCurrent">Verify</button>
                            </div>
                            <div id="acEmailStep3" style="display:none;">
                                <div class="db-form-group"><label>Enter the code sent to your new email</label>
                                    <div class="db-otp-row" id="acOtpNew">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                        <input type="text" inputmode="numeric" maxlength="1">
                                    </div>
                                </div>
                                <button type="button" class="db-pill-btn accent" id="acVerifyNew">Verify & Update Email</button>
                            </div>
                        </div>
                        <div class="db-card">
                            <h3 class="db-card-title">Change Password</h3>
                            <p class="db-card-subtitle">Choose a new password for the dashboard admin account</p>
                            <div class="db-form-group"><label for="acOldPassword">Old Password</label><input type="password" id="acOldPassword" class="db-input"></div>
                            <div class="db-form-group"><label for="acNewPassword">New Password</label><input type="password" id="acNewPassword" class="db-input" placeholder="At least 6 characters"></div>
                            <div class="db-form-group"><label for="acConfirmPassword">Confirm New Password</label><input type="password" id="acConfirmPassword" class="db-input"></div>
                            <button type="button" class="db-pill-btn accent" id="acSavePassword">Update Password</button>
                        </div>
                    </div>
                </section>

                <section class="db-tab-panel" data-tab="mail">
```

- [ ] **Step 4: Update the tab logic and add the Account flows**

In `dashboard/assets/js/pages/settings.js`, find:

```js
    var TABS = ['mail', 'ai'];
    var params = new URLSearchParams(window.location.search);
    var activeTab = TABS.indexOf(params.get('tab')) !== -1 ? params.get('tab') : 'mail';

    Shell.init({ active: 'settings-' + activeTab });

    document.getElementById('tabStrip').innerHTML = TABS.map(function (t) {
        var labels = { mail: 'Mail Configuration', ai: 'AI Assistant Configuration' };
        return '<a href="settings.html?tab=' + t + '" class="' + (t === activeTab ? 'active' : '') + '">' + labels[t] + '</a>';
    }).join('');
    document.querySelectorAll('.db-tab-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.tab === activeTab);
    });

    // ---- Mail ----
```

Replace with:

```js
    var TABS = ['account', 'mail', 'ai'];
    var params = new URLSearchParams(window.location.search);
    var activeTab = TABS.indexOf(params.get('tab')) !== -1 ? params.get('tab') : 'account';

    Shell.init({ active: 'settings-' + activeTab });

    document.getElementById('tabStrip').innerHTML = TABS.map(function (t) {
        var labels = { account: 'Account', mail: 'Mail Configuration', ai: 'AI Assistant Configuration' };
        return '<a href="settings.html?tab=' + t + '" class="' + (t === activeTab ? 'active' : '') + '">' + labels[t] + '</a>';
    }).join('');
    document.querySelectorAll('.db-tab-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.tab === activeTab);
    });

    // ---- Account ----
    var account = Store.get('account');
    document.getElementById('acCurrentEmail').value = account.email;

    function wireOtpRow(row) {
        var inputs = Array.prototype.slice.call(row.querySelectorAll('input'));
        inputs.forEach(function (input, i) {
            input.addEventListener('input', function () {
                input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
                if (input.value && inputs[i + 1]) inputs[i + 1].focus();
            });
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && !input.value && inputs[i - 1]) inputs[i - 1].focus();
            });
        });
    }
    function otpRowValue(row) {
        return Array.prototype.slice.call(row.querySelectorAll('input')).map(function (i) { return i.value; }).join('');
    }
    var otpCurrentRow = document.getElementById('acOtpCurrent');
    var otpNewRow = document.getElementById('acOtpNew');
    wireOtpRow(otpCurrentRow);
    wireOtpRow(otpNewRow);

    var pendingNewEmail = '';

    document.getElementById('acSendCode').addEventListener('click', function () {
        var newEmail = document.getElementById('acNewEmail').value.trim();
        if (!newEmail) { Toast.show('Enter a new email address.', 'error'); return; }
        if (newEmail === account.email) { Toast.show('That is already your current email.', 'error'); return; }
        pendingNewEmail = newEmail;
        Toast.show('DEV MODE — a code was "sent" to your current email. Enter any 6 digits.', 'info');
        document.getElementById('acEmailStep1').style.display = 'none';
        document.getElementById('acEmailStep2').style.display = 'block';
        otpCurrentRow.querySelector('input').focus();
    });

    document.getElementById('acVerifyCurrent').addEventListener('click', function () {
        if (!/^\d{6}$/.test(otpRowValue(otpCurrentRow))) { Toast.show('Enter all 6 digits.', 'error'); return; }
        Toast.show('DEV MODE — a code was "sent" to your new email. Enter any 6 digits.', 'info');
        document.getElementById('acEmailStep2').style.display = 'none';
        document.getElementById('acEmailStep3').style.display = 'block';
        otpNewRow.querySelector('input').focus();
    });

    document.getElementById('acVerifyNew').addEventListener('click', function () {
        if (!/^\d{6}$/.test(otpRowValue(otpNewRow))) { Toast.show('Enter all 6 digits.', 'error'); return; }
        account.email = pendingNewEmail;
        Store.save('account', account);
        document.getElementById('acCurrentEmail').value = account.email;
        document.getElementById('acNewEmail').value = '';
        [otpCurrentRow, otpNewRow].forEach(function (row) {
            row.querySelectorAll('input').forEach(function (i) { i.value = ''; });
        });
        document.getElementById('acEmailStep3').style.display = 'none';
        document.getElementById('acEmailStep1').style.display = 'block';
        Toast.show('Email updated.', 'success');
    });

    document.getElementById('acSavePassword').addEventListener('click', function () {
        var oldPw = document.getElementById('acOldPassword').value;
        var newPw = document.getElementById('acNewPassword').value;
        var confirmPw = document.getElementById('acConfirmPassword').value;
        if (!oldPw) { Toast.show('Enter your current password.', 'error'); return; }
        if (oldPw !== account.password) { Toast.show('Old password is incorrect.', 'error'); return; }
        if (newPw.length < 6) { Toast.show('New password must be at least 6 characters.', 'error'); return; }
        if (newPw !== confirmPw) { Toast.show('New passwords do not match.', 'error'); return; }
        account.password = newPw;
        Store.save('account', account);
        document.getElementById('acOldPassword').value = '';
        document.getElementById('acNewPassword').value = '';
        document.getElementById('acConfirmPassword').value = '';
        Toast.show('Password updated.', 'success');
    });

    // ---- Mail ----
```

(Everything from `// ---- Mail ----` onward — the existing Mail and AI
Assistant logic — is unchanged.)

- [ ] **Step 5: Add OTP row styling (settings.html doesn't load auth.css)**

In `dashboard/assets/css/modules/settings.css`, add at the end of the
file:

```css

.db-otp-row { display: flex; gap: 10px; margin: 4px 0 16px; }
.db-otp-row input {
    width: 44px; height: 52px; text-align: center; font-size: 20px;
    border: 1px solid var(--db-border); border-radius: 8px; background: var(--db-surface); color: var(--db-ink);
    font-family: var(--db-font);
}
.db-otp-row input:focus { outline: none; border-color: var(--db-accent); }
```

- [ ] **Step 6: Manual verification**

Open `pages/settings.html` (or click Settings → Account in the sidebar).
The Account tab is now first, showing "Current Email"
(`admin@maxdev.com`, disabled). Test the email flow: type a new email,
click Send Code — step 2 (6-digit boxes, "sent to your current email")
appears; type any 6 digits (e.g. `111111`) and auto-advance works between
boxes; click Verify — step 3 appears ("sent to your new email"); type
any 6 digits, click "Verify & Update Email" — toast "Email updated.",
Current Email field shows the new address, form resets to step 1.
Reload the page — the new email persists. In the console:
```js
JSON.parse(localStorage.getItem('maxdev-dashboard:account'))
```
Expected: `email` matches what you entered.

Test the password flow: enter a wrong Old Password → error toast "Old
password is incorrect." Enter the correct one (`MaxDev@2026`, or whatever
you last saved) with a New Password under 6 characters → length error.
Enter a valid New Password that doesn't match Confirm → mismatch error.
Enter matching valid values → toast "Password updated.", fields clear.
Confirm via console that `account.password` changed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "settings: add account tab for email/password changes"
```

---

## Task 16: README — bring the module list up to date

**Files:**
- Modify: `dashboard/README.md`

**Interfaces:**
- Consumes: nothing
- Produces: nothing (documentation only, final task)

- [ ] **Step 1: Update the Modules section**

In `dashboard/README.md`, find:

```
## Modules

- Dashboard — overview stats and quick links
- Profile & Hero — site identity, social links, homepage hero copy
- About — bio, stats, services, toolbox, testimonials
- Resume — technical/soft skills, experience timeline, education
- Projects — searchable list + full add/edit case-study editor
- Contact — contact details and form endpoint
- Settings — mail configuration, AI Assistant configuration
```

Replace with:

```
## Modules

- Dashboard — overview stats and quick links
- Profile & Hero — site identity, social links, homepage hero copy
- About — bio, stats, services, toolbox, testimonials
- Resume — technical/soft skills, experience timeline, education
- Projects — searchable list + full add/edit case-study editor, plus category management
- Contact — address, email, WhatsApp and phone number
- Settings — account (email/password), mail configuration, AI Assistant configuration
```

- [ ] **Step 2: Manual verification**

Read the file back and confirm the Modules list has no remaining
reference to Media Library or Form Settings/Skype.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: update dashboard README module list"
```
