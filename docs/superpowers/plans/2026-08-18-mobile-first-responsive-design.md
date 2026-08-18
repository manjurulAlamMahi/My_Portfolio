# Mobile-First Responsive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give phones (`<768px`) an app-like navigation shell (fixed bottom tab bar + floating theme toggle, no top header bar) and a full mobile touch-target/spacing/typography/card audit across all pages, while giving tablets (`768–991px`) a lighter touch-up and leaving desktop (`≥992px`) untouched.

**Architecture:** Purely additive CSS/HTML on top of the existing static, no-build, multi-page Bootstrap 3 site. A new `assets/css/mobile-shell.css` owns the phone-only nav shell (mirrors the existing pattern of `sidebar.css`/`floating-nav.css`, which own the desktop shell). `theme.js` is generalized to drive multiple toggle buttons. `responsive.css` gains the touch-target/spacing/typography/card audit rules inside its existing mobile and tablet media-query blocks. Every non-chat HTML page gets the same shell markup added (tab bar + floating toggle), with a per-page hardcoded `active` state — the same convention the existing header nav, sidebar, and floating glass nav already use. No JavaScript routing is introduced.

**Tech Stack:** Plain HTML/CSS/vanilla JS, Bootstrap 3, Font Awesome 4. No build step, no package manager, no test framework.

## Global Constraints

