# QA EXECUTION GUIDE — Implementation Phase

## Overview
This guide provides step-by-step instructions for executing the QA test matrix during the CSS redesign implementation. It includes procedures for capturing visual baselines, running functional tests, validating performance, and documenting results.

---

## PHASE 0: PRE-REDESIGN BASELINE (Before Any CSS Changes)

### Setup
1. **Environment:**
   - Use a clean browser profile (no extensions, no cached data)
   - Device: MacBook Pro 14" (1920x1080 equivalent) or monitor at 1920x1080
   - Network: Normal speed (≥2 Mbps)
   - Time: ~1 hour

2. **Tools Needed:**
   - Chrome DevTools (F12)
   - Firefox DevTools (F12)
   - Screenshot tool (Cmd+Shift+4 on Mac, Win+Shift+S on Windows)
   - Lighthouse (built-in Chrome DevTools)
   - Axe DevTools extension (https://www.deque.com/axe/devtools/)
   - WAVE extension (optional, https://wave.webaim.org/extension/)

3. **Test Locations:**
   - Local: `file:///path/to/1tzArad.github.io/index.html`
   - Or GitHub Pages: `https://1tzArad.github.io`
   - Set localhost or direct file URL (not live site if redesigning locally)

---

### 1.1 Capture Visual Baselines

**Viewport 1: Desktop (1920x1080)**
```
1. Open site in Chrome
2. Press F12 → DevTools
3. Press Cmd+Shift+C (or Tools > More Tools > Take screenshot)
4. Capture full page screenshot → save as `baseline_1920x1080_full.png`
5. Screenshot visible viewport → save as `baseline_1920x1080_viewport.png`
```

**Checkpoint Screenshots:**
- [ ] Desktop with all icons visible
- [ ] Terminal window open (if launched)
- [ ] Files window open
- [ ] Settings window (showing color swatches)
- [ ] Taskbar at bottom
- [ ] Particle background visible (or grid overlay)

---

**Viewport 2: Tablet (768x1024)**
```
1. DevTools → Toggle device toolbar (Cmd+Shift+M)
2. Select "iPad" or custom 768x1024
3. Reload page
4. Take full-page screenshot → save as `baseline_768x1024_full.png`
5. Double-click Terminal desktop icon
6. Take screenshot with window open → `baseline_768x1024_terminal.png`
```

**Checkpoint Screenshots:**
- [ ] Desktop layout adjusted for tablet
- [ ] Icons scaled appropriately
- [ ] Terminal window sized for tablet
- [ ] File manager sidebar visible (not collapsed)
- [ ] Touch targets appear adequate (≥44px)

---

**Viewport 3: Mobile (375x667)**
```
1. DevTools → Toggle device toolbar (Cmd+Shift+M)
2. Select "iPhone SE" or custom 375x667
3. Reload page
4. Take full-page screenshot → save as `baseline_375x667_full.png`
5. Launch Terminal, Files, Settings
6. Take screenshots of each → `baseline_375x667_*.png`
```

**Checkpoint Screenshots:**
- [ ] No horizontal overflow
- [ ] Text readable (not tiny)
- [ ] Icons stack vertically
- [ ] Taskbar accessible
- [ ] Windows sized appropriately

---

### 1.2 Run Lighthouse Audit

**Chrome DevTools Lighthouse:**
```
1. Open DevTools (F12) on 1920x1080 viewport
2. Click "Lighthouse" tab
3. Select: Mode = "Navigation", Categories = all
4. Click "Analyze page load"
5. Wait ~30-60 seconds
6. Export report → save as `baseline_lighthouse_1920x1080.html`
7. Record scores:
   - Performance: _____
   - Accessibility: _____
   - Best Practices: _____
   - SEO: _____
8. Note: Cumulative Layout Shift (CLS), First Contentful Paint (FCP), Largest Contentful Paint (LCP), First Input Delay (FID)
```

**Record in spreadsheet:**
| Metric | Score | Target |
|--------|-------|--------|
| Performance | ___ | ≥90 |
| Accessibility | ___ | ≥90 |
| Best Practices | ___ | ≥90 |
| SEO | ___ | ≥90 |
| FCP | ___ ms | <1.8s |
| LCP | ___ ms | <2.5s |
| CLS | ___ | <0.1 |

---

### 1.3 Performance Metrics (Manual)

**Open DevTools → Performance Tab:**
```
1. Click "Record" button (red circle)
2. Reload page (Cmd+R)
3. Wait for page to fully load (~5 seconds)
4. Click "Stop"
5. Review timeline:
   - Mark: DOMContentLoaded time
   - Mark: Load event time
   - Check for long tasks (>50ms)
   - Check for jank (frame drops)
```

**Record:**
- DOMContentLoaded: ___ ms
- Load event: ___ ms
- Long tasks: ___
- Frame rate: ___ fps (should be 60)

---

### 1.4 Console Errors & Warnings

**Open DevTools → Console Tab:**
```
1. Clear console (trash icon)
2. Reload page
3. Wait 10 seconds
4. Count errors and warnings:
   - Errors: ___
   - Warnings: ___
5. Screenshot console → `baseline_console_errors.png`
6. If errors present, copy full error messages → `baseline_console_log.txt`
```

**Expected:**
- Errors: 0 (or list known errors)
- Warnings: 0-2 (minor warnings acceptable)

---

### 1.5 Accessibility Quick Check

**Axe DevTools Extension:**
```
1. Install Axe from Chrome Web Store
2. On site, right-click → Axe DevTools → Scan ALL of my page
3. Wait for scan (~10 seconds)
4. Review results:
   - Violations (errors): count & list
   - Passes (successes): count
5. Export report → save as `baseline_axe_report.json`
6. Screenshot violations → `baseline_axe_violations.png`
```

**Record:**
- Violations: ___
- Passes: ___
- Critical issues: ___

---

### 1.6 Keyboard Navigation Test

**Manual Test (5 minutes):**
```
1. Press Tab repeatedly
2. Count how many interactive elements are reached:
   - Launcher button ✓
   - Desktop icons ✓
   - Taskbar items ✓
   - Window controls ✓
   - etc.
3. Verify focus ring is visible (not invisible)
4. Try Shift+Tab (reverse navigation)
5. Try Enter on focusable element (does it activate?)
6. Try Escape (closes menus or unfocuses)
```

**Checklist:**
- [ ] Tab reaches all interactive elements
- [ ] Focus ring visible (≥2px contrast)
- [ ] Shift+Tab reverses
- [ ] Enter activates buttons/links
- [ ] Escape closes modals/menus

---

### 1.7 Color Contrast Check

**Using WAVE or Axe:**
- Text color vs background contrast ratio
- Minimum WCAG AA: 4.5:1 for normal text, 3:1 for large text
- Use: WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)

**Manual Check:**
```
1. DevTools → Computed styles on each text element
2. Get foreground color (color property)
3. Get background color (background or parent's background)
4. Enter both into WebAIM Contrast Checker
5. Verify ratio ≥4.5:1
```

**Elements to check:**
- [ ] Primary text (#e6edf3) on background (#0a0a0a) → ratio: ___
- [ ] Secondary text (#8b949e) on background → ratio: ___
- [ ] Accent text (current) on background → ratio: ___
- [ ] Terminal text on terminal background → ratio: ___
- [ ] Input text on input background → ratio: ___

---

### 1.8 Summary: Baseline Capture Template

**File: `baseline_metrics.txt`**
```
=== PRE-REDESIGN BASELINE ===
Date: [DATE]
Browser: Chrome [VERSION]
Device: [DEVICE NAME] ([RESOLUTION])
URL: [URL]
Tester: [NAME]

VISUAL BASELINES CAPTURED:
- [x] 1920x1080 desktop (full page)
- [x] 768x1024 tablet
- [x] 375x667 mobile
- [x] All major windows screenshot
- [x] All color states screenshot

LIGHTHOUSE AUDIT:
- Performance: [SCORE]
- Accessibility: [SCORE]
- Best Practices: [SCORE]
- SEO: [SCORE]
- FCP: [TIME]ms
- LCP: [TIME]ms
- CLS: [VALUE]

PERFORMANCE METRICS:
- DOMContentLoaded: [TIME]ms
- Load event: [TIME]ms
- Long tasks: [COUNT]
- Frame rate: [FPS]

CONSOLE:
- Errors: [COUNT]
- Warnings: [COUNT]
- Known issues: [LIST]

ACCESSIBILITY:
- Axe violations: [COUNT]
- Axe passes: [COUNT]
- Keyboard navigation: [PASS/FAIL]
- Color contrast: [PASS/FAIL]

NOTES:
[Any observations, environment quirks, etc.]
```

---

## PHASE 1: VISUAL REGRESSION TESTING (Post-CSS Redesign)

### 1.1 Viewport Comparison

**For each viewport (1920x1080, 768x1024, 375x667):**
```
1. Open BEFORE screenshot (baseline)
2. Open AFTER screenshot (redesigned)
3. Use image comparison tool (Pixelmatch, or manual side-by-side)
4. Check:
   - Colors match spec (cyan accent #06d6ff, black #0a0a0a, etc.)
   - Glass effects visible (blur, border, opacity)
   - Typography sizing (headings, body text)
   - Spacing aligned to 4px grid
   - Border radius (12px for cards, etc.)
   - Responsive breakpoints trigger at correct widths
```

**Comparison Tool (Free):**
- Online: https://www.diffchecker.com/image-diff/
- Or use DevTools: Inspector → right-click element → Inspect similar element in baseline

---

### 1.2 Color Verification

**For each color used, verify:**
```
1. Primary background: #0a0a0a (pure black)
   - Pick tool: right-click → Inspect → Computed → background-color
   - Should show rgb(10, 10, 10) or #0a0a0a
   
2. Secondary background: #0d1117 (dark gray)
   - Check taskbar, window surfaces
   
3. Accent: #06d6ff (cyan)
   - Check buttons, active states, accent text, borders
   
4. Text primary: #e6edf3 (bright)
   - Check all body text
   
5. Text secondary: #8b949e (muted)
   - Check metadata, captions
   
6. Glass backgrounds: rgba(255,255,255,0.06)
   - Check window backgrounds, card backgrounds
```

**Checklist:**
- [ ] All colors match spec (use color picker on each element)
- [ ] Accent (cyan) applied to all required elements
- [ ] No old colors remaining (e.g., purple #a855f7)
- [ ] Glass opacity correct (not too faint, not too opaque)

---

### 1.3 Glass Effects Verification

**For each glass surface (windows, cards, inputs, etc.):**
```
1. DevTools → Inspector → select element
2. Check Computed styles:
   - backdrop-filter: blur(Xpx) [should be 8px, 12px, or 16px]
   - background: rgba(255,255,255,0.06) [or similar opacity]
   - border: 1px solid rgba(255,255,255,0.12)
   - box-shadow: [should have inset highlight + outer shadow]
```

**Checklist:**
- [ ] Blur depth correct for element type
- [ ] Background opacity visible but subtle
- [ ] Border defined (not invisible)
- [ ] Shadow depth appropriate
- [ ] No jagged/pixelated edges (anti-aliasing working)

---

### 1.4 Typography Verification

**For each heading level (H1, H2, H3, H4) and body text:**
```
1. DevTools → Inspector → select element
2. Check Computed styles:
   - font-size: [should match spec: 48px, 32px, 24px, 18px, 15px, 13px, 12px]
   - font-weight: [700 for display, 600 for section, 400 for body]
   - line-height: [1.2-1.6 depending on type]
   - font-family: [system fonts, no external if possible]
   - letter-spacing: [+0.02em for display, 0 for body]
```

**Checklist:**
- [ ] Hierarchy visible (headings larger than body)
- [ ] Text readable (not too small, not squished)
- [ ] Line height comfortable (not cramped)
- [ ] System fonts loaded (no FOUT)

---

### 1.5 Spacing & Alignment Verification

**Sample elements to audit:**
```
1. Window padding: should be 12-16px (measured in DevTools)
2. Component gap: should be 8px or 12px
3. Heading margin: check top/bottom spacing
4. List item margin: check spacing
5. Button padding: check internal spacing

Use: Right-click element → Inspect → Box Model (shows padding, margin)
```

**Checklist:**
- [ ] Padding: 12-16px inside containers
- [ ] Gap: 8px or 12px between components
- [ ] Margins: consistent (no random offsets)
- [ ] Alignment: left-flush, centered, or justified (intentional)

---

### 1.6 Radius Verification

**Check border-radius values:**
```
1. Cards/containers: should be 12px (softer than old 8px)
2. Buttons: should be 4-6px (tight, professional)
3. Inputs: should be 6-8px
4. Full-circle: 50% or 9999px

DevTools → Inspect → Computed → border-radius
```

**Checklist:**
- [ ] Cards: 12px radius
- [ ] Buttons: 4-6px radius
- [ ] Inputs: 6-8px radius
- [ ] Full-circle: 50% (icons, avatars, etc.)

---

### 1.7 Interactive States Verification

**Test hover, focus, and active states:**

**Hover State:**
```
1. Hover over button
2. Check:
   - Scale: slightly larger (1.02x)
   - Shadow: deeper (box-shadow increased)
   - Border: brighter (opacity +0.03)
   - Transition: smooth (150ms-300ms)
```

**Focus State:**
```
1. Tab to button
2. Check:
   - Ring: 2px solid cyan, visible
   - Spacing: 4px offset from element
   - Transition: immediate (no delay)
```

**Active State:**
```
1. Click and hold button
2. Check:
   - Scale: smaller (0.98x)
   - Shadow: reduced
   - Transition: immediate feedback
```

**Checklist:**
- [ ] Hover: scale, shadow, border brightens
- [ ] Focus: visible ring (2px, cyan)
- [ ] Active: scale down, shadow reduces
- [ ] Transitions: 150ms-300ms smooth

---

## PHASE 2: FUNCTIONAL REGRESSION TESTING

### 2.1 Critical Path 1: Desktop → Terminal → Commands

**Procedure:**
```
1. Load page (baseline state)
2. Double-click Terminal icon (or launcher → Terminal)
3. Window opens with boot animation:
   - [ ] "A0/OS Terminal v2.0" types out
   - [ ] "Type 'help' for available commands" types out
   - [ ] Empty line + empty line
   - [ ] Prompt appears
   - [ ] Input is editable
4. Type: help
   - [ ] Enter pressed
   - [ ] Command echoed in output
   - [ ] Help text displays (7-8 command lines)
   - [ ] Prompt reappears
5. Type: skills
   - [ ] Output shows:
     - Languages: JavaScript (no longer...), TypeScript (no longer...), Go (currently learning)
     - Frontend: HTML, CSS, Tailwind CSS
     - Backend: Node.js, Express.js, Gin (learning)
     - Databases: PostgreSQL, MongoDB, SQL
     - Tools: Git, npm, Docker
   - [ ] Prompt reappears
6. Type: contact
   - [ ] Output shows contact links (email, GitHub, Telegram)
   - [ ] Links are clickable (color indicates link)
7. Type: clear
   - [ ] Output clears (empty terminal)
   - [ ] Prompt remains
8. Type: projects
   - [ ] Projects window opens
9. Type: theme cyan (if cyan added to settings)
   - [ ] Accent color changes globally
   - [ ] Message: "Theme changed to cyan"
10. Close Terminal window
```

**Checklist:**
- [ ] Boot animation works
- [ ] Input accepts text
- [ ] Commands execute (no "not found" errors)
- [ ] Output correct for each command
- [ ] Links clickable
- [ ] Links open in new tab
- [ ] History works (ArrowUp recalls "help", etc.)
- [ ] Tab completion works (type "hel" + TAB → "help")
- [ ] Clear works
- [ ] Window closes cleanly
- [ ] No console errors during interaction

---

### 2.2 Critical Path 2: Projects → GitHub API → Repos Load

**Procedure:**
```
1. Load page
2. Double-click Projects icon (or launcher → Projects)
3. Projects window opens with:
   - [ ] Spinner visible (rotating circle)
   - [ ] Loading state message
4. Wait 2-5 seconds
5. GitHub repos load:
   - [ ] Spinner disappears
   - [ ] Repo list appears (if user has repos)
   - [ ] Each repo shows:
     - [ ] Icon (📦)
     - [ ] Repo name (bold)
     - [ ] Description (gray)
     - [ ] Language dot + language name
     - [ ] Stars count (⭐ N)
     - [ ] Updated time (e.g., "2 days ago")
     - [ ] Fork badge (if fork)
     - [ ] Archived badge (if archived, amber color)
6. Click repo name (blue link)
   - [ ] Opens GitHub repo URL in browser (new tab)
7. Sort dropdown:
   - [ ] Default: "updated"
   - [ ] Click dropdown
   - [ ] Options: stars, updated, name (or similar)
   - [ ] Select "stars"
   - [ ] Repos re-sort (highest stars first)
8. Close Projects window
```

**Checklist:**
- [ ] Window opens
- [ ] Spinner shows
- [ ] Repos load from API
- [ ] Repo metadata displays correctly
- [ ] Language color dot visible
- [ ] Stars count accurate
- [ ] Updated time format readable
- [ ] Fork badge visible (if fork)
- [ ] Archived badge visible (if archived)
- [ ] Repo links clickable
- [ ] Sort dropdown works
- [ ] No "Forbidden" or rate-limit error
- [ ] No console errors

---

### 2.3 Critical Path 3: Settings → Accent → Global Update & Persist

**Procedure:**
```
1. Load page
2. Note current accent color (default: purple or new: cyan)
3. Double-click Settings icon
4. Settings window opens
5. Accent color swatches visible (4 circles: green, blue, purple, amber + cyan if added)
6. Click cyan swatch (or different from current)
   - [ ] Swatch gets white border (active indicator)
   - [ ] All UI updates:
     - [ ] Terminal accent text changes
     - [ ] Button accent changes
     - [ ] Accent dim background updates
     - [ ] Accent borders update
   - [ ] Transition is smooth (not jarring)
7. Close Settings
8. Open another window (Terminal, Files, Projects)
   - [ ] New window uses new accent color
9. Reload page (F5 or Cmd+R)
   - [ ] After reload, accent color persists
   - [ ] Settings window shows swatch as active
   - [ ] Terminal, Files, Projects all use persisted color
10. Open DevTools → Console → localStorage
    - [ ] Key: `a0os_settings`
    - [ ] Value contains: `"accentColor":"cyan"` (or selected color)
```

**Checklist:**
- [ ] Settings window opens
- [ ] Swatches visible and clickable
- [ ] Click swatch: active border appears
- [ ] Global accent color updates immediately
- [ ] All windows update (no manual refresh)
- [ ] localStorage saves new color
- [ ] Page reload restores persisted color
- [ ] No console errors
- [ ] Animation smooth (not instant, not slow)

---

### 2.4 Critical Path 4: File Manager → Markdown Rendering

**Procedure:**
```
1. Load page
2. Double-click Files icon (or launcher → Files)
3. File Manager opens showing /home/user
4. File list:
   - [ ] about.txt
   - [ ] skills.json
   - [ ] contact.md
   - [ ] projects (folder)
5. Click contact.md
   - [ ] Viewer opens below file list
   - [ ] Markdown renders as:
     - H1: "Contact"
     - Bullet list:
       - Email: contact@A0Zero.ir (link, blue)
       - GitHub: https://github.com/1tzArad (link, blue)
       - Telegram: @sysrqtrigger (link, blue)
6. Click email link
   - [ ] Opens mailto:contact@A0Zero.ir (email client)
7. Back to Files
8. Click skills.json
   - [ ] Viewer shows JSON (code block?)
   - [ ] Or plain text rendering
   - [ ] No syntax errors
9. Click about.txt
   - [ ] Shows: Name, Title, Location, Email, Website, Summary
10. Double-click projects folder
    - [ ] Sidebar updates to show projects path
    - [ ] Pathbar: /home/user/projects
    - [ ] Repos list loads (GitHub integration)
```

**Checklist:**
- [ ] File manager opens
- [ ] Files visible in list
- [ ] Click file: viewer shows content
- [ ] Markdown renders (headings, lists, links)
- [ ] Links clickable
- [ ] JSON valid (not corrupted)
- [ ] Pathbar updates on navigate
- [ ] Sidebar updates on navigate
- [ ] Projects folder fetches GitHub repos
- [ ] No console errors

---

### 2.5 Mobile Responsiveness Test (375x667)

**Procedure:**
```
1. Open DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M)
3. Select iPhone SE (375x667) or custom 375x667
4. Reload page
5. Check:
   - [ ] Desktop icons visible (not cut off)
   - [ ] Icons stacked vertically
   - [ ] Taskbar at bottom (not pushed off)
   - [ ] No horizontal scroll
   - [ ] Text readable (not tiny)
   - [ ] Touch targets ≥44px
6. Double-click Terminal icon
   - [ ] Window opens (sized for mobile)
   - [ ] Window fits viewport (not taller than available space)
   - [ ] Terminal input usable (no keyboard overlap issue)
   - [ ] Can type command, see output
7. Double-click Settings icon
   - [ ] Window opens (sized for mobile)
   - [ ] Color swatches visible
   - [ ] Can click swatch (not cramped)
8. Double-click Files icon
   - [ ] Window opens
   - [ ] File list visible
   - [ ] Sidebar visible (or collapses on very narrow)
   - [ ] Can scroll and navigate
9. Check viewport: does keyboard appear/disappear smoothly?
   - [ ] No content pushed off-screen
   - [ ] No jank or layout shift
10. Portrait → Landscape:
    - [ ] Layout reflows
    - [ ] No rotation lag
    - [ ] Content still readable
```

**Checklist:**
- [ ] No horizontal overflow at 375px
- [ ] Text readable (not <12px)
- [ ] Touch targets ≥44px
- [ ] Windows sized appropriately for mobile
- [ ] File manager/terminal usable on mobile
- [ ] Keyboard doesn't hide content permanently
- [ ] Orientation change smooth
- [ ] All features accessible on mobile

---

### 2.6 Particle System & Background

**Procedure:**
```
1. Load page
2. Observe particle canvas:
   - [ ] Particles visible (small circles moving)
   - [ ] Mouse movement: particles repel from cursor
   - [ ] Particles link with lines when close
   - [ ] Grid overlay visible (thin lines, optional)
3. Open Settings
4. Toggle "Particles enabled"
   - [ ] Canvas disappears (display:none)
   - [ ] No lag or flicker
5. Toggle back "Particles enabled"
   - [ ] Canvas reappears
   - [ ] Particles resume animation
6. Toggle "Grid overlay enabled"
   - [ ] Grid appears/disappears smoothly
7. Minimize/restore window
   - [ ] Particles still animate
8. Switch browser tab and back
   - [ ] Animation pauses (visibility detection)
   - [ ] Animation resumes on tab focus
   - [ ] No excessive CPU usage
9. Monitor DevTools Performance:
   - [ ] FPS: 60 (or stable on device)
   - [ ] Frame time: <16.67ms per frame
   - [ ] No jank or stuttering
```

**Checklist:**
- [ ] Particles render smoothly (60fps)
- [ ] Mouse interaction responsive
- [ ] Particles link visibly
- [ ] Toggle disables/enables smoothly
- [ ] Visibility detection works (pause on blur)
- [ ] Grid overlay toggles
- [ ] No console errors
- [ ] Performance acceptable (no CPU spike)

---

## PHASE 3: CROSS-BROWSER & DEVICE TESTING

### 3.1 Browser Compatibility Matrix

| Feature | Chrome 130+ | Firefox 131+ | Safari 18+ | Edge 130+ |
|---------|------------|-------------|-----------|----------|
| Window manager | ✓ | ✓ | ✓ | ✓ |
| Terminal input | ✓ | ✓ | ✓ | ✓ |
| Contenteditable | ✓ | ✓ | ✓ | ✓ |
| Canvas particles | ✓ | ✓ | ✓ | ✓ |
| Backdrop-filter | ✓ | ✓ | ✓ | ✓ |
| CSS Grid | ✓ | ✓ | ✓ | ✓ |
| CSS Custom Props | ✓ | ✓ | ✓ | ✓ |
| localStorage | ✓ | ✓ | ✓ | ✓ |
| Fetch API | ✓ | ✓ | ✓ | ✓ |

**Test:**
```
For each browser:
1. Open site
2. Load page: no console errors
3. Run Terminal commands: all work
4. Fetch GitHub repos: loads
5. Change accent color: updates
6. Open/close/minimize windows: works
7. Take screenshot: compare to baseline
```

---

### 3.2 Device Testing

**Test on actual devices (if possible) or emulators:**

| Device | Viewport | OS | Browser | Status |
|--------|----------|-----|---------|--------|
| Desktop | 1920x1080 | macOS/Windows | Chrome | ✓ Test |
| Laptop | 1366x768 | macOS/Windows | Chrome | ✓ Test |
| iPad | 768x1024 | iPadOS | Safari | ✓ Test |
| iPhone SE | 375x667 | iOS | Safari | ✓ Test |
| Galaxy S24 | 412x915 | Android | Chrome | ✓ Test |

**For each device:**
```
1. Load site
2. Test critical path (Terminal → command)
3. Test GitHub API (Projects window)
4. Test Settings (accent change)
5. Test File Manager (markdown)
6. Take screenshots
7. Note any issues (lag, layout issues, etc.)
```

---

## PHASE 4: ACCESSIBILITY VALIDATION

### 4.1 Keyboard Navigation Full Test

**Procedure:**
```
1. Open site
2. Press Tab repeatedly (count elements, verify order):
   - Launcher button (A0) → focus visible
   - Desktop icons (Terminal, Files, etc.) → focus visible
   - Launcher menu items (if menu open) → focus visible
   - Taskbar items → focus visible
   - Window close/minimize/maximize buttons → focus visible
   - Terminal input → focus visible
   - Settings swatches → focus visible
   
3. Verify focus ring:
   - [ ] Visible on all interactive elements
   - [ ] Color: cyan (accent, high contrast)
   - [ ] Size: 2px outline, 4px offset
   - [ ] Not hidden by other elements
   
4. Test Shift+Tab (reverse):
   - [ ] Cycles through elements in reverse order
   - [ ] Focus ring still visible
   
5. Test Enter on various elements:
   - Launcher button → menu opens
   - Desktop icon (with focus) → window opens? (or only double-click?)
   - Swatch in Settings → color changes
   - Button in dialog → action executes
   
6. Test Escape:
   - Menu open → menu closes
   - Modal/dialog open → closes
   - Terminal autocomplete visible → closes
   
7. Test Arrow keys:
   - Terminal: ArrowUp/ArrowDown → history navigation
   - Terminal completion: ArrowLeft/ArrowRight → suggestion navigation
   - Settings: can arrow between swatches? (if implemented)
```

**Checklist:**
- [ ] Tab reaches all interactive elements
- [ ] Tab order is logical (not jumping randomly)
- [ ] Shift+Tab reverses
- [ ] Focus ring visible (≥2px, high contrast)
- [ ] Enter activates elements
- [ ] Escape closes modals/menus
- [ ] Arrow keys work for navigation
- [ ] No keyboard traps (can always tab away)

---

### 4.2 Screen Reader Testing (Manual Spot-Check)

**macOS VoiceOver (Cmd+F5 toggle):**
```
1. Enable VoiceOver
2. Tab to elements, listen to announcements:
   - Launcher button → "A0, button"
   - Desktop icon → "Terminal, button" (or icon name)
   - Window close button → "Close, button"
   - Terminal output → "Terminal output, region, polite" (aria-live)
   - Links → "Email, link" (not just "link")
   
3. Check:
   - [ ] Element purpose clear from label/title
   - [ ] Links have meaningful text
   - [ ] Images have alt text or aria-hidden
   - [ ] Form fields have labels
   - [ ] Decorative elements hidden (aria-hidden="true")
```

**Firefox NVDA (Windows) or similar:**
```
1. Open NVDA
2. Tab through elements
3. Listen for: button, link, heading, text, input, etc.
4. Verify labels descriptive (not just "click here")
```

**Checklist:**
- [ ] Launcher button announces correctly
- [ ] Links have meaningful text
- [ ] Buttons have labels
- [ ] Terminal output announces on aria-live
- [ ] Decorative elements hidden
- [ ] No "image" or "unlabeled" elements

---

### 4.3 Color Contrast Audit

**Using Axe DevTools:**
```
1. Run Axe scan (right-click → Axe → Scan ALL of my page)
2. Review Violations:
   - [ ] No "Low contrast" errors
   - [ ] Record any failures
3. Review Passes:
   - [ ] All text contrast passes
```

**Manual Check (WebAIM Contrast Checker):**
```
For each text color + background pair:
1. Foreground color: (extract from DevTools Computed)
2. Background color: (extract from DevTools Computed or parent)
3. Enter into https://webaim.org/resources/contrastchecker/
4. Check ratio:
   - [ ] Normal text: ≥4.5:1 (WCAG AA)
   - [ ] Large text (≥18px): ≥3:1 (WCAG AA)
```

**Elements to check:**
- [ ] Primary text (#e6edf3) on black (#0a0a0a) → should be ~15:1
- [ ] Secondary text (#8b949e) on black → should be ~7:1
- [ ] Accent text (cyan #06d6ff) on black → should be ~7:1
- [ ] Terminal text on terminal background → should be ≥4.5:1
- [ ] Window title text on titlebar → should be ≥4.5:1
- [ ] Button text on button background → should be ≥4.5:1

---

### 4.4 Motion & Seizure Prevention

**Check prefers-reduced-motion:**
```
1. System Preferences → Accessibility → Display → Reduce motion (macOS)
   Or Settings → Accessibility → Display → Reduce motion (Windows/Linux)
2. Enable "Reduce motion"
3. Reload page
4. Check:
   - [ ] Animations disabled or reduced
   - [ ] Particle system disabled (or minimal movement)
   - [ ] Window transitions reduced
   - [ ] No flashing (particle animations ≤3 Hz)
5. Verify user can still:
   - [ ] Use terminal
   - [ ] Open/close windows
   - [ ] Change settings
   - [ ] Access all features (without motion)
```

**Checklist:**
- [ ] Animations respect prefers-reduced-motion
- [ ] Particle system can be disabled
- [ ] No flashing content (WCAG Level A)
- [ ] All features accessible without animation

---

## PHASE 5: PERFORMANCE VALIDATION

### 5.1 Lighthouse Audit (Post-Redesign)

**Repeat Lighthouse audit on redesigned site:**
```
1. Open DevTools → Lighthouse
2. Mode: Navigation, All categories
3. Click "Analyze page load"
4. Record scores:
   - Performance: ___
   - Accessibility: ___
   - Best Practices: ___
   - SEO: ___
5. Export report → `redesign_lighthouse_1920x1080.html`
6. Compare to baseline:
   - Performance: baseline ___ → redesign ___ (target: ≥85)
   - Accessibility: baseline ___ → redesign ___ (target: ≥90)
   - Best Practices: baseline ___ → redesign ___ (target: ≥90)
   - SEO: baseline ___ → redesign ___ (target: ≥90)
```

---

### 5.2 Core Web Vitals

**Measure:**
| Metric | Baseline | Redesign | Target | Status |
|--------|----------|----------|--------|--------|
| FCP (First Contentful Paint) | ___ | ___ | <1.8s | ✓/✗ |
| LCP (Largest Contentful Paint) | ___ | ___ | <2.5s | ✓/✗ |
| CLS (Cumulative Layout Shift) | ___ | ___ | <0.1 | ✓/✗ |

**Check in DevTools → Performance → Metrics:**
```
1. Record page load
2. Note FCP, LCP, CLS values
3. Compare to baseline
4. Verify no significant regression
```

---

### 5.3 Performance Budget Check

**CSS Bundle Size:**
```
1. DevTools → Network tab
2. Filter by .css files
3. Check total CSS size:
   - [ ] styles.css: <100KB (reasonable, may be larger with new design)
4. No external CSS libraries (verify only system fonts)
```

**JS Bundle Size:**
```
1. DevTools → Network tab
2. Filter by .js files
3. Check total JS size:
   - app.js: ~180KB (target: no increase >10%)
   - config.js: ~1KB
4. Total: <200KB
```

**Checklist:**
- [ ] CSS: <100KB
- [ ] JS: <200KB (or baseline + <10%)
- [ ] No external font loads (system fonts only)
- [ ] Images optimized (if any added)

---

## PHASE 6: FINAL QA SIGN-OFF

### 6.1 Regression Test Summary

**Create file: `regression_test_results.txt`**
```
=== POST-REDESIGN REGRESSION TEST SUMMARY ===
Date: [DATE]
Tester: [NAME]
Build: [COMMIT HASH or VERSION]

PHASE 0 REGRESSION (Core Features):
- [ ] Window manager: PASS
- [ ] Terminal: PASS
- [ ] File manager: PASS
- [ ] GitHub API: PASS
- [ ] Settings persistence: PASS
- [ ] Particle system: PASS
- [ ] Desktop icons: PASS
- [ ] Taskbar: PASS

PHASE 1 VISUAL (Design System):
- [ ] Colors match spec: PASS
- [ ] Glass effects correct: PASS
- [ ] Typography hierarchy: PASS
- [ ] Spacing aligned to grid: PASS
- [ ] Border radius updated: PASS
- [ ] Interactive states work: PASS
- [ ] Responsive breakpoints: PASS

PHASE 2 FUNCTIONAL (Features):
- [ ] Critical path 1 (Terminal): PASS
- [ ] Critical path 2 (Projects): PASS
- [ ] Critical path 3 (Settings): PASS
- [ ] Critical path 4 (File Manager): PASS
- [ ] Mobile responsiveness: PASS

PHASE 3 CROSS-BROWSER:
- [ ] Chrome 130+: PASS
- [ ] Firefox 131+: PASS
- [ ] Safari 18+: PASS
- [ ] Edge 130+: PASS
- [ ] Mobile (iOS): PASS
- [ ] Mobile (Android): PASS

PHASE 4 ACCESSIBILITY:
- [ ] Keyboard navigation: PASS
- [ ] Screen reader: PASS
- [ ] Color contrast (WCAG AA): PASS
- [ ] Motion (prefers-reduced-motion): PASS

PHASE 5 PERFORMANCE:
- [ ] Lighthouse Performance: PASS (≥85)
- [ ] Lighthouse Accessibility: PASS (≥90)
- [ ] Core Web Vitals: PASS
- [ ] Bundle size: PASS

KNOWN ISSUES:
- [List any P2/P3 bugs not blocking release]

SIGN-OFF:
- [ ] All Phase 0-2 tests: PASS
- [ ] All Phase 3-4 tests: PASS
- [ ] Performance acceptable: PASS
- [ ] Ready for deployment: YES / NO

Tester signature: _______________
Date: _______________
```

---

## APPENDIX A: Tools & Resources

### Accessibility
- **Axe DevTools:** https://www.deque.com/axe/devtools/
- **WAVE:** https://wave.webaim.org/extension/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Lighthouse (Chrome DevTools):** F12 → Lighthouse tab

### Performance
- **Chrome DevTools Performance:** F12 → Performance tab
- **Lighthouse:** F12 → Lighthouse tab
- **WebPageTest:** https://www.webpagetest.org/

### Visual Regression
- **Pixelmatch:** https://www.diffchecker.com/image-diff/
- **Percy:** https://percy.io/ (automated visual testing, paid)
- **BackstopJS:** https://garris.github.io/BackstopJS/ (open-source)

### Device Testing
- **Chrome DevTools Device Toolbar:** F12 → Cmd+Shift+M
- **BrowserStack:** https://www.browserstack.com/ (real devices, paid)
- **Responsively App:** https://responsively.app/ (free desktop app)

---

## APPENDIX B: Issue Severity Levels

**P0 (Blocker)** — Deployment blocked
- App crash on load
- Core feature non-functional
- Data loss

**P1 (Critical)** — Must fix before launch
- Command doesn't execute
- GitHub fetch fails
- Settings don't persist

**P2 (High)** — Should fix before launch
- Visual glitch
- Performance regression
- Accessibility issue

**P3 (Medium)** — Can defer to v2
- Cosmetic bug
- Optional enhancement

**P4 (Low)** — Won't fix
- Typo
- Unused code

---

## APPENDIX C: Screenshot Checklist

**Baseline Screenshots Required:**
- [ ] Desktop 1920x1080 (full page)
- [ ] Tablet 768x1024 (full page)
- [ ] Mobile 375x667 (full page)
- [ ] Terminal window (active)
- [ ] File Manager window (showing markdown)
- [ ] Settings window (showing color swatches)
- [ ] Projects window (showing repos)
- [ ] Console (showing 0 errors)
- [ ] DevTools Lighthouse report (baseline)
- [ ] Axe accessibility report (baseline)

**Post-Redesign Screenshots Required:**
- [ ] Desktop 1920x1080 (full page, redesigned)
- [ ] Tablet 768x1024 (redesigned)
- [ ] Mobile 375x667 (redesigned)
- [ ] All windows updated with new design
- [ ] Console (0 errors)
- [ ] DevTools Lighthouse report (redesigned)
- [ ] Axe accessibility report (redesigned)
- [ ] Before/after comparison (1-2 examples)

---

**End of QA Execution Guide**

Use this guide for pre-redesign baseline capture and post-redesign validation. Adjust timings and procedures based on team availability and project scope.
