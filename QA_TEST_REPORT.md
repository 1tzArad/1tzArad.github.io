# QA Test Report — A0/OS Desktop Environment Redesign
## Phase 5 Integration Testing

**Test Date:** [DATE]  
**Tester Name:** [NAME]  
**Build Version:** [COMMIT SHA]  
**Environment:** [BROWSER/OS] / [MOBILE MODEL]  
**Test Status:** ⏳ IN PROGRESS / ✅ PASSED / ⚠️ FAILED  

---

## Executive Summary

| Category | Result | Notes |
|----------|--------|-------|
| **Tier 1: Critical Functionality** | ⏳ | |
| **Tier 2: Visual Consistency** | ⏳ | |
| **Tier 3: Performance** | ⏳ | |
| **Accessibility** | ⏳ | |
| **Overall Status** | ⏳ | |

---

## TIER 1: Critical Functionality Tests

### Test 1.1: Terminal — `help` Command
**Objective:** Verify terminal displays available commands  
**Prerequisites:**
- Terminal app is open
- Input field is focused

**Steps:**
1. Type `help` in terminal input
2. Press Enter
3. Observe output

**Expected Result:**
- Help text displays with command list
- Minimum commands shown: help, about, projects, skills, contact, clear, desktop, launch, close, apps, theme
- Text is readable (blue for links, green for user)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Screenshot: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.2: Terminal — `about` Command
**Objective:** Verify profile information displays correctly  
**Prerequisites:**
- Terminal app is open

**Steps:**
1. Type `about`
2. Press Enter
3. Observe output

**Expected Result:**
```
A0Zero — Jr Backend Developer
Location: Hell/Limbo
Email: contact@A0Zero.ir (link in blue)
Website: https://A0Zero.ir/ (link in blue)
A gamer who codes (a beginner, really)
```

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Profile name matches: `A0Zero` ✓
- Title matches: `Jr Backend Developer` ✓
- Location displays: ✓
- Email link functional: ✓
- Website link functional: ✓
- Bio displays: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.3: Terminal — `skills` Command
**Objective:** Verify all 5 skill categories display  
**Prerequisites:**
- Terminal app is open

**Steps:**
1. Type `skills`
2. Press Enter
3. Count skill categories

**Expected Result:**
- 5 categories display: Languages, Frontend, Backend, Databases, Tools
- Each category shows list of skills
- Languages includes: JavaScript, TypeScript, Go
- Frontend includes: HTML, CSS, Tailwind CSS
- Backend includes: Node.js, Express.js, Gin
- Databases includes: PostgreSQL, MongoDB, SQL
- Tools includes: Git, npm, Docker

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Categories shown: [LIST]
- Skills per category: [COUNT/VERIFY]
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.4: Terminal — `contact` Command
**Objective:** Verify contact links display  
**Prerequisites:**
- Terminal app is open

**Steps:**
1. Type `contact`
2. Press Enter
3. Observe links

**Expected Result:**
- Email: `contact@A0Zero.ir` (clickable link)
- GitHub: `https://github.com/1tzArad` (clickable link)
- Telegram: `@sysrqtrigger` (link to t.me/sysrqtrigger)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Email link present: ✓
- GitHub link present: ✓
- Telegram link present: ✓
- Links are blue (accent color): ✓
- Click email → opens mailto: ✓
- Click GitHub → opens in new tab: ✓
- Click Telegram → opens in new tab: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.5: Terminal — `theme` Command
**Objective:** Verify accent color changes and persists  
**Prerequisites:**
- Terminal app is open
- DevTools Application tab accessible

**Steps:**
1. Type `theme green`
2. Press Enter
3. Observe color change
4. Open DevTools → Application → Local Storage
5. Find `a0os_settings` and verify `accentColor: 'green'`
6. Refresh page (F5)
7. Observe accent color persists

**Expected Result:**
- Theme immediately changes to green
- Taskbar, buttons, accents become green
- localStorage entry: `{"accentColor":"green","particlesEnabled":true,"gridEnabled":true}`
- After refresh, accent remains green

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Immediate color change: ✓
- Confirmation message displays: ✓
- localStorage key present: ✓
- localStorage value correct: ✓
- Persist after refresh: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.6: Terminal — History & Arrow Keys
**Objective:** Verify command history navigation  
**Prerequisites:**
- Terminal app is open
- Previous commands executed (help, about, skills)

