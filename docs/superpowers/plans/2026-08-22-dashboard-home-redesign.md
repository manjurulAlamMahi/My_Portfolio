# Dashboard Home Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Dashboard home page (`dashboard/index.html`) per
`docs/superpowers/specs/2026-08-22-dashboard-home-redesign-design.md`: a
live-clock stat tile, a conditional "today's event" alert, a two-column
Projects Overview (with a new category breakdown) + Calendar row, and
calendar event indicators — all as a static/mockup layer with no new
`Store` collection.

**Architecture:** No changes to the dashboard's existing architecture.
Continues the established page-controller pattern
(`assets/js/pages/dashboard-home.js` reads via `Store.get`, renders into
`index.html`'s containers). The event data added by this plan is
deliberately **not** Store-backed — it's a small hardcoded array local to
`dashboard-home.js`, per an explicit static-mockup decision during
planning.

**Tech Stack:** Vanilla ES5-style JavaScript (IIFEs, `var`, string
concatenation for templates), plain CSS (custom properties from
`tokens.css`).

## Global Constraints

- Scope is exactly 3 files: `dashboard/index.html`,
  `dashboard/assets/js/pages/dashboard-home.js`,
  `dashboard/assets/css/modules/dashboard.css`. No other file changes.
- The event/alert/calendar-dot feature uses a hardcoded `sampleEvents`
  array declared once in `dashboard-home.js` — it must NOT go through
  `Store.get`/`Store.save`, and the "Add Event" button must NOT get a
  click handler in this plan (static mockup, confirmed during planning).
- Match the codebase's existing style: 4-space indents, `var`, function
  expressions, string concatenation with `+` for HTML templates (no
  template literals, no `let`/`const`, no arrow functions).
- No automated test suite exists in this project and none is being
  introduced. Every task's verification step is manual: serve
  `dashboard/` with any static server (or open the files directly) and
  perform the exact actions listed, confirming the exact expected result.
- Category bar colors: single accent hue (`var(--db-accent)`) for every
  bar — this is a magnitude comparison with direct labels, not an identity
  chart, so no categorical multi-color palette is used (per the dataviz
  skill's form guidance, applied during planning).

---

## Task 1: Row 2 restructure — 2-column layout + live-clock stat tile

**Files:**
- Modify: `dashboard/index.html`
- Modify: `dashboard/assets/js/pages/dashboard-home.js`
- Modify: `dashboard/assets/css/modules/dashboard.css`

**Interfaces:**
- Consumes: nothing
- Produces: `#categoryBreakdown` (empty container, filled by Task 3) and
  `#addEventBtn` (static button, no handler — stays inert for the rest of
  this plan) both land in the DOM now. `#statClockValue` is the id later
  tasks must NOT reuse for anything else.

- [ ] **Step 1: Restructure row 2 in `index.html`**

Find:
```html
                <div class="db-grid db-grid-4" id="statTiles" style="margin-bottom:22px;"></div>

                <div class="db-grid db-grid-3" style="margin-bottom:22px;">
                    <div class="db-card db-clock-card">
                        <div class="db-clock-time" id="clockTime">--:--:--</div>
                        <div class="db-clock-date" id="clockDate">Loading…</div>
                    </div>
                    <div class="db-card">
                        <div class="db-card-title" style="display:flex;justify-content:space-between;align-items:center;">
                            <span id="calendarMonthLabel">Calendar</span>
                            <span class="db-calendar-nav">
                                <button type="button" class="db-icon-btn" id="calPrev" aria-label="Previous month"><i class="fa fa-chevron-left"></i></button>
                                <button type="button" class="db-icon-btn" id="calNext" aria-label="Next month"><i class="fa fa-chevron-right"></i></button>
                            </span>
                        </div>
                        <div class="db-calendar" id="calendarWidget"></div>
                    </div>
                    <div class="db-card">
                        <h3 class="db-card-title">Projects</h3>
                        <p class="db-card-subtitle">Published vs. Draft</p>
                        <div class="db-split-bar" id="splitBar"></div>
                        <div class="db-split-legend" id="splitLegend"></div>
                    </div>
                </div>
```

Replace with:
```html
                <div class="db-grid db-grid-4" id="statTiles" style="margin-bottom:22px;"></div>

                <div class="db-grid db-grid-2" style="margin-bottom:22px;">
                    <div class="db-card">
                        <h3 class="db-card-title">Projects Overview</h3>
                        <p class="db-card-subtitle">Published vs. Draft, and by category</p>
                        <div class="db-split-bar" id="splitBar"></div>
                        <div class="db-split-legend" id="splitLegend"></div>
                        <div class="db-category-breakdown" id="categoryBreakdown"></div>
                    </div>
                    <div class="db-card">
                        <div class="db-card-title" style="display:flex;justify-content:space-between;align-items:center;">
                            <span id="calendarMonthLabel">Calendar</span>
                            <span class="db-calendar-nav">
                                <button type="button" class="db-icon-btn" id="calPrev" aria-label="Previous month"><i class="fa fa-chevron-left"></i></button>
                                <button type="button" class="db-icon-btn" id="calNext" aria-label="Next month"><i class="fa fa-chevron-right"></i></button>
                            </span>
                        </div>
                        <div class="db-calendar" id="calendarWidget"></div>
                        <button type="button" class="db-pill-btn outline" id="addEventBtn" style="width:100%;margin-top:14px;"><i class="fa fa-plus"></i> Add Event</button>
                    </div>
                </div>
```

- [ ] **Step 2: Replace the "Last Updated" stat tile with a live clock, remove the old standalone clock**

In `dashboard/assets/js/pages/dashboard-home.js`, find:
```js
    // ---- Stat tiles ----
    var unreadCount = messages.filter(function (m) { return !m.read; }).length;
    var stats = [
        { icon: 'fa-folder-open-o', value: projects.length, label: 'Projects' },
        { icon: 'fa-bar-chart', value: skillCount, label: 'Tracked Skills' },
        { icon: 'fa-envelope-o', value: unreadCount, label: 'Unread Messages' },
        { icon: 'fa-clock-o', value: 'Today', label: 'Last Updated' }
    ];
    document.getElementById('statTiles').innerHTML = stats.map(function (s) {
        return '<div class="db-stat-tile"><span class="icon"><i class="fa ' + s.icon + '"></i></span><div><div class="value">' + s.value + '</div><div class="label">' + s.label + '</div></div></div>';
    }).join('');

    // ---- Clock ----
    function tickClock() {
        var now = new Date();
        document.getElementById('clockTime').textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        document.getElementById('clockDate').textContent = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
    tickClock();
    setInterval(tickClock, 1000);
```

Replace with:
```js
    // ---- Stat tiles ----
    var unreadCount = messages.filter(function (m) { return !m.read; }).length;
    var stats = [
        { icon: 'fa-folder-open-o', value: projects.length, label: 'Projects' },
        { icon: 'fa-bar-chart', value: skillCount, label: 'Tracked Skills' },
        { icon: 'fa-envelope-o', value: unreadCount, label: 'Unread Messages' }
    ];
    document.getElementById('statTiles').innerHTML = stats.map(function (s) {
        return '<div class="db-stat-tile"><span class="icon"><i class="fa ' + s.icon + '"></i></span><div><div class="value">' + s.value + '</div><div class="label">' + s.label + '</div></div></div>';
    }).join('') +
        '<div class="db-stat-tile"><span class="icon"><i class="fa fa-clock-o"></i></span><div><div class="value" id="statClockValue" style="font-variant-numeric:tabular-nums;">--:--:--</div><div class="label">Live Clock</div></div></div>';

    // ---- Live clock (4th stat tile) ----
    function tickStatClock() {
        var now = new Date();
        document.getElementById('statClockValue').textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    tickStatClock();
    setInterval(tickStatClock, 1000);
```

- [ ] **Step 3: Remove the now-unused clock-card CSS**

In `dashboard/assets/css/modules/dashboard.css`, find:
```css
/* Clock */
.db-clock-card { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.db-clock-time { font-size: 34px; font-weight: 500; color: var(--db-ink); letter-spacing: 1px; font-variant-numeric: tabular-nums; }
.db-clock-date { font-size: 12.5px; color: var(--db-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 6px; }

/* Calendar */
```

Replace with:
```css
/* Calendar */
```

(Just the 4-line `.db-clock-*` block and its `/* Clock */` header are
removed; the `/* Calendar */` header that follows stays as the section
divider for the rules right after it.)

- [ ] **Step 4: Manual verification**

Serve `dashboard/` and open `index.html`, logged in. Confirm:
- The stat row shows 4 tiles: Projects, Tracked Skills, Unread Messages,
  and a 4th tile labeled "Live Clock" whose value ticks every second
  (`HH:MM:SS`, no digit jitter as seconds change).
- Row 2 now shows exactly 2 cards side by side (not 3): "Projects
  Overview" (title changed from "Projects", split bar + legend visible,
  empty space below where the category breakdown will go) and "Calendar"
  (unchanged month grid, plus a new "Add Event" button below the grid —
  clicking it does nothing yet, that's expected).
- No standalone big clock card anywhere on the page.
- Open the browser console — no errors (confirms no leftover reference to
  `#clockTime`/`#clockDate`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "dashboard home: 2-column row 2, live-clock stat tile"
```

---

## Task 2: Today's Event Alert banner

**Files:**
- Modify: `dashboard/index.html`
- Modify: `dashboard/assets/js/pages/dashboard-home.js`
- Modify: `dashboard/assets/css/modules/dashboard.css`

**Interfaces:**
- Consumes: nothing
- Produces: `fmtDate(d)`, `todayDate`, and `sampleEvents` (array of
  `{date: "YYYY-MM-DD", title, time}`) are declared at the top of the
  `dashboard-home.js` IIFE — Task 4 (Calendar event dots) reads
  `sampleEvents` and calls `fmtDate` later in the same file, so both must
  land textually *before* the `// ---- Calendar ----` section this task
  doesn't touch but Task 4 does.

- [ ] **Step 1: Add the alert container to `index.html`**

Find:
```html
                <div class="db-page-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Overview of your portfolio content</p>
                    </div>
                </div>

                <div class="db-grid db-grid-4" id="statTiles" style="margin-bottom:22px;"></div>
```

Replace with:
```html
                <div class="db-page-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Overview of your portfolio content</p>
                    </div>
                </div>

                <div id="eventAlert"></div>

                <div class="db-grid db-grid-4" id="statTiles" style="margin-bottom:22px;"></div>
```

- [ ] **Step 2: Add the sample-events data and alert render to `dashboard-home.js`**

Find the very top of the file:
```js
(function () {
    Shell.init({ active: 'dashboard' });

    var projects = Store.get('projects') || [];
    var skills = Store.get('skills') || [];
    var skillCount = skills.reduce(function (sum, cat) { return sum + cat.items.length; }, 0);
    var contact = Store.get('contact') || {};
    var messages = Store.get('messages') || [];

    // ---- Stat tiles ----
```

Replace with:
```js
(function () {
    Shell.init({ active: 'dashboard' });

    var projects = Store.get('projects') || [];
    var skills = Store.get('skills') || [];
    var skillCount = skills.reduce(function (sum, cat) { return sum + cat.items.length; }, 0);
    var contact = Store.get('contact') || {};
    var messages = Store.get('messages') || [];

    // ---- Today's Event Alert (static sample data, not Store-backed) ----
    function fmtDate(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    var todayDate = new Date();
    var sampleEvents = [
        { date: fmtDate(todayDate), title: 'Team Meeting', time: '3:00 PM' },
        { date: fmtDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), 24)), title: 'Client Call', time: '11:00 AM' }
    ];
    var todaysEvent = sampleEvents.find(function (e) { return e.date === fmtDate(todayDate); });
    if (todaysEvent) {
        document.getElementById('eventAlert').innerHTML =
            '<div class="db-event-alert">' +
                '<span class="icon"><i class="fa fa-bell"></i></span>' +
                '<div>' +
                    '<div class="label">Today\'s Event</div>' +
                    '<div class="message">You have an event today: <strong>' + todaysEvent.title + '</strong> at ' + todaysEvent.time + '.</div>' +
                '</div>' +
            '</div>';
    }

    // ---- Stat tiles ----
```

- [ ] **Step 3: Add the alert's CSS**

Append to the end of `dashboard/assets/css/modules/dashboard.css`:
```css

/* Today's Event Alert */
.db-event-alert {
    display: flex; align-items: center; gap: 14px;
    background: rgba(91,108,255,0.08); border: 1px solid rgba(91,108,255,0.25);
    border-left: 3px solid var(--db-accent); border-radius: 10px;
    padding: 16px 20px; margin-bottom: 22px;
}
.db-event-alert .icon {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: var(--db-accent); color: #fff;
    display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.db-event-alert .label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 1px; color: var(--db-accent); margin-bottom: 3px; }
.db-event-alert .message { font-size: 13.5px; color: var(--db-body); }
.db-event-alert .message strong { color: var(--db-ink); font-weight: 500; }
```

- [ ] **Step 4: Manual verification**

Open `index.html`. Confirm an alert card appears above the stat tiles
row, with a bell icon in an accent circle and the text "You have an
event today: **Team Meeting** at 3:00 PM." Confirm its bottom margin
matches the stat row's spacing (visually consistent gap before the stat
tiles). Confirm in the code that if `sampleEvents` had no entry matching
today's date, `#eventAlert` would stay empty (`todaysEvent` would be
`undefined`, the `if` block skipped) — this is a static/no-op path you
can verify by reading the code rather than by changing the system clock.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "dashboard home: add today's event alert banner"
```

---

## Task 3: Projects-by-category breakdown

**Files:**
- Modify: `dashboard/assets/js/pages/dashboard-home.js`
- Modify: `dashboard/assets/css/modules/dashboard.css`

**Interfaces:**
- Consumes: `#categoryBreakdown` container from Task 1; `projects` array
  already declared at the top of the file
- Produces: nothing later tasks depend on

- [ ] **Step 1: Add the category-breakdown render**

In `dashboard/assets/js/pages/dashboard-home.js`, find:
```js
    // ---- Projects published/draft split ----
    var published = projects.filter(function (p) { return p.status === 'Published'; }).length;
    var draft = projects.length - published;
    var total = projects.length || 1;
    document.getElementById('splitBar').innerHTML =
        '<span class="published" style="width:' + (published / total * 100) + '%"></span>' +
        '<span class="draft" style="width:' + (draft / total * 100) + '%"></span>';
    document.getElementById('splitLegend').innerHTML =
        '<span><span class="dot published"></span> Published (' + published + ')</span>' +
        '<span><span class="dot draft"></span> Draft (' + draft + ')</span>';

    // ---- To-Do list ----
```

Replace with:
```js
    // ---- Projects published/draft split ----
    var published = projects.filter(function (p) { return p.status === 'Published'; }).length;
    var draft = projects.length - published;
    var total = projects.length || 1;
    document.getElementById('splitBar').innerHTML =
        '<span class="published" style="width:' + (published / total * 100) + '%"></span>' +
        '<span class="draft" style="width:' + (draft / total * 100) + '%"></span>';
    document.getElementById('splitLegend').innerHTML =
        '<span><span class="dot published"></span> Published (' + published + ')</span>' +
        '<span><span class="dot draft"></span> Draft (' + draft + ')</span>';

    // ---- Projects by category ----
    var categoryCounts = {};
    projects.forEach(function (p) {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    var categories = Object.keys(categoryCounts);
    var maxCategoryCount = Math.max.apply(null, categories.map(function (c) { return categoryCounts[c]; }).concat([1]));
    document.getElementById('categoryBreakdown').innerHTML = categories.map(function (c) {
        var pct = categoryCounts[c] / maxCategoryCount * 100;
        return '<div class="db-category-row">' +
            '<div class="db-category-label"><span>' + c + '</span><span class="count">' + categoryCounts[c] + '</span></div>' +
            '<div class="db-category-track"><span class="db-category-fill" style="width:' + pct + '%"></span></div>' +
        '</div>';
    }).join('');

    // ---- To-Do list ----
```

- [ ] **Step 2: Add the category-breakdown CSS**

Append to the end of `dashboard/assets/css/modules/dashboard.css`:
```css

/* Projects by category */
.db-category-breakdown { margin-top: 18px; }
.db-category-row { margin-bottom: 12px; }
.db-category-row:last-child { margin-bottom: 0; }
.db-category-label { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--db-body); margin-bottom: 5px; }
.db-category-label .count { color: var(--db-muted); }
.db-category-track { height: 10px; border-radius: 6px; background: var(--db-surface-alt); overflow: hidden; }
.db-category-fill { display: block; height: 100%; background: var(--db-accent); border-radius: 0 4px 4px 0; }
```

- [ ] **Step 3: Manual verification**

Open `index.html`. In the "Projects Overview" card, below the
Published/Draft legend, confirm a "By Category" set of rows appears —
one row per category present in the seeded projects (Web Development,
WordPress, Web Design — each with 1 project by default, so each bar
should render at full width since they're all tied for the max count).
Each row shows the category name and count on the label line, with a
thin accent-colored bar (rounded on the right end) below it. Go to
`pages/projects.html`, add a second project in the same category as an
existing one, return to the Dashboard, and confirm that category's bar
is now visibly longer than the others (proportional to its now-higher
count) and the other bars shrink relative to the new max.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "dashboard home: add projects-by-category breakdown"
```

---

## Task 4: Calendar event dots + hover tooltip

**Files:**
- Modify: `dashboard/assets/js/pages/dashboard-home.js`
- Modify: `dashboard/assets/css/modules/dashboard.css`

**Interfaces:**
- Consumes: `fmtDate` and `sampleEvents` from Task 2 (both declared
  earlier in the same file/IIFE scope, before `renderCalendar` runs)
- Produces: nothing later tasks depend on

- [ ] **Step 1: Extend `renderCalendar()` with event awareness**

In `dashboard/assets/js/pages/dashboard-home.js`, find:
```js
    function renderCalendar() {
        document.getElementById('calendarMonthLabel').textContent = MONTHS[calView.month] + ' ' + calView.year;
        var firstDay = new Date(calView.year, calView.month, 1).getDay();
        var daysInMonth = new Date(calView.year, calView.month + 1, 0).getDate();
        var isCurrentMonth = calView.year === today.getFullYear() && calView.month === today.getMonth();

        var cells = DOW.map(function (d) { return '<div class="dow">' + d + '</div>'; });
        for (var e = 0; e < firstDay; e++) cells.push('<div class="day empty"></div>');
        for (var day = 1; day <= daysInMonth; day++) {
            var isToday = isCurrentMonth && day === today.getDate();
            cells.push('<div class="day' + (isToday ? ' today' : '') + '">' + day + '</div>');
        }
        document.getElementById('calendarWidget').innerHTML = '<div class="db-calendar-grid">' + cells.join('') + '</div>';
    }
```

Replace with:
```js
    function renderCalendar() {
        document.getElementById('calendarMonthLabel').textContent = MONTHS[calView.month] + ' ' + calView.year;
        var firstDay = new Date(calView.year, calView.month, 1).getDay();
        var daysInMonth = new Date(calView.year, calView.month + 1, 0).getDate();
        var isCurrentMonth = calView.year === today.getFullYear() && calView.month === today.getMonth();

        var cells = DOW.map(function (d) { return '<div class="dow">' + d + '</div>'; });
        for (var e = 0; e < firstDay; e++) cells.push('<div class="day empty"></div>');
        for (var day = 1; day <= daysInMonth; day++) {
            var isToday = isCurrentMonth && day === today.getDate();
            var cellDateStr = fmtDate(new Date(calView.year, calView.month, day));
            var dayEvent = sampleEvents.find(function (ev) { return ev.date === cellDateStr; });
            cells.push(
                '<div class="day' + (isToday ? ' today' : '') + (dayEvent ? ' has-event' : '') + '">' +
                    day +
                    (dayEvent ? '<span class="event-dot"></span><span class="event-tooltip">' + dayEvent.title + ' — ' + dayEvent.time + '</span>' : '') +
                '</div>'
            );
        }
        document.getElementById('calendarWidget').innerHTML = '<div class="db-calendar-grid">' + cells.join('') + '</div>';
    }
```

- [ ] **Step 2: Add the event-dot/tooltip CSS**

Append to the end of `dashboard/assets/css/modules/dashboard.css`:
```css

/* Calendar event indicators */
.db-calendar-grid .day { position: relative; }
.db-calendar-grid .day.has-event { font-weight: 500; }
.db-calendar-grid .day .event-dot { position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--db-accent); }
.db-calendar-grid .day.today .event-dot { background: #fff; }
.db-calendar-grid .day .event-tooltip {
    display: none; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
    margin-bottom: 8px; background: var(--db-chrome-bg); color: var(--db-chrome-ink);
    padding: 7px 12px; border-radius: 8px; font-size: 11.5px; white-space: nowrap;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 20; pointer-events: none;
}
.db-calendar-grid .day.has-event:hover .event-tooltip { display: block; }
```

- [ ] **Step 3: Manual verification**

Open `index.html`. In the Calendar card, confirm today's date cell shows
a small dot (white, since it sits on the accent-colored "today"
background) below the day number, in addition to the existing "today"
highlight. Hover over it — a dark tooltip bubble appears above the cell
reading "Team Meeting — 3:00 PM". Confirm the 24th of the current month
(if it isn't today) also shows a dot (accent-colored, on the plain
background), and hovering it shows "Client Call — 11:00 AM". Click the
"Next month" arrow — confirm neither dot appears on the new month (the
sample dates are fixed, not recurring), then click "Previous month"
twice to return past the original month and confirm no dots there
either. Click back to the original month and confirm both dots return.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "dashboard home: calendar event dots and hover tooltip"
```
