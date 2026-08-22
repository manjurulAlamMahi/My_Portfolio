# Dashboard Home Redesign — Design

Date: 2026-08-22
Scope: `dashboard/index.html`, `dashboard/assets/js/pages/dashboard-home.js`,
`dashboard/assets/css/modules/dashboard.css` only. No other dashboard page or
live-site file changes. Sections not mentioned here (To-Do List, Quick Note,
Reminders, Recent Activity, Messages, Quick Jump — rows 3 and 4 of the
current page) are unchanged.

## Decisions from clarification

- The 2nd stat tile stays exactly as-is: "Tracked Skills" (count of skills
  across all resume categories), unchanged label and logic.
- The Event Alert and Calendar "Add Event" feature are a **static mockup for
  now**: driven by a small hardcoded sample-events array local to
  `dashboard-home.js`, not a new `Store` collection. No save/persist logic.
  The "Add Event" button is present and styled but has no click handler in
  this pass.

## A. Event Alert (new, above the stat row)

A single alert card, rendered only when a sample event's date matches
today. Sample data (computed once, not persisted):

```js
function fmtDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
var todayDate = new Date();
var sampleEvents = [
    { date: fmtDate(todayDate), title: 'Team Meeting', time: '3:00 PM' },
    { date: fmtDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), 24)), title: 'Client Call', time: '11:00 AM' }
];
```

Render logic: find `sampleEvents.find(e => e.date === fmtDate(todayDate))`.
If found, render the alert card into a new `<div id="eventAlert"></div>`
placed above `#statTiles` in `index.html`; if not found, leave it empty (no
markup, no reserved space).

Markup (once a matching event is found):
```html
<div class="db-event-alert">
    <span class="icon"><i class="fa fa-bell"></i></span>
    <div>
        <div class="label">Today's Event</div>
        <div class="message">You have an event today: <strong>{title}</strong> at {time}.</div>
    </div>
</div>
```

Style: rounded card, accent-tinted background wash (`rgba(91,108,255,0.08)`,
matching the existing `.db-settings-note` convention), a left accent border
stripe, an accent-colored circular icon badge (`fa-bell`), bold event line.
Sits with the same bottom margin as the stat tiles row (22px) so spacing
stays consistent whether or not the alert is present.

## B. Stat Row — tile 4 replaced with a live clock

`dashboard-home.js`'s `stats` array changes from:
```js
{ icon: 'fa-clock-o', value: 'Today', label: 'Last Updated' }
```
to a 4th tile driven by its own ticking element rather than the static
`stats.map(...)` render, since its value must update every second. The
stat-tile markup gets an `id` only on this 4th tile's value span:
```html
<div class="db-stat-tile"><span class="icon"><i class="fa fa-clock-o"></i></span><div><div class="value" id="statClockValue" style="font-variant-numeric:tabular-nums;">--:--:--</div><div class="label">Live Clock</div></div></div>
```
A `tickStatClock()` function (replacing the old standalone `tickClock()`)
sets `#statClockValue`'s `textContent` to
`now.toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit',
second:'2-digit'})` every second via `setInterval`. `tabular-nums` is
applied here specifically (not to the other stat tiles) because a ticking
value needs fixed-width digits so it doesn't jitter as digits change —
this is a deliberate, narrow exception to the stat-tile convention
elsewhere in the app.

The standalone `.db-clock-card` (previously the first card in row 2) is
removed entirely — its role is now filled by this stat tile.

## C. Row 2 — two equal columns (`db-grid-2` instead of `db-grid-3`)

### Left: Projects Overview
Keeps the existing card title/subtitle, split bar (`#splitBar`), and legend
(`#splitLegend`) untouched — same markup, same `dashboard-home.js` logic.
Below it, a new "By Category" section:

```html
<div class="db-category-breakdown" id="categoryBreakdown"></div>
```

