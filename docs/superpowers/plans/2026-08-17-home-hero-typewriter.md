# Home Hero Typewriter Greeting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the duplicate hero photo, split the run-on hero heading into a short animated greeting plus a separate description paragraph, and add a one-time vanilla-JS typewriter effect with a blinking cursor.

**Architecture:** Static HTML/CSS/jQuery site, no build tools, no test framework. Changes are confined to `Main/pretty/index.html` (markup), `Main/pretty/assets/css/style.css` (cursor blink animation), and `Main/pretty/assets/js/scripts.js` (typewriter routine added to the existing `jQuery(document).ready` block). Verification is manual (open the page in a browser) since there is no automated test runner in this project.

**Tech Stack:** Plain HTML5, CSS3, jQuery (already loaded by the page), vanilla JS. No new dependencies.

## Global Constraints

- No external libraries/CDNs — implementation must be hand-written vanilla JS, consistent with the existing jQuery-based `scripts.js`.
- Only `Main/pretty/index.html`, `Main/pretty/assets/css/style.css`, and `Main/pretty/assets/js/scripts.js` are touched. No other page or the sidebar is modified.
- Typewriter types once and stays (no loop/delete). Cursor keeps blinking indefinitely after typing finishes.
- Greeting text: `Hi, I am Juliana Doe`. Description text (verbatim): "A WordPress designer and developer based in Australia. I build powerful products for people and businesses, creating first-rate experiences and solutions for creatives."
- Buttons ("See More" / "View My Resume") and the "Top projects" section must remain unchanged in content and order.

---

### Task 1: Update hero markup — remove photo, split heading, update description

**Files:**
- Modify: `Main/pretty/index.html:159-175`

**Interfaces:**
- Produces: `#typed-name` (empty `<span>`, target for Task 3's JS to fill with `Juliana Doe`) and `.typed-cursor` (`<span>` element, styled by Task 2's CSS).

- [ ] **Step 1: Edit the hero block**

Replace lines 159–162 (the `.header-text` block) — currently:

```html
                        <div class="header-text">
                            <img src="assets/images/me.jpg" alt="">
                            <h2>Hi, I am Juliana Doe — A WordPress designer and developer Based in Australia.I Builds powerful products for people and businesses. I create first-rate experiences and solutions for creatives.</h2>
                        </div>
```

with:

```html
                        <div class="header-text">
                            <h2 class="typed-heading">Hi, I am <span id="typed-name"></span><span class="typed-cursor">|</span></h2>
                        </div>
```

- [ ] **Step 2: Update the description paragraph**

Replace line 175 (inside `.about-block.about-reveal`) — currently:

```html
                    <p class="home-intro-text">I design and build clean, dependable WordPress sites for small teams and creative brands — from first sketch to launch, and everything that keeps it running well afterwards.</p>
```

with:

```html
                    <p class="home-intro-text">A WordPress designer and developer based in Australia. I build powerful products for people and businesses, creating first-rate experiences and solutions for creatives.</p>
```

- [ ] **Step 3: Manually verify markup**

Open `Main/pretty/index.html` directly in a browser (double-click or `file://` path). Confirm:
- No duplicate photo appears above "Hi, I am" (the `#typed-name` span will render empty until Task 3 adds JS — that's expected at this point).
- The new description paragraph text appears below the heading.
- "See More" and "View My Resume" buttons still appear, followed by the "Top projects" section, unchanged.

- [ ] **Step 4: Commit**

```bash
git add "Main/pretty/index.html"
git commit -m "Remove duplicate hero photo and split heading into greeting + description"
```

---

### Task 2: Add blinking cursor CSS

**Files:**
- Modify: `Main/pretty/assets/css/style.css` (append after the `.header-text img` rule ending at line 202)

**Interfaces:**
- Consumes: `.typed-cursor` element produced by Task 1.
- Produces: `.typed-cursor` visual style (blinking `|` character) for Task 3's JS to leave visible after typing completes.

- [ ] **Step 1: Add the cursor blink CSS**

Insert immediately after the `.header-text img { ... }` rule (after line 202) in `Main/pretty/assets/css/style.css`:

```css
.typed-cursor {
    font-weight: 300;
    color: #333;
    animation: typed-cursor-blink 0.8s steps(1) infinite;
}

@keyframes typed-cursor-blink {
    0%, 50% {
        opacity: 1;
    }
    50.01%, 100% {
        opacity: 0;
    }
}
```

- [ ] **Step 2: Manually verify the cursor renders and blinks**

Reload `Main/pretty/index.html` in a browser. Confirm a `|` character appears right after "Hi, I am " and visibly blinks on/off roughly once per second. (The name text itself is still empty until Task 3.)

- [ ] **Step 3: Commit**

```bash
git add "Main/pretty/assets/css/style.css"
git commit -m "Add blinking cursor animation for hero typewriter greeting"
```

---

### Task 3: Add vanilla-JS one-time typewriter effect

**Files:**
- Modify: `Main/pretty/assets/js/scripts.js` (add a new block inside the existing `jQuery(document).ready(function () { ... })`, e.g. after the PRELOADER JS block ending at line 29)

**Interfaces:**
- Consumes: `#typed-name` span and `.typed-cursor` span produced by Task 1; `.typed-cursor`'s CSS animation produced by Task 2.
- Produces: none consumed by later tasks (this is the final task).

- [ ] **Step 1: Add the typewriter routine**

Insert this block into `Main/pretty/assets/js/scripts.js`, inside the existing `jQuery(document).ready(function () { ... })` function, after the PRELOADER JS block (after line 29):

```javascript

        /*
         * ----------------------------------------------------------------------------------------
         *  HERO TYPEWRITER GREETING JS
         * ----------------------------------------------------------------------------------------
         */

        var typedNameTarget = document.getElementById('typed-name');
        if (typedNameTarget) {
            var typedNameText = 'Juliana Doe';
            var typedNameIndex = 0;
            var typedNameSpeedMs = 55;

            var typeNextChar = function () {
                if (typedNameIndex < typedNameText.length) {
                    typedNameTarget.textContent += typedNameText.charAt(typedNameIndex);
                    typedNameIndex++;
                    setTimeout(typeNextChar, typedNameSpeedMs);
                }
            };

            setTimeout(typeNextChar, 300);
        }
```

- [ ] **Step 2: Manually verify the full effect**

Reload `Main/pretty/index.html` in a browser (hard refresh to bypass cache: Ctrl+Shift+R). Confirm:
- On load, after a brief pause, "Juliana Doe" types out character-by-character next to "Hi, I am ".
- Once typing finishes, the `|` cursor keeps blinking indefinitely; the name does not delete or retype.
- No console errors appear in the browser dev tools.

- [ ] **Step 3: Commit**

```bash
git add "Main/pretty/assets/js/scripts.js"
git commit -m "Add one-time typewriter animation for hero greeting"
```
