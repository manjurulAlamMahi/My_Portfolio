# Home Hero Section Redesign — Typewriter Greeting

## Context

`Main/pretty/index.html` is the live home page of a static HTML/CSS/jQuery
portfolio template (no build tools, no npm packages). The hero section
currently combines a duplicate profile photo, a long run-on heading, and a
separate description paragraph with "See More" / "View My Resume" buttons,
followed by the "Top projects" section.

## Goals

1. Remove the duplicate profile photo sitting above the hero heading (the
   sidebar avatar is unaffected and continues to identify the site owner).
2. Animate the greeting ("Hi, I am Juliana Doe") with a one-time
   character-by-character typewriter effect that leaves a blinking cursor
   in place once finished.
3. Split the current single run-on `<h2>` into: a short animated heading,
   and a separate description paragraph carrying the former heading's
   trailing sentence (cleaned up).
4. Leave the CTA buttons and "Top projects" section unchanged in content
   and order.

## Non-goals

- No changes to the sidebar, other pages (about/resume/projects/contact),
  or the "Top projects" section content.
- No external JS libraries/CDNs — implementation is hand-written vanilla
  JS consistent with the existing jQuery-based `scripts.js`.
- No looping/deleting typewriter behavior — types once, stays.

## Changes

### `Main/pretty/index.html` (hero block, ~lines 159–175)

- Remove `<img src="assets/images/me.jpg" alt="">` from `.header-text`.
- Replace the current `<h2>` with:
  ```html
  <h2 class="typed-heading">
      Hi, I am <span id="typed-name"></span><span class="typed-cursor">|</span>
  </h2>
  ```
- Replace `.home-intro-text` content with:
  > "A WordPress designer and developer based in Australia. I build
  > powerful products for people and businesses, creating first-rate
  > experiences and solutions for creatives."

### `Main/pretty/assets/css/style.css`

- Add `@keyframes blink` (opacity 0/1 toggle) and a `.typed-cursor` rule
  using it, so the cursor blinks continuously.
- No other layout changes needed — `.header-text` and `.header-text h2`
  remain centered as today; removing the `img` rule's consumer doesn't
  require touching the rule itself (it simply becomes unused for this
  page, left in place since it's still used elsewhere/harmless).

### `Main/pretty/assets/js/scripts.js`

- Inside the existing `jQuery(document).ready(...)` block, add a small
  typewriter routine that:
  - Reads the target name string ("Juliana Doe") from a JS constant.
  - On a short delay after load, types it character-by-character (~50–60ms
    per character) into `#typed-name`.
  - Leaves `.typed-cursor` blinking indefinitely after typing completes.

## Testing

Manual verification only (static site, no test framework):
- Open `index.html` in a browser, confirm the duplicate photo is gone,
  the greeting types out once and stops, the cursor keeps blinking, the
  new description paragraph renders correctly, and buttons + Top projects
  section are unchanged.