Rendered from `projects` grouped by `category`:
```js
var categoryCounts = {};
projects.forEach(function (p) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
});
var categories = Object.keys(categoryCounts);
var maxCount = Math.max.apply(null, categories.map(function (c) { return categoryCounts[c]; }).concat([1]));
document.getElementById('categoryBreakdown').innerHTML = categories.map(function (c) {
    var pct = (categoryCounts[c] / maxCount * 100);
    return '<div class="db-category-row">' +
        '<div class="db-category-label"><span>' + c + '</span><span class="count">' + categoryCounts[c] + '</span></div>' +
        '<div class="db-category-track"><span class="db-category-fill" style="width:' + pct + '%"></span></div>' +
    '</div>';
}).join('');
```

This is a **magnitude comparison** (per the dataviz skill's form guidance:
"Compare magnitude, low → high" → bar, sequential/single-hue), not an
identity chart — every bar is already directly labeled with its category
name, so a multi-color categorical palette isn't needed or appropriate.
Every bar uses the same accent hue (`var(--db-accent)`), matching the
dashboard's existing single-accent visual language (same choice already
made for the Published/Draft split bar). Mark spec, per the skill: track
height 10px (matching the existing split-bar), 4px rounded end on the fill,
square at the baseline (left edge), count value direct-labeled at the row
level (not clipped inside the bar). No legend — a single-hue series with
direct labels doesn't need one.

```css
.db-category-breakdown { margin-top: 18px; }
.db-category-row { margin-bottom: 12px; }
.db-category-row:last-child { margin-bottom: 0; }
.db-category-label { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--db-body); margin-bottom: 5px; }
.db-category-label .count { color: var(--db-muted); }
.db-category-track { height: 10px; border-radius: 6px; background: var(--db-surface-alt); overflow: hidden; }
.db-category-fill { display: block; height: 100%; background: var(--db-accent); border-radius: 0 4px 4px 0; }
```

### Right: Calendar
Unchanged header, month nav (`#calPrev`/`#calNext`), and grid structure.
`renderCalendar()` gains event-awareness: each day cell whose date matches
a `sampleEvents` entry (for the month currently being rendered) gets a
`has-event` class and a hidden tooltip child:

```js
cells.push(
    '<div class="day' + (isToday ? ' today' : '') + (dayEvent ? ' has-event' : '') + '">' +
        day +
        (dayEvent ? '<span class="event-dot"></span><span class="event-tooltip">' + dayEvent.title + ' — ' + dayEvent.time + '</span>' : '') +
    '</div>'
);
```
where `dayEvent = sampleEvents.find(function (e) { return e.date === cellDateStr; })` for that cell's computed `YYYY-MM-DD`.

```css
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
(Same absolute-tooltip-on-hover technique already used for the sidebar's
collapsed-state nav labels in `layout.css`.)

Below the calendar grid, an "Add Event" button:
```html
<button type="button" class="db-pill-btn outline" id="addEventBtn" style="width:100%;margin-top:14px;"><i class="fa fa-plus"></i> Add Event</button>
```
No click handler is attached in this pass — the button is a layout
placeholder per the static-mockup decision.

## File-level summary

**Modified:**
- `dashboard/index.html` — add `#eventAlert` container above stat tiles;
  change row 2 from `db-grid-3` (3 cards) to `db-grid-2` (2 cards: Projects
  Overview with new category-breakdown container, Calendar with new Add
  Event button); remove the standalone clock card markup.
- `dashboard/assets/js/pages/dashboard-home.js` — add sample-events data +
  alert render; change stats array/render for the clock tile + new
  `tickStatClock()` (replaces `tickClock()`); add category-breakdown
  render; extend `renderCalendar()` with event-dot/tooltip markup.
- `dashboard/assets/css/modules/dashboard.css` — add `.db-event-alert`,
  `.db-category-breakdown`/`.db-category-row`/`.db-category-label`/
  `.db-category-track`/`.db-category-fill`, calendar event-dot/tooltip
  rules; remove now-unused `.db-clock-card`/`.db-clock-time`/`.db-clock-date`
  rules (superseded by the stat-tile clock, which reuses existing
  `.db-stat-tile` styling).

**Unchanged:** everything in rows 3 and 4 (To-Do, Quick Note, Reminders,
Recent Activity, Messages, Quick Jump) — markup, JS, and CSS untouched.

## Out of scope

- No `Store`-backed events collection, no real Add Event save flow, no
  event editing/deletion — this is a layout/visual pass only, per the
  static-mockup decision.
- No changes to any other dashboard page.