**Steps:**
1. Click terminal input
2. Press Up arrow
3. Observe last command recalled
4. Press Up arrow again
5. Observe second-to-last command recalled
6. Press Down arrow
7. Observe goes forward in history
8. Press Escape
9. Verify input clears

**Expected Result:**
- Up arrow recalls previous commands in order
- Down arrow moves forward in history
- Escape clears input

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Up arrow works: ✓
- Down arrow works: ✓
- Escape clears: ✓
- History navigable: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.7: Terminal — Tab Autocomplete
**Objective:** Verify command autocomplete and suggestions  
**Prerequisites:**
- Terminal app is open

**Steps:**
1. Type `t`
2. Press Tab
3. Observe autocomplete or suggestions
4. If unique match, verify completed to full command
5. If multiple matches, verify grid shows options
6. Press Tab again to cycle options
7. Press Escape to clear

**Expected Result:**
- Single Tab on unique prefix completes command
- Multiple matches show in grid format
- Tab cycles through matches
- Escape clears suggestions
- Suggestion grid positioned above input

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Tab autocomplete works: ✓
- Multiple suggestions display: ✓
- Grid layout correct: ✓
- Arrow keys navigate: ✓
- Escape clears: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.8: Terminal — Ctrl+C & Ctrl+L
**Objective:** Verify keyboard shortcuts  
**Prerequisites:**
- Terminal app is open
- Some output in terminal