- Breakpoints (already established in `responsive.css`/`floating-nav.css`/`sidebar.css`): phones `<768px`, tablets `768–991px` (existing tablet media query is `min-width: 767px` and `max-width: 991px` — note the 1px overlap with the phone query already exists in the codebase; do not "fix" it, it's pre-existing and out of scope), desktop `≥992px`.
- Palette/type: reuse the site's existing tokens only — `#131212` (near-black), `#fff`, `#F7F7F7` (alt surface), `#8d8d8d` (muted text), Segoe UI, Font Awesome 4 icon classes, sharp corners (no new border-radius scale, no new colors).
- Minimum touch target for any interactive element touched by this plan: 44×44px (phones), 44px min-height (tablet).
- The bottom tab bar and floating theme toggle render on `index.html`, `about.html`, `resume.html`, `projects.html`, `project-details.html`, `contact.html` only. `ai-chat.html` is excluded (it's already a self-contained full-screen chat UI with its own top/bottom bars) but still receives the touch-target bump where it falls short of 44px.
- No test framework exists in this repo. Every task's verification step is a manual check: open the file directly in a browser (`file://` paths work fine — nothing on these pages does a `fetch()` of local data) and use devtools' device toolbar at a 375×667 viewport (iPhone SE/8 size) for phone checks, 820×1180 for tablet checks. Toggle dark mode via the floating toggle/desktop toggle as part of each check.
- Never touch anything scoped to `min-width: 992px` (desktop) — verify after each CSS task that the desktop view is pixel-identical to before.
- This project is not a git repository and the user asked not to initialize one. **Skip every "Commit" step in every task below** — save the file and move on to the next step instead.

---

### Task 1: Create the mobile app shell CSS

**Files:**
- Create: `assets/css/mobile-shell.css`

**Interfaces:**
- Produces: `.mobile-tabbar` (nav shell), `.mobile-theme-toggle` (button), `.about-resume-mobile-cta` / `.about-resume-mobile-card` (About page only, used by Task 6). All three are `display: none` above 767px and enabled inside a `max-width: 767px` media query — later tasks reference these exact class names in HTML.
- Consumes: nothing (new, standalone file).

- [ ] **Step 1: Write the file**

```css
/*
* ----------------------------------------------------------------------------------------
* MOBILE APP SHELL (phones, <768px)
* Bottom tab bar + floating theme toggle, replacing the fixed top header/hamburger menu
* on phone-width screens. Tablet (768-991px) keeps the existing top nav (see responsive.css
* for its touch-target touch-up). Desktop (>=992px) is untouched — see sidebar.css /
* floating-nav.css for that shell.
* ----------------------------------------------------------------------------------------
*/

.mobile-tabbar,
.mobile-theme-toggle,
.about-resume-mobile-cta {
    display: none;
}

@media only screen and (max-width: 767px) {

    /* the old fixed top header/hamburger is replaced by the tab bar + floating toggle */
    .header-top-area {
        display: none;
    }

    /* no more fixed header to clear space for */
    .welcome-image-areaa {
        margin-top: 20px;
    }

    .page-title-area {
        padding-top: 30px;
        padding-bottom: 40px;
    }

    /* leave room for the fixed bottom tab bar so content/footer never sit under it */
    body {
        padding-bottom: 72px;
    }

    /* ---------------- BOTTOM TAB BAR ---------------- */
    .mobile-tabbar {
        display: block;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1002;
        background: #fff;
        border-top: 1px solid #ececec;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
    }

    .mobile-tabbar ul {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .mobile-tabbar li {
        flex: 1 1 0;
    }

    .mobile-tabbar a {
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-height: 58px;
        padding: 8px 4px 6px;
        color: #8d8d8d;
        text-decoration: none;
    }

    .mobile-tabbar a i {
        font-size: 18px;
        line-height: 1;
    }

    .mobile-tabbar a span {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.4px;
    }

    .mobile-tabbar li.active a {
        color: #131212;
    }

    /* ---------------- FLOATING THEME TOGGLE ---------------- */
    .mobile-theme-toggle {
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 1002;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        background: rgba(19, 18, 18, 0.85);
        color: #fff;
        font-size: 15px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
    }

    /* ---------------- ABOUT PAGE: "VIEW FULL RESUME" CARD ---------------- */
    .about-resume-mobile-cta {
        display: block;
        padding: 0 15px;
        margin: 20px 0 10px;
    }

    .about-resume-mobile-card {
        display: -webkit-flex;
        display: flex;
        align-items: center;
        gap: 14px;
        background: #131212;
        color: #fff;
        padding: 16px 18px;
        text-decoration: none;
        min-height: 44px;
    }

    .about-resume-mobile-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 16px;
    }

    .about-resume-mobile-text {
        flex: 1;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .about-resume-mobile-text strong {
        font-size: 14px;
        font-weight: 500;
    }

    .about-resume-mobile-text small {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
    }

    .about-resume-mobile-card > i.fa-chevron-right {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
    }
}
```

- [ ] **Step 2: Verify the file loads with no CSS errors**

This file isn't linked into any page yet (that happens in Tasks 5–10), so there's nothing to visually check yet. Just confirm the file was saved and open it in a text editor to confirm there's no stray unclosed brace (every `{` has a matching `}` — count: 1 top-level rule + 1 media query containing 14 rules = 15 opening/closing pairs).

- [ ] **Step 3: Commit**

```bash
git add assets/css/mobile-shell.css
git commit -m "Add mobile app shell CSS (bottom tab bar, floating theme toggle, About resume card)"
```

(Skip this commit if the project isn't a git repo — this project currently isn't; just leave the file saved.)

---

### Task 2: Generalize theme.js to support multiple toggle buttons

**Files:**
- Modify: `assets/js/theme.js` (full file rewrite — it's 37 lines)

**Interfaces:**
- Consumes: any element in the DOM with a `data-theme-toggle` attribute (produced by Task 5–10's HTML edits, which add this attribute to both the existing desktop `#themeToggle` button and the new `.mobile-theme-toggle` button).
- Produces: click-to-toggle dark mode behavior identical to today's, now applied to every matching element instead of a single `#themeToggle`.

- [ ] **Step 1: Replace the file contents**

```js
/*
* ----------------------------------------------------------------------------------------
* DARK / LIGHT THEME TOGGLE
* Applies the "dark-mode" class to <html>. Persisted in localStorage, respects the
* OS color-scheme preference on first visit. Pairs with the early inline snippet in
* <head> (prevents a flash of the wrong theme) and assets/css/theme-dark.css.
* Drives every element with a [data-theme-toggle] attribute on the page (the desktop
* floating-nav button and the mobile floating button both carry it).
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    var STORAGE_KEY = "pretty-theme";
    var root = document.documentElement;
    var btns = document.querySelectorAll("[data-theme-toggle]");

    function updateIcons() {
        var dark = root.classList.contains("dark-mode");
        for (var i = 0; i < btns.length; i++) {
            var icon = btns[i].querySelector("i");
            if (icon) icon.className = dark ? "fa fa-sun-o" : "fa fa-moon-o";
        }
    }

    updateIcons();

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            root.classList.toggle("dark-mode");
            try {
                localStorage.setItem(STORAGE_KEY, root.classList.contains("dark-mode") ? "dark" : "light");
            } catch (e) {
                /* localStorage unavailable (e.g. private mode) — theme just won't persist */
            }
            updateIcons();
        });
    }
})();
```

- [ ] **Step 2: Verify against the current (not-yet-updated) pages**

Open `index.html` directly in a browser. The desktop floating nav's theme toggle (`#themeToggle`) won't do anything yet — it doesn't carry `data-theme-toggle` until Task 5. That's expected; this task only changes the JS. Confirm the page loads with no JS console errors (open devtools console, check for red errors mentioning `theme.js`).

- [ ] **Step 3: Commit**

```bash
git add assets/js/theme.js
git commit -m "Generalize theme.js to drive multiple toggle buttons via data-theme-toggle"
```

---

### Task 3: Dark-mode styling for the new shell elements

**Files:**
- Modify: `assets/css/theme-dark.css`

**Interfaces:**
- Consumes: `.mobile-tabbar`, `.mobile-theme-toggle` class names from Task 1.
- Produces: nothing consumed by later tasks — this is a leaf styling addition.

- [ ] **Step 1: Append this block to the end of the file**

```css

/* ---------------- MOBILE APP SHELL ---------------- */
html.dark-mode .mobile-tabbar {
    background: #131212;
    border-top-color: #2c2c2c;
}

html.dark-mode .mobile-tabbar a {
    color: #8d8d8d;
}

html.dark-mode .mobile-tabbar li.active a {
    color: #fff;
}

html.dark-mode .mobile-theme-toggle {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
}
```

Note: `.about-resume-mobile-card` is intentionally left out — it's already a dark card (`#131212` background, white text) by design in Task 1, so it looks correct in both light and dark themes without an override.

- [ ] **Step 2: Verify**

No visual check possible yet (the shell markup isn't wired into any page until Task 5+). Just confirm the CSS is syntactically valid — every selector block above has a matching `{`/`}`.

- [ ] **Step 3: Commit**

```bash
git add assets/css/theme-dark.css
git commit -m "Add dark-mode rules for the mobile app shell"
```

---

### Task 4: Hide the AI floating button on phones

**Files:**
- Modify: `assets/css/ai-fab.css:70-80`

**Interfaces:**
- Consumes: nothing new.
- Produces: `.ai-fab` hidden `<768px` (it stays visible at `768–991px`, where there is no tab bar yet).

**Context:** AI Chat now has a dedicated tab in the bottom bar (added in Task 5–10), so the floating button is redundant on phones. It must stay visible on tablets since tablets keep the old top nav without an AI Chat entry.

- [ ] **Step 1: Replace the existing mobile block**

Find this existing block (currently shrinks the FAB instead of hiding it):

```css
@media (max-width: 767px) {
    .ai-fab {
        right: 18px;
        bottom: 18px;
        padding: 14px;
    }

    .ai-fab .ai-fab-label {
        display: none;
    }
}
```

Replace it with:

```css
@media (max-width: 767px) {
    .ai-fab {
        display: none;
    }
}
```

- [ ] **Step 2: Verify**

Open `index.html` in a browser at a 375×667 viewport (devtools device toolbar). Before Task 5 wires in the tab bar, you should simply see the AI FAB has disappeared at this width, and reappear if you widen the viewport past 768px.

- [ ] **Step 3: Commit**

```bash
git add assets/css/ai-fab.css
git commit -m "Hide the AI floating button on phones now that AI Chat has a tab bar entry"
```

---

### Task 5: Wire the mobile shell into index.html (Home tab active)

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `mobile-shell.css` (Task 1), `data-theme-toggle` handling from `theme.js` (Task 2).
- Produces: the reference markup pattern every other page's shell wiring (Tasks 6–10) copies, with only the `href`/`active`/icon differing.

- [ ] **Step 1: Add the stylesheet link**

In `<head>`, find:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

Replace with:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- MOBILE APP SHELL CSS -->
    <link rel="stylesheet" href="assets/css/mobile-shell.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

- [ ] **Step 2: Mark the desktop theme toggle for the generalized JS**

Find:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>
```

Replace with:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" data-theme-toggle aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>

    <!-- ====================== Mobile App Shell (phones) ====================== -->
    <button type="button" class="mobile-theme-toggle" data-theme-toggle aria-label="Toggle dark mode">
        <i class="fa fa-moon-o"></i>
    </button>
```

- [ ] **Step 3: Add the bottom tab bar**

Find:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <!-- LATEST JQUERY -->
```

Replace with:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <nav class="mobile-tabbar" aria-label="Primary">
        <ul>
            <li class="active"><a href="index.html"><i class="fa fa-home"></i><span>Home</span></a></li>
            <li><a href="about.html"><i class="fa fa-user"></i><span>About</span></a></li>
            <li><a href="projects.html"><i class="fa fa-folder-open"></i><span>Projects</span></a></li>
            <li><a href="contact.html"><i class="fa fa-envelope"></i><span>Contact</span></a></li>
            <li><a href="ai-chat.html"><i class="fa fa-comments"></i><span>Chat</span></a></li>
        </ul>
    </nav>

    <!-- LATEST JQUERY -->
```

- [ ] **Step 4: Verify in a browser**

Open `index.html` at a 375×667 viewport:
- No top header bar is visible; content starts near the top of the screen.
- A small dark circular button with a moon icon floats top-right; clicking it switches the whole page to dark mode and the icon becomes a sun. Click again to switch back.
- A 5-icon bar is fixed to the bottom (Home/About/Projects/Contact/Chat), Home is visually highlighted (darker) as active, and the page content/footer never sits underneath it.
- Tapping each tab navigates to the right page (About/Projects/Contact will 404-style show unstyled shells until their own tasks land — that's expected at this point in the plan).
- Widen the viewport to 1024px: the tab bar and floating toggle disappear, the desktop sidebar/floating nav look exactly as they did before this task.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Wire the mobile app shell into index.html"
```

---

### Task 6: Wire the mobile shell into about.html (About tab active) + Resume CTA card

**Files:**
- Modify: `about.html`

**Interfaces:**
- Consumes: same as Task 5, plus `.about-resume-mobile-cta`/`.about-resume-mobile-card` from Task 1.
- Produces: nothing new for later tasks.

- [ ] **Step 1: Add the stylesheet link**

Find (note `about.html` has an extra `SHARED SECTIONS CSS` line compared to `index.html`, but the anchor text below is identical across pages):

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

Replace with:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- MOBILE APP SHELL CSS -->
    <link rel="stylesheet" href="assets/css/mobile-shell.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

- [ ] **Step 2: Mark the desktop theme toggle + add the mobile one**

Find:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>
```

Replace with:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" data-theme-toggle aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>

    <!-- ====================== Mobile App Shell (phones) ====================== -->
    <button type="button" class="mobile-theme-toggle" data-theme-toggle aria-label="Toggle dark mode">
        <i class="fa fa-moon-o"></i>
    </button>
```

- [ ] **Step 3: Add the "View Full Resume" mobile card right after the About hero block**

Find:

```html
    <!-- / END ABOUT HERO / INTRO AREA -->

    <!-- START ABOUT STATS AREA -->
```

Replace with:

```html
    <!-- / END ABOUT HERO / INTRO AREA -->

    <!-- START MOBILE-ONLY RESUME CTA (phones only, see mobile-shell.css) -->
    <div class="about-resume-mobile-cta">
        <a href="resume.html" class="about-resume-mobile-card">
            <span class="about-resume-mobile-icon"><i class="fa fa-file-text-o"></i></span>
            <span class="about-resume-mobile-text">
                <strong>View Full Resume</strong>
                <small>Experience, education &amp; skills</small>
            </span>
            <i class="fa fa-chevron-right"></i>
        </a>
    </div>
    <!-- / END MOBILE-ONLY RESUME CTA -->

    <!-- START ABOUT STATS AREA -->
```

- [ ] **Step 4: Add the bottom tab bar (About active)**

Find:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <!-- LATEST JQUERY -->
```

Replace with:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <nav class="mobile-tabbar" aria-label="Primary">
        <ul>
            <li><a href="index.html"><i class="fa fa-home"></i><span>Home</span></a></li>
            <li class="active"><a href="about.html"><i class="fa fa-user"></i><span>About</span></a></li>
            <li><a href="projects.html"><i class="fa fa-folder-open"></i><span>Projects</span></a></li>
            <li><a href="contact.html"><i class="fa fa-envelope"></i><span>Contact</span></a></li>
            <li><a href="ai-chat.html"><i class="fa fa-comments"></i><span>Chat</span></a></li>
        </ul>
    </nav>

    <!-- LATEST JQUERY -->
```

- [ ] **Step 5: Verify in a browser**

Open `about.html` at 375×667:
- Shell behaves as in Task 5's check, with **About** highlighted as active.
- Directly below the profile photo/bio block, a dark "View Full Resume" card is visible with a document icon, and tapping it navigates to `resume.html`.
- Confirm the card is NOT visible at a 1024px viewport (desktop keeps Resume in the sidebar/floating nav only).

- [ ] **Step 6: Commit**

```bash
git add about.html
git commit -m "Wire the mobile app shell into about.html and add the mobile Resume CTA card"
```

---

### Task 7: Wire the mobile shell into resume.html (About tab active)

**Files:**
- Modify: `resume.html`

**Interfaces:**
- Consumes: same as Task 5.
- Produces: nothing new.

**Design note:** `resume.html` has no bottom-tab entry of its own (per spec — Resume is reached via the About page on mobile). The tab bar still needs to render here (so navigation stays available while reading the resume); **About** stays highlighted as active since that's the tab this page is conceptually nested under, the same way `project-details.html` (Task 9) keeps **Projects** active.

- [ ] **Step 1: Add the stylesheet link**

Find:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

Replace with:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- MOBILE APP SHELL CSS -->
    <link rel="stylesheet" href="assets/css/mobile-shell.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

- [ ] **Step 2: Mark the desktop theme toggle + add the mobile one**

Find:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>
```

Replace with:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" data-theme-toggle aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>

    <!-- ====================== Mobile App Shell (phones) ====================== -->
    <button type="button" class="mobile-theme-toggle" data-theme-toggle aria-label="Toggle dark mode">
        <i class="fa fa-moon-o"></i>
    </button>
```

- [ ] **Step 3: Add the bottom tab bar (About active)**

Find:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <!-- LATEST JQUERY -->
```

Replace with:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <nav class="mobile-tabbar" aria-label="Primary">
        <ul>
            <li><a href="index.html"><i class="fa fa-home"></i><span>Home</span></a></li>
            <li class="active"><a href="about.html"><i class="fa fa-user"></i><span>About</span></a></li>
            <li><a href="projects.html"><i class="fa fa-folder-open"></i><span>Projects</span></a></li>
            <li><a href="contact.html"><i class="fa fa-envelope"></i><span>Contact</span></a></li>
            <li><a href="ai-chat.html"><i class="fa fa-comments"></i><span>Chat</span></a></li>
        </ul>
    </nav>

    <!-- LATEST JQUERY -->
```

- [ ] **Step 4: Verify in a browser**

Open `resume.html` at 375×667: shell renders, **About** tab is highlighted, dark mode toggle works, desktop view (1024px) unchanged.

- [ ] **Step 5: Commit**

```bash
git add resume.html
git commit -m "Wire the mobile app shell into resume.html (About tab stays active)"
```

---

### Task 8: Wire the mobile shell into projects.html (Projects tab active)

**Files:**
- Modify: `projects.html`

**Interfaces:**
- Consumes: same as Task 5.
- Produces: nothing new.

- [ ] **Step 1: Add the stylesheet link**

Find:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

Replace with:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- MOBILE APP SHELL CSS -->
    <link rel="stylesheet" href="assets/css/mobile-shell.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

- [ ] **Step 2: Mark the desktop theme toggle + add the mobile one**

Find:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>
```

Replace with:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" data-theme-toggle aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>

    <!-- ====================== Mobile App Shell (phones) ====================== -->
    <button type="button" class="mobile-theme-toggle" data-theme-toggle aria-label="Toggle dark mode">
        <i class="fa fa-moon-o"></i>
    </button>
```

- [ ] **Step 3: Add the bottom tab bar (Projects active)**

Find:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <!-- LATEST JQUERY -->
```

Replace with:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <nav class="mobile-tabbar" aria-label="Primary">
        <ul>
            <li><a href="index.html"><i class="fa fa-home"></i><span>Home</span></a></li>
            <li><a href="about.html"><i class="fa fa-user"></i><span>About</span></a></li>
            <li class="active"><a href="projects.html"><i class="fa fa-folder-open"></i><span>Projects</span></a></li>
            <li><a href="contact.html"><i class="fa fa-envelope"></i><span>Contact</span></a></li>
            <li><a href="ai-chat.html"><i class="fa fa-comments"></i><span>Chat</span></a></li>
        </ul>
    </nav>

    <!-- LATEST JQUERY -->
```

- [ ] **Step 4: Verify in a browser**

Open `projects.html` at 375×667: shell renders, **Projects** tab highlighted, project filter chips and cards are tappable (full touch-target sizing lands in Task 11, but confirm nothing is visually broken by the shell itself), desktop view (1024px) unchanged.

- [ ] **Step 5: Commit**

```bash
git add projects.html
git commit -m "Wire the mobile app shell into projects.html"
```

---

### Task 9: Wire the mobile shell into project-details.html (Projects tab active)

**Files:**
- Modify: `project-details.html`

**Interfaces:**
- Consumes: same as Task 5.
- Produces: nothing new.

- [ ] **Step 1: Add the stylesheet link**

Find:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

Replace with:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- MOBILE APP SHELL CSS -->
    <link rel="stylesheet" href="assets/css/mobile-shell.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

- [ ] **Step 2: Mark the desktop theme toggle + add the mobile one**

Find:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>
```

Replace with:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" data-theme-toggle aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>

    <!-- ====================== Mobile App Shell (phones) ====================== -->
    <button type="button" class="mobile-theme-toggle" data-theme-toggle aria-label="Toggle dark mode">
        <i class="fa fa-moon-o"></i>
    </button>
```

- [ ] **Step 3: Add the bottom tab bar (Projects active)**

Find:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <!-- LATEST JQUERY -->
```

Replace with:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <nav class="mobile-tabbar" aria-label="Primary">
        <ul>
            <li><a href="index.html"><i class="fa fa-home"></i><span>Home</span></a></li>
            <li><a href="about.html"><i class="fa fa-user"></i><span>About</span></a></li>
            <li class="active"><a href="projects.html"><i class="fa fa-folder-open"></i><span>Projects</span></a></li>
            <li><a href="contact.html"><i class="fa fa-envelope"></i><span>Contact</span></a></li>
            <li><a href="ai-chat.html"><i class="fa fa-comments"></i><span>Chat</span></a></li>
        </ul>
    </nav>

    <!-- LATEST JQUERY -->
```

- [ ] **Step 4: Verify in a browser**

Open `project-details.html?slug=<any-real-project-slug-from-projects-data.js>` (or however `project-details.js` reads which project to render — open `projects.html` and tap a project card, it should carry you here with the shell intact) at 375×667: shell renders, **Projects** tab highlighted, desktop view (1024px) unchanged.

- [ ] **Step 5: Commit**

```bash
git add project-details.html
git commit -m "Wire the mobile app shell into project-details.html"
```

---

### Task 10: Wire the mobile shell into contact.html (Contact tab active)

**Files:**
- Modify: `contact.html`

**Interfaces:**
- Consumes: same as Task 5.
- Produces: nothing new.

- [ ] **Step 1: Add the stylesheet link**

`contact.html` does not load `sections.css`, but the anchor lines are otherwise identical to the other pages. Find:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

Replace with:

```html
    <!-- FLOATING GLASS NAV CSS -->
    <link rel="stylesheet" href="assets/css/floating-nav.css">
    <!-- MOBILE APP SHELL CSS -->
    <link rel="stylesheet" href="assets/css/mobile-shell.css">
    <!-- DARK THEME CSS -->
    <link rel="stylesheet" href="assets/css/theme-dark.css">
```

- [ ] **Step 2: Mark the desktop theme toggle + add the mobile one**

Find:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>
```

Replace with:

```html
        <button type="button" class="theme-toggle-btn" id="themeToggle" data-theme-toggle aria-label="Toggle dark mode">
            <i class="fa fa-moon-o"></i>
        </button>
    </nav>

    <!-- ====================== Mobile App Shell (phones) ====================== -->
    <button type="button" class="mobile-theme-toggle" data-theme-toggle aria-label="Toggle dark mode">
        <i class="fa fa-moon-o"></i>
    </button>
```

- [ ] **Step 3: Add the bottom tab bar (Contact active)**

Find:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <!-- LATEST JQUERY -->
```

Replace with:

```html
    <!-- ====================== AI Chat Floating Button ====================== -->
    <a href="ai-chat.html" class="ai-fab">
        <span class="ai-fab-icon"><i class="fa fa-comments"></i></span>
        <span class="ai-fab-label">AI Assistant</span>
    </a>

    <nav class="mobile-tabbar" aria-label="Primary">
        <ul>
            <li><a href="index.html"><i class="fa fa-home"></i><span>Home</span></a></li>
            <li><a href="about.html"><i class="fa fa-user"></i><span>About</span></a></li>
            <li><a href="projects.html"><i class="fa fa-folder-open"></i><span>Projects</span></a></li>
            <li class="active"><a href="contact.html"><i class="fa fa-envelope"></i><span>Contact</span></a></li>
            <li><a href="ai-chat.html"><i class="fa fa-comments"></i><span>Chat</span></a></li>
        </ul>
    </nav>

    <!-- LATEST JQUERY -->
```

- [ ] **Step 4: Verify in a browser**

Open `contact.html` at 375×667: shell renders, **Contact** tab highlighted, form still submits (don't actually submit to the live Formspree endpoint during this check — just confirm the fields are focusable/typeable), desktop view (1024px) unchanged.

- [ ] **Step 5: Commit**

```bash
git add contact.html
git commit -m "Wire the mobile app shell into contact.html"
```

---

### Task 11: Mobile content audit — spacing, typography, touch targets, cards, form (`<768px`)

**Files:**
- Modify: `assets/css/responsive.css` (append after line 134, before the empty "Wide Mobile Layout: 480px" comment block that starts at line 137)

**Interfaces:**
- Consumes: existing class names from `sections.css`/`style.css`/`project-cards.css` (all confirmed present in the HTML: `.about-block`, `.work`, `.contact-me-area`, `.about-section-title`, `.section-title`, `.home-btn`, `.contact-form input[type='submit']`, `.whatido-card`, `.about-resume-cta`, `.inline-cta`, `.more-portfolio`, `.about-social-row a`, `.project-filters button`, `.skills-tab-btn`, `.testimonial-nav button`, `.testimonial-card`, `.edu-card`, `.resume-columns`/`.resume-col`, `.about-hero-inner`/`.about-hero-media`/`.about-hero-content`, `.about-stats-row`/`.about-stat`).
- Produces: nothing consumed by later tasks.

**Context:** Bootstrap's `.col-md-6` on the contact form's name/email fields (`contact.html`) already stacks to full width below 992px by default (no `col-sm-*`/`col-xs-*` companion class is set) — no extra CSS is needed to achieve single-column stacking, only the touch-target and full-width-submit fixes below.

- [ ] **Step 1: Insert this block right after line 134 (`}` that closes the "Mobile Layout: 320px" media query) and before line 136's "Wide Mobile Layout: 480px" comment**

```css

/* ---------------------------------------------------------------------
   MOBILE CONTENT AUDIT (<768px): section rhythm, typography, touch
   targets, card reflow, and the contact form — across index/about/
   resume/projects/project-details/contact.
   --------------------------------------------------------------------- */
@media only screen and (max-width: 767px) {

    /* ---- section rhythm ---- */
    .about-block,
    .work,
    .contact-me-area {
        padding: 32px 0;
    }

    .about-section-title h2 {
        font-size: 22px;
    }

    .section-title h2 {
        font-size: 24px;
    }

    /* ---- touch targets: 44px minimum on every tappable control ---- */
    .home-btn,
    .whatido-card a,
    .about-resume-cta a,
    .inline-cta a,
    .more-portfolio {
        min-height: 44px;
        display: -webkit-inline-flex;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .contact-form input[type='submit'] {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        min-height: 44px;
        align-items: center;
        justify-content: center;
    }

    .about-social-row a {
        width: 44px;
        height: 44px;
    }

    .project-filters button,
    .skills-tab-btn {
        min-height: 44px;
        padding: 10px 18px;
        margin: 0 5px 10px;
    }

    .testimonial-nav button {
        width: 10px;
        height: 10px;
        padding: 17px;
        background-clip: content-box;
        -webkit-background-clip: content-box;
    }

    /* ---- cards: tighter padding, single-column reflow ---- */
    .whatido-card {
        padding: 30px 20px;
    }

    .testimonial-card {
        padding: 30px 20px;
    }

    .edu-card {
        padding: 22px;
    }

    .resume-columns {
        display: block;
    }

    .resume-col + .resume-col {
        margin-top: 40px;
    }

    .about-hero-inner {
        display: block;
        text-align: center;
    }

    .about-hero-media {
        flex: none;
        margin-bottom: 24px;
    }

    .about-hero-content h1 {
        font-size: 26px;
    }

    .about-stats-row {
        flex-wrap: wrap;
    }

    .about-stat {
        flex: 1 1 50%;
        padding: 16px 10px;
        border-right: none;
        margin-bottom: 12px;
    }
}
```

- [ ] **Step 2: Verify in a browser**

At 375×667:
- `index.html`: hero/section spacing feels tighter than before, "Learn More"/"View My Resume" buttons are visibly taller (≥44px tall) and centered text.
- `about.html`: hero image sits above the centered bio text (not side-by-side), the 4 stats wrap into a 2×2 grid, social icons are 44×44, "What I Do" cards have tighter padding, testimonial dots are still visually small but now have a much larger invisible tap area (use devtools to inspect the computed box — padding should read 17px).
- `resume.html`: Experience and Education columns stack vertically with a gap between them, skill/soft-skill tab buttons are ≥44px tall.
- `projects.html`: filter chips are ≥44px tall and easier to tap.
- `contact.html`: submit button spans the full width of the form and is ≥44px tall.
- Widen to 1024px: confirm every one of the above reverts to the original desktop layout (this block is fully scoped to `max-width: 767px`).

- [ ] **Step 3: Commit**

```bash
git add assets/css/responsive.css
git commit -m "Add mobile content audit: spacing, typography, touch targets, card reflow"
```

---

### Task 12: Tablet touch-up — 44px touch targets on the existing top nav (`768–991px`)

**Files:**
- Modify: `assets/css/responsive.css:9-41` (the existing "Tablet Layout: 768px" media query)

**Interfaces:**
- Consumes: `.mainmenu .navbar-nav li a`, `.navbar-toggle`, `.project-filters button`, `.skills-tab-btn`, `.home-btn`, `.contact-form input[type='submit']`, `.about-social-row a`, `.testimonial-nav button` (all existing classes, same as Task 11).
- Produces: nothing consumed later.

- [ ] **Step 1: Append these rules inside the existing tablet media query**

Find the closing brace of the tablet block:

```css
    .about-text {
        padding-top: 20px;
    }
}
```

(this is the block that starts `@media only screen and (min-width: 767px) and (max-width: 991px) {`)

Replace with:

```css
    .about-text {
        padding-top: 20px;
    }

    /* ---- touch-up: 44px minimum tap targets, no structural changes ---- */
    .mainmenu .navbar-nav li a {
        padding: 14px 15px;
        min-height: 44px;
        display: block;
    }

    .navbar-toggle {
        min-width: 44px;
        min-height: 44px;
        padding: 12px;
    }

    .project-filters button,
    .skills-tab-btn,
    .home-btn,
    .contact-form input[type='submit'] {
        min-height: 44px;
    }

    .about-social-row a {
        width: 44px;
        height: 44px;
    }

    .testimonial-nav button {
        width: 10px;
        height: 10px;
        padding: 17px;
        background-clip: content-box;
        -webkit-background-clip: content-box;
    }
}
```

- [ ] **Step 2: Verify in a browser**

At an 820×1180 viewport (devtools device toolbar, iPad Air size): open the hamburger menu on `index.html` — each link row is noticeably taller/easier to tap. Check `projects.html` filter chips and `resume.html` skill tabs are taller. Confirm no bottom tab bar or floating toggle appears at this width (those are phone-only from Task 1). Widen to 1024px and confirm the tablet-only rules no longer apply.

- [ ] **Step 3: Commit**

```bash
git add assets/css/responsive.css
git commit -m "Bump tablet touch targets to 44px on the existing top nav"
```

---

### Task 13: AI chat page touch-target bump

**Files:**
- Modify: `assets/css/ai-chat.css:323-345` (`.ai-send-btn`), `:78-89` (`.ai-chat-back`), `:267-279` (`.ai-suggestion-btn`)

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed later — `ai-chat.html` is excluded from the tab bar/floating toggle per the Global Constraints, this is its only change in this plan.

- [ ] **Step 1: Bump the send button to 44×44**

Find:

```css
.ai-send-btn {
    width: 42px;
    height: 42px;
```

Replace with:

```css
.ai-send-btn {
    width: 44px;
    height: 44px;
```

- [ ] **Step 2: Bump the back button and suggestion chips to a 44px minimum height**

Find:

```css
.ai-chat-back {
    color: #fff;
    text-decoration: none;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 9px 16px;
    border-radius: 30px;
    -webkit-transition: all 0.25s;
    transition: all 0.25s;
}
```

Replace with:

```css
.ai-chat-back {
    display: -webkit-inline-flex;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    color: #fff;
    text-decoration: none;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 9px 16px;
    border-radius: 30px;
    -webkit-transition: all 0.25s;
    transition: all 0.25s;
}
```

Find:

```css
.ai-suggestion-btn {
    flex-shrink: 0;
    background: #fff;
    border: 1px solid #e4e4e4;
    color: #333;
    padding: 9px 16px;
    border-radius: 30px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
}
```

Replace with:

```css
.ai-suggestion-btn {
    flex-shrink: 0;
    display: -webkit-inline-flex;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    background: #fff;
    border: 1px solid #e4e4e4;
    color: #333;
    padding: 9px 16px;
    border-radius: 30px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
}
```

- [ ] **Step 3: Verify in a browser**

Open `ai-chat.html` at 375×667: the send button (paper-plane icon, bottom-right of the input bar) is visibly a touch larger, the suggestion chips ("About", "Services", "Projects", "Resume", "Contact") and the "Back to Portfolio" button are all comfortably tappable. Confirm the chat still scrolls and typing/sending a message still works (type a question, tap send, a bot reply should appear — this page has a working client-side demo already, unaffected by this CSS-only change).

- [ ] **Step 4: Commit**

```bash
git add assets/css/ai-chat.css
git commit -m "Bump AI chat page touch targets to 44px minimum"
```

---

### Task 14: Full end-to-end verification pass

**Files:** none (verification only)

**Interfaces:** none.

- [ ] **Step 1: Phone pass (375×667, then 414×896 for a larger phone)**

For each of `index.html`, `about.html`, `resume.html`, `projects.html`, a `project-details.html` case study, `contact.html`:
- Bottom tab bar present, correct tab active, all 5 tabs navigate correctly.
- No top header bar; floating theme toggle top-right works and persists across a page reload (`localStorage`).
- No content or footer element is hidden behind the tab bar.
- Touch targets audited in Tasks 11/13 all look and measure ≥44px via devtools' box model inspector on at least one control per page.
- Dark mode: toggle on, navigate between 2–3 pages, confirm the tab bar/floating toggle/cards all render with correct dark colors and the choice persists.

For `ai-chat.html`: no tab bar (expected — excluded by design), send/back/suggestion buttons are ≥44px, chat still functions.

- [ ] **Step 2: Tablet pass (820×1180)**

Confirm the old hamburger top nav is still what renders (no tab bar, no floating toggle), and that the touch-target bump from Task 12 is visible when the menu is open and on filter/tab buttons.

- [ ] **Step 3: Desktop pass (1440×900)**

Confirm the sidebar + floating glass nav look and behave exactly as they did before this plan — no regressions from any CSS added in Tasks 1, 3, 4, 11, or 12 (all of it is media-query-scoped below 992px).

- [ ] **Step 4: Report results**

If every check above passes, the feature is complete. If anything fails, note exactly which page/breakpoint/control and fix it in the relevant task's file before considering the plan done — do not move on with a known-broken check.

---

## Post-Implementation Correction

Browser verification (Playwright, headless Chromium, real computed styles —
not just visual screenshots) caught a cascade-order bug: `responsive.css` is
linked in `<head>` **before** `sections.css`/`sidebar.css`/`floating-nav.css`
on every page. Task 11 and Task 12's rules were originally added to
`responsive.css`, but several of them share a selector and property with a
same-specificity rule in `sections.css` (`.about-block`, `.about-social-row a`,
`.home-btn`, `.resume-columns`, `.about-hero-inner`, `.testimonial-nav button`,
etc.) — and since `sections.css` loads later, it silently won the cascade,
so roughly half of the intended audit rules never actually applied
(confirmed via `getComputedStyle` before the fix: `.about-social-row a`
measured 42px instead of the intended 44px, `.about-hero-inner` computed
`display: flex` instead of `block`, `.resume-columns` stayed `flex`, etc.).

**Fix applied:** both rule sets were moved out of `responsive.css` and into
`assets/css/mobile-shell.css` instead — appended inside its existing
`max-width: 767px` block (Task 11's rules) and a new
`min-width: 767px and max-width: 991px` block (Task 12's rules). That
stylesheet is linked last on every page (right before `theme-dark.css`), so
its rules now correctly win the cascade. `responsive.css` itself was left
exactly as it was before this plan touched it.

A second, related bug was caught the same way: `.testimonial-nav button`
sits under Bootstrap's global `box-sizing: border-box`. Setting `width: 10px`
with `padding: 17px` doesn't produce a 44px box under border-box sizing — the
browser can't shrink the content area below 0, so the used width becomes just
`padding × 2` (34px), 10px short of the 44px target. Fixed by setting
`width: 44px; padding: 17px` directly (content box works out to
`44 − 34 = 10px`, still showing a small dot via `background-clip: content-box`,
but now with a true 44×44 tap target) — applied in both the phone and tablet
blocks in `mobile-shell.css`.

Both fixes were verified with `getComputedStyle`/`boundingBox()` assertions
in a throwaway Playwright script (not part of the shipped code), re-run after
the fix to confirm `.about-social-row a` → 44×44, `.about-hero-inner` →
`display: block`, `.resume-columns` → `display: block`, and
`.testimonial-nav button` → 44×44, on top of the original desktop/tablet/phone
screenshots showing no regressions.

## Self-Review Notes

- **Spec coverage:** breakpoint strategy → Global Constraints + Task 1; bottom tab bar composition (Home/About/Projects/Contact/AI Chat) → Tasks 5–10; AI Chat as full-screen destination → Task 1 (tab bar excluded) + existing `ai-chat.html` structure (untouched); floating theme toggle → Tasks 1–3, 5–10; Resume-on-About card → Task 6; tablet light touch-up → Task 12; full mobile content audit (touch targets/spacing/typography/cards/forms) → Task 11; ai-chat.html touch-target fixes → Task 13; file plan → matches Tasks 1–13 exactly.
- **Placeholder scan:** no TBD/TODO markers; every code step has complete, copy-pasteable code; every HTML edit step names its exact anchor text.
- **Type/name consistency:** `data-theme-toggle` attribute name is identical across Task 2 (JS selector) and Tasks 5–10 (HTML markup). `.mobile-tabbar` / `.mobile-theme-toggle` / `.about-resume-mobile-cta` class names are identical between Task 1 (CSS definition) and Tasks 5–10/6 (HTML usage). No mismatches found.