**Steps:**
1. Type `about` (don't press Enter)
2. Press Ctrl+C
3. Verify input clears and ^C displays
4. Type `help`
5. Press Enter
6. Press Ctrl+L
7. Verify output clears

**Expected Result:**
- Ctrl+C shows `^C` and clears input
- Ctrl+L clears all output

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Ctrl+C displays ^C: ✓
- Ctrl+C clears input: ✓
- Ctrl+L clears output: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.9: File Manager — Navigation
**Objective:** Verify file system navigation  
**Prerequisites:**
- File Manager app is open

**Steps:**
1. Observe initial path `/home/user`
2. Verify files display: `about.txt`, `skills.json`, `contact.md`, `projects` folder
3. Double-click `about.txt`
4. Verify viewer opens with content
5. Click back button
6. Verify returns to file list
7. Click breadcrumb `/`
8. Verify goes to root
9. Click `/home` breadcrumb
10. Verify goes to home

**Expected Result:**
- Initial path `/home/user` shows 4 items
- Double-click opens viewer
- Back button returns to list
- Breadcrumbs navigate correctly
- All paths are clickable

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Initial files display: ✓
- Viewer opens on double-click: ✓
- Back button works: ✓
- Breadcrumb navigation works: ✓
- All paths clickable: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.10: File Manager — Markdown Rendering
**Objective:** Verify markdown files render correctly  
**Prerequisites:**
- File Manager is open
- Navigated to `/home/user`

**Steps:**
1. Double-click `contact.md`
2. Observe markdown rendering
3. Verify headings are bold and larger
4. Verify list items have bullets
5. Verify links are blue
6. Click link (mailto: or https:)
7. Verify opens in new tab or email client

**Expected Result:**
```
# Contact          ← h1, bold, large
- Email: ...       ← bullet list
- GitHub: ...      ← link in blue
- Telegram: ...    ← link in blue
```

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Heading renders as h1: ✓
- List items have bullets: ✓
- Links are blue: ✓
- Links are clickable: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.11: Projects App — GitHub Repo Fetch
**Objective:** Verify GitHub API fetches repos  
**Prerequisites:**
- Projects app can be opened

**Steps:**
1. Double-click Projects icon (or launch from terminal)
2. Observe loading spinner
3. Wait for repos to load (5–10 seconds)
4. Verify repos display with username `1tzArad`
5. Count repos loaded
6. Verify each repo shows: name, description, language, stars, updated time

**Expected Result:**
- Spinner displays during fetch
- Repos load within 10 seconds
- Multiple repos display (minimum 5)
- Username `1tzArad` confirmed
- Repo metadata present (stars, language, updated)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Spinner displays: ✓
- Repos load: ✓
- Count: [NUMBER]
- Username: [VERIFY]
- Metadata complete: ✓
- Screenshots: [ATTACH]
- Console errors: [NONE / LIST]
- Notes: [FILL IN]

---

### Test 1.12: Projects App — Sorting
**Objective:** Verify repo sorting modes  
**Prerequisites:**
- Projects app is open with repos loaded

**Steps:**
1. Click "Sort: Updated" dropdown
2. Select "Sort: Stars"
3. Verify repos re-sort (highest stars first)
4. Select "Sort: Name"
5. Verify repos sort A–Z
6. Select "Sort: Language"
7. Verify repos group by language
8. Select "Sort: Updated" (revert)

**Expected Result:**
- Sort options change repo order
- Stars sort is descending (highest first)
- Name sort is alphabetical
- Language sort groups by language name
- Re-sort is instant (no loading)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Updated sort works: ✓
- Stars sort works: ✓
- Name sort works: ✓
- Language sort works: ✓
- Instant re-sort: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.13: Projects App — Caching
**Objective:** Verify repos are cached and instant on second open  
**Prerequisites:**
- Projects app already opened and repos loaded

**Steps:**
1. Close Projects app (click close button)
2. Verify Projects removed from taskbar
3. Open Projects app again (double-click icon)
4. Observe repos load instantly (no spinner or minimal)
5. Verify same repos display

**Expected Result:**
- Second open loads instantly (<1 second)
- No API call visible in Network tab
- Same repo list displays

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Instant load on reopen: ✓
- No spinner: ✓
- Same repos: ✓
- Network tab shows cache: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.14: Window Manager — Drag
**Objective:** Verify window dragging works smoothly  
**Prerequisites:**
- Any window is open (Terminal, Files, etc.)

**Steps:**
1. Click and hold titlebar
2. Drag window to new position
3. Release mouse
4. Verify window stays in new position
5. Try dragging to bottom-right corner
6. Verify window doesn't go off-screen

**Expected Result:**
- Drag is smooth and responsive
- Window follows cursor
- Window stops at screen bounds
- No jank or lag during drag

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Drag smooth: ✓
- Follows cursor: ✓
- Respects bounds: ✓
- No jank: ✓
- Screenshots/Recording: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.15: Window Manager — Minimize
**Objective:** Verify minimize functionality  
**Prerequisites:**
- Terminal window is open

**Steps:**
1. Click yellow minimize button
2. Observe window fades out
3. Verify window no longer visible
4. Verify taskbar shows Terminal button (dimmed or with icon)
5. Click Terminal button in taskbar
6. Observe window restores

**Expected Result:**
- Window fades/scales down
- Window hidden (not deleted)
- Taskbar still shows window
- Click taskbar button restores window
- Window is focused after restore

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Window hides: ✓
- Taskbar button present: ✓
- Taskbar button shows "minimized" state: ✓
- Restore works: ✓
- Focus restored: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.16: Window Manager — Maximize
**Objective:** Verify maximize functionality  
**Prerequisites:**
- Any window is open

**Steps:**
1. Click green maximize button
2. Observe window fills screen
3. Verify borders removed (or minimal)
4. Verify maximize button changes to restore icon
5. Click maximize button again
6. Observe window restores to previous size/position

**Expected Result:**
- Window fills screen width and height
- Borders removed (except top)
- Button toggles between maximize/restore
- Window restores to exact previous state

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Fills screen: ✓
- Borders removed: ✓
- Button toggles: ✓
- Restores correctly: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.17: Window Manager — Close
**Objective:** Verify close functionality  
**Prerequisites:**
- Multiple windows are open (Terminal, Files, Projects)

**Steps:**
1. Click red close button on Terminal
2. Observe Terminal window closes and disappears
3. Verify Terminal removed from taskbar
4. Verify other windows unaffected
5. Close remaining windows

**Expected Result:**
- Window closes and removes from DOM
- Taskbar updates immediately
- Other windows remain unaffected

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Window closes: ✓
- Taskbar updates: ✓
- Other windows safe: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.18: Window Manager — Focus & Z-Index
**Objective:** Verify window focus and stacking  
**Prerequisites:**
- Multiple windows open and overlapping

**Steps:**
1. Click Terminal window (behind Files window)
2. Observe Terminal moves to front
3. Verify Terminal has accent border
4. Verify Files loses accent border
5. Click Files
6. Verify Files moves to front
7. Verify only focused window has accent border

**Expected Result:**
- Clicking window brings it to front
- Focused window has accent-colored border
- Unfocused windows have gray border
- Only one window has accent border at a time

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Click brings to front: ✓
- Focused border correct: ✓
- Unfocused border correct: ✓
- Z-index correct: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.19: Taskbar — Open Window Indicators
**Objective:** Verify taskbar shows all open windows  
**Prerequisites:**
- No windows open initially

**Steps:**
1. Open Terminal (double-click icon or launcher)
2. Verify Terminal appears in taskbar
3. Open Files
4. Verify Files appears in taskbar
5. Open Projects
6. Verify Projects appears in taskbar
7. Verify taskbar shows 3 buttons
8. Close Terminal
9. Verify taskbar shows 2 buttons (Files, Projects)

**Expected Result:**
- Each open window has taskbar button
- Button shows app icon and name
- Taskbar updates when windows open/close
- Only open windows shown (closed removed)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- All windows shown: ✓
- Buttons have icons: ✓
- Buttons have labels: ✓
- Updates on open/close: ✓
- Only open windows: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.20: Taskbar — Clock
**Objective:** Verify taskbar clock displays and updates  
**Prerequisites:**
- Browser is open with A0/OS

**Steps:**
1. Locate clock in taskbar (bottom right)
2. Observe time format (HH:MM)
3. Wait 10 seconds
4. Observe clock updates
5. Verify format is consistent

**Expected Result:**
- Clock displays current time
- Format: HH:MM (24-hour)
- Updates every 1 second or every 10 seconds
- No clock errors or invalid times

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Clock visible: ✓
- Time correct: ✓
- Updates: ✓
- Format correct: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.21: Settings — Particle Toggle
**Objective:** Verify particles can be toggled  
**Prerequisites:**
- Settings app is open

**Steps:**
1. Locate "Particle System" toggle
2. Note current state (ON or OFF)
3. Click toggle
4. Observe particle background (should disappear if toggle OFF)
5. Click toggle again
6. Observe particles reappear
7. Verify setting persists on refresh

**Expected Result:**
- Toggle shows current state
- Toggling immediately shows/hides particles
- Setting persists on page refresh

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Toggle present: ✓
- State changes: ✓
- Particles show/hide: ✓
- Persists on refresh: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.22: Settings — Accent Color
**Objective:** Verify accent color can be changed in Settings  
**Prerequisites:**
- Settings app is open

**Steps:**
1. Locate accent color options
2. Click "Blue"
3. Observe all accents change to blue (taskbar, buttons, window borders)
4. Click "Green"
5. Observe all accents change to green
6. Click "Purple" (default)
7. Verify default is restored

**Expected Result:**
- Color options available (blue, green, purple, amber)
- Clicking changes all accent colors throughout UI
- Change is instant
- Default is purple

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Options available: ✓
- Blue works: ✓
- Green works: ✓
- Purple works: ✓
- Amber works: ✓
- Instant change: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.23: Launcher Menu
**Objective:** Verify launcher menu opens and lists apps  
**Prerequisites:**
- A0/OS loaded

**Steps:**
1. Click "A0" button in taskbar (bottom left)
2. Observe launcher menu opens
3. Verify all 5 apps listed: Terminal, Files, Projects, System Info, Settings
4. Click an app (e.g., Terminal)
5. Verify app window opens
6. Verify launcher menu closes

**Expected Result:**
- Menu appears above A0 button
- All 5 apps listed with icons
- Clicking app opens it
- Menu closes after selection

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Menu opens: ✓
- All apps listed: ✓
- Apps have icons: ✓
- Click opens app: ✓
- Menu closes: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 1.24: Desktop Icons — Double-Click
**Objective:** Verify desktop icons launch apps  
**Prerequisites:**
- A0/OS loaded, desktop visible

**Steps:**
1. Double-click Terminal icon (top-left desktop)
2. Verify Terminal window opens
3. Double-click Files icon
4. Verify Files window opens
5. Verify both windows now in taskbar
6. Verify no duplicates in taskbar

**Expected Result:**
- Double-click launches app
- Window appears
- Taskbar updated
- Only one window per app (no duplicates)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Double-click works: ✓
- Window opens: ✓
- Taskbar updated: ✓
- No duplicates: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

## TIER 2: Visual Consistency Tests

### Test 2.1: Typography — Readability
**Objective:** Verify all text is readable and properly sized  
**Prerequisites:**
- Multiple windows open with content

**Steps:**
1. Open Terminal (check input text)
2. Open File Manager (check file names)
3. Open Projects (check repo names and descriptions)
4. Observe font size and readability
5. Verify no text is too small (<11px on desktop)
6. Verify headings are larger than body text

**Expected Result:**
- All text is readable
- Font size consistent
- Headings > body text size
- Monospace font throughout (Cascadia Code or similar)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Terminal readable: ✓
- File names readable: ✓
- Repo names readable: ✓
- Descriptions readable: ✓
- Font consistent: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 2.2: Color Contrast
**Objective:** Verify text contrast meets WCAG AA (4.5:1)  
**Prerequisites:**
- DevTools or color contrast checker tool

**Steps:**
1. Sample text color: #e6edf3 (var(--text-primary))
2. Sample background: #161b22 (var(--surface))
3. Use WebAIM or similar tool to calculate ratio
4. Verify ratio ≥4.5:1
5. Check link colors (#58a6ff) on surface
6. Verify link ratio ≥4.5:1

**Expected Result:**
- Text contrast ≥4.5:1 (WCAG AA)
- Link contrast ≥4.5:1

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Text contrast: [RATIO] ✓ / ✗
- Link contrast: [RATIO] ✓ / ✗
- Tool used: [NAME]
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 2.3: Spacing & Alignment
**Objective:** Verify consistent spacing and alignment  
**Prerequisites:**
- Multiple windows open

**Steps:**
1. Inspect window padding (should be ~10px)
2. Check gap between taskbar items (should be ~4–6px)
3. Check desktop icon spacing (should be ~8px)
4. Verify taskbar is centered and aligned
5. Verify window titles centered in titlebar

**Expected Result:**
- Consistent padding (multiples of 4px or 8px)
- Elements well-aligned
- No asymmetrical spacing

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Window padding: [PX] ✓
- Taskbar gap: [PX] ✓
- Desktop icons: [PX] ✓
- Alignment: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 2.4: Glass Effects
**Objective:** Verify glassmorphism effects render correctly  
**Prerequisites:**
- Browser supports backdrop-filter (Chrome, Safari, Edge)

**Steps:**
1. Observe taskbar (should have frosted glass blur)
2. Observe launcher menu (should have blur)
3. Compare to background (blur should be visible)
4. Take screenshot comparing blurred vs solid

**Expected Result:**
- Taskbar has visible blur effect
- Launcher menu has blur effect
- Blur creates frosted glass appearance
- On unsupported browsers, solid bg fallback

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Taskbar blur: ✓
- Launcher blur: ✓
- Visual effect clear: ✓
- Browser: [NAME/VERSION]
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 2.5: Hover States
**Objective:** Verify buttons/interactive elements respond to hover  
**Prerequisites:**
- Mouse available

**Steps:**
1. Hover over A0 launcher button
2. Observe background change
3. Hover over window control buttons (close, min, max)
4. Observe brightness increase or color change
5. Hover over taskbar items
6. Observe background highlight
7. Hover over desktop icons
8. Observe background highlight

**Expected Result:**
- All interactive elements have visible hover state
- Hover doesn't break layout
- Hover feedback is instant

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Launcher button: ✓
- Control buttons: ✓
- Taskbar items: ✓
- Desktop icons: ✓
- All responsive: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 2.6: Focus States
**Objective:** Verify focused elements show clear focus indicator  
**Prerequisites:**
- Keyboard available, DevTools optional

**Steps:**
1. Press Tab to cycle through focusable elements
2. Observe focused element has outline or highlight
3. Verify outline color is accent color or contrasting color
4. Verify outline doesn't break layout

**Expected Result:**
- Focused element has clear outline (2px, accent color)
- Outline visible and doesn't overlap content
- Tab order is logical

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Outline visible: ✓
- Outline color: [COLOR]
- Outline width: [PX]
- Tab order logical: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 2.7: Responsive — Mobile (320px)
**Objective:** Verify layout is functional on mobile  
**Prerequisites:**
- DevTools responsive mode or mobile device

**Steps:**
1. Set viewport to 320px width
2. Verify taskbar is readable (buttons don't overflow)
3. Verify window is visible and scrollable
4. Verify no horizontal scroll at root level
5. Test window controls (min, max, close) work
6. Type in terminal (if open)

**Expected Result:**
- Taskbar fits without overflow
- Windows readable on 320px
- Text is 11px minimum
- No horizontal scroll at root

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Taskbar fits: ✓
- Windows readable: ✓
- No horizontal scroll: ✓
- Touch interactions work: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 2.8: Responsive — Tablet (768px)
**Objective:** Verify layout is optimized for tablet  
**Prerequisites:**
- DevTools responsive mode set to 768px

**Steps:**
1. Set viewport to 768px
2. Open Terminal and Files (2 windows)
3. Verify both windows visible
4. Verify sidebar in file manager is visible
5. Verify content readable
6. Verify no unnecessary scrolling

**Expected Result:**
- 2 windows can display side-by-side
- File manager sidebar visible
- Content optimized for 768px

**Actual Result:**
- [ ] PASS / [ ] FAIL
- 2 windows visible: ✓
- Sidebar visible: ✓
- Content readable: ✓
- Optimized layout: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 2.9: Responsive — Desktop (1200px+)
**Objective:** Verify full layout works on desktop  
**Prerequisites:**
- Viewport 1200px or larger

**Steps:**
1. Set viewport to 1920px
2. Open 4 windows (Terminal, Files, Projects, Settings)
3. Verify all visible without overlap (if desired)
4. Verify content readable
5. Verify particle background renders

**Expected Result:**
- 4 windows can be open
- All content readable
- Particles render smoothly
- No layout issues

**Actual Result:**
- [ ] PASS / [ ] FAIL
- 4 windows visible: ✓
- Readable: ✓
- Particles smooth: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 2.10: Accent Color Consistency
**Objective:** Verify accent color is consistent throughout UI  
**Prerequisites:**
- Terminal open, set theme to green

**Steps:**
1. Type `theme green`
2. Press Enter
3. Observe all accent elements: taskbar, buttons, borders, particles
4. Verify all use same green color
5. Change to blue
6. Verify all change to blue

**Expected Result:**
- Accent color consistent throughout
- All accent elements use same color value
- Theme change affects all elements

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Taskbar green: ✓
- Buttons green: ✓
- Borders green: ✓
- Particles green: ✓
- Theme change uniform: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

## TIER 3: Performance Tests

### Test 3.1: Particle Animation FPS
**Objective:** Verify particle system runs at 60fps  
**Prerequisites:**
- DevTools Performance tab accessible
- Particles enabled in settings

**Steps:**
1. Open DevTools → Performance tab
2. Click "Record"
3. Move mouse around for 5 seconds (interact with particles)
4. Click "Stop"
5. Observe Frame Rate chart
6. Verify FPS ≥55 (green), not red

**Expected Result:**
- Particles animate smoothly
- Frame rate ≥55fps
- No dropped frames (red bars)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- FPS average: [NUM]
- Dropped frames: [YES/NO]
- Performance rating: [GREEN/YELLOW/RED]
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 3.2: Window Drag Performance
**Objective:** Verify dragging window is smooth  
**Prerequisites:**
- DevTools Performance tab, window open

**Steps:**
1. Open DevTools → Performance
2. Click Record
3. Drag window across screen for 3 seconds
4. Click Stop
5. Analyze frame rate

**Expected Result:**
- Dragging is smooth
- No frame drops
- FPS ≥55

**Actual Result:**
- [ ] PASS / [ ] FAIL
- FPS during drag: [NUM]
- Dropped frames: [YES/NO]
- Smooth: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 3.3: Page Load Time
**Objective:** Verify initial page load is fast  
**Prerequisites:**
- Network throttle set to "Slow 4G" (DevTools)

**Steps:**
1. Open DevTools → Network
2. Set throttle to "Slow 4G"
3. Hard refresh (Ctrl+Shift+R)
4. Observe time until page interactive
5. Verify < 3 seconds

**Expected Result:**
- Initial load < 3 seconds
- Content visible quickly
- Interactive elements responsive

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Load time: [SEC]
- Time to interactive: [SEC]
- Fast enough: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test 3.4: Memory Leaks
**Objective:** Verify no memory leaks when opening/closing windows  
**Prerequisites:**
- DevTools Memory tab

**Steps:**
1. Open DevTools → Memory → Heap Snapshot
2. Take initial snapshot
3. Open Terminal, Files, Projects (3 windows)
4. Close all windows
5. Take second snapshot
6. Compare memory usage
7. Repeat open/close 5 times
8. Take final snapshot

**Expected Result:**
- Memory returns to baseline after closing windows
- No consistent memory growth
- No unbounded array growth

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Initial heap: [MB]
- After windows: [MB]
- After close: [MB]
- Baseline recovered: ✓
- 5-iteration heap: [MB]
- No leak detected: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

## Accessibility Tests

### Test A.1: Keyboard Navigation
**Objective:** Verify all UI elements accessible via keyboard  
**Prerequisites:**
- No mouse

**Steps:**
1. Press Tab repeatedly
2. Verify focus visible on each element
3. Verify Tab order logical (left→right, top→bottom)
4. Press Enter to activate focused element
5. Verify window opens/button activates
6. Test Escape to dismiss menus

**Expected Result:**
- All interactive elements focusable
- Focus visible
- Tab order logical
- Enter activates elements
- Escape dismisses overlays

**Actual Result:**
- [ ] PASS / [ ] FAIL
- All focusable: ✓
- Focus visible: ✓
- Tab order logical: ✓
- Enter works: ✓
- Escape works: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test A.2: ARIA Labels
**Objective:** Verify ARIA labels present for screen readers  
**Prerequisites:**
- DevTools Inspector, or screen reader (NVDA/JAWS)

**Steps:**
1. Inspect launcher button → verify `title="Applications Menu"`
2. Inspect window control buttons → verify `title="Close/Minimize/Maximize"`
3. Inspect terminal input → verify `role="textbox"` and `aria-label`
4. Use DevTools Accessibility Inspector to verify labels
5. Test with screen reader (if available)

**Expected Result:**
- All buttons have labels (title or aria-label)
- Terminal input has role and label
- Screen reader announces elements correctly

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Launcher button labeled: ✓
- Control buttons labeled: ✓
- Terminal input labeled: ✓
- Screen reader test: [PASS/SKIP]
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test A.3: Color Contrast
**Objective:** Verify colors meet WCAG AA standard  
**Prerequisites:**
- Color contrast checker (WebAIM, Lighthouse, etc.)

**Steps:**
1. Measure text color (#e6edf3) on surface (#161b22)
2. Measure link color (#58a6ff) on surface
3. Calculate contrast ratios
4. Verify both ≥4.5:1

**Expected Result:**
- Text contrast ≥4.5:1
- Link contrast ≥4.5:1

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Text ratio: [NUM]:1 ✓
- Link ratio: [NUM]:1 ✓
- WCAG AA: ✓
- Tool: [NAME]
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test A.4: Motion Preferences
**Objective:** Verify animations respect `prefers-reduced-motion`  
**Prerequisites:**
- OS supports prefers-reduced-motion (Windows, macOS, iOS, Android)

**Steps:**
1. Set OS to "Reduce motion" (Windows: Settings > Ease of Access > Display)
2. Reload page
3. Verify animations are disabled or minimal
4. Move mouse (particles should not move, or move less)
5. Minimize window (no animation, instant)

**Expected Result:**
- Animations disabled or minimal when `prefers-reduced-motion` set
- Page still functional

**Actual Result:**
- [ ] PASS / [ ] FAIL / [ ] SKIP (OS doesn't support)
- Animations disabled: ✓
- Functionality intact: ✓
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

## Console & Network

### Test C.1: No Console Errors
**Objective:** Verify no errors logged to console  
**Prerequisites:**
- DevTools Console open

**Steps:**
1. Open DevTools → Console
2. Hard refresh
3. Interact with all features (drag, click, type, open apps)
4. Observe console for red errors
5. Note any warnings (yellow)

**Expected Result:**
- No red errors
- Console clean (or only non-blocking warnings)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Errors: [NONE / LIST]
- Warnings: [NONE / LIST]
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test C.2: GitHub API Errors
**Objective:** Verify GitHub API errors handled gracefully  
**Prerequisites:**
- Network tab visible in DevTools

**Steps:**
1. Open DevTools → Network
2. Open Projects app
3. Monitor fetch to api.github.com
4. If rate-limited (403), verify error message shown
5. If user not found (404), verify error shown
6. Verify no red console errors from API failure

**Expected Result:**
- API errors caught and displayed to user
- No console errors
- Graceful fallback (cache or error message)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- API success: [YES/NO]
- Error handling: ✓
- User message: [YES/NO]
- Console errors: [NONE/LIST]
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

### Test C.3: Network Requests
**Objective:** Verify no unnecessary network requests  
**Prerequisites:**
- DevTools Network tab

**Steps:**
1. Hard refresh
2. Open DevTools → Network
3. Observe initial requests (HTML, CSS, JS, config.js, app.js)
4. Expected: 2–5 requests maximum
5. Open Projects app
6. Verify one GitHub API request (not repeated)

**Expected Result:**
- Minimal network requests
- No duplicate requests
- API called once (cached on reopen)

**Actual Result:**
- [ ] PASS / [ ] FAIL
- Initial requests: [NUM]
- API requests: [NUM]
- Duplicates: [NONE/LIST]
- Screenshots: [ATTACH]
- Notes: [FILL IN]

---

## Summary & Sign-Off

### Test Results Summary

| Category | Tier 1 | Tier 2 | Tier 3 | A11y | Overall |
|----------|--------|--------|--------|------|---------|
| **Status** | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| **Passed** | [0/24] | [0/10] | [4/4] | [4/4] | [X/Y] |
| **Failed** | [ ] | [ ] | [ ] | [ ] | [ ] |

### Critical Issues Found
- [ ] None
- [ ] List below:
  1. [ISSUE]
  2. [ISSUE]

### Test Coverage
- **Tier 1 (Critical):** [%]
- **Tier 2 (Quality):** [%]
- **Tier 3 (Performance):** [%]
- **Accessibility:** [%]
- **Overall:** [%]

### Browser Tested
- [ ] Chrome [VERSION]
- [ ] Firefox [VERSION]
- [ ] Safari [VERSION]
- [ ] Edge [VERSION]
- [ ] Mobile Chrome [VERSION]
- [ ] Mobile Safari [VERSION]

### Devices Tested
- [ ] Desktop (1920x1080)
- [ ] Tablet (768px)
- [ ] Mobile (320px)
- [ ] [OTHER]

### Sign-Off

**Tester Name:** [NAME]  
**Date:** [DATE]  
**Build/Commit:** [SHA]  

**QA Status:**
- [ ] ✅ APPROVED — All tests passed, no critical issues
- [ ] ⚠️ CONDITIONAL — Minor issues found, documented in Issues section
- [ ] ❌ REJECTED — Critical issues found, fails sign-off criteria

**Sign-Off:** _________________________ (Tester Signature / Approval)

**Notes:**
[FILL IN ADDITIONAL NOTES, OBSERVATIONS, RECOMMENDATIONS]

---

## Appendix: Bug Report Template

### Bug: [TITLE]
**Severity:** [ ] Critical / [ ] High / [ ] Medium / [ ] Low  
**Component:** [TERMINAL/FILES/PROJECTS/WINDOW/SETTINGS/OTHER]  

**Steps to Reproduce:**
1. [STEP]
2. [STEP]
3. [STEP]

**Expected Result:**
[EXPECTED]

**Actual Result:**
[ACTUAL]

**Environment:**
- Browser: [NAME/VERSION]
- OS: [NAME/VERSION]
- Viewport: [SIZE]
- Network: [ONLINE/OFFLINE]

**Console Error:**
```
[COPY FULL ERROR STACK]
```

**Screenshots:**
[ATTACH]

**Workaround:**
[IF ANY]

---

**QA Test Report Version:** 1.0  
**Report Template Created:** 2026-10-11

