# Quality Assurance Plan — A0/OS Desktop Environment Redesign

**Assessment Date:** 2026-10-11  
**Scope:** Complete visual and interaction redesign while preserving all core functionality  
**Status:** Pre-implementation assessment

---

## Executive Summary

The current A0/OS implementation is a sophisticated desktop environment simulator with:
- **Window Manager**: Drag, minimize, maximize, close, focus, z-index management
- **6 Applications**: Terminal, File Manager, System Info, Settings, Projects (GitHub), Browser
- **Dynamic Features**: Particle system, localStorage settings, markdown rendering, GitHub API integration
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

The redesign must preserve all interactions and state management while updating visual presentation (typography, spacing, glass effects, responsive behavior). High-risk areas are identified below.

---

## Part 1: Existing Implementation Review

### Strengths (Must Preserve)

1. **Window Manager Architecture**
   - Proper z-index stacking (zIndexCounter)
   - Minimize/maximize/close state transitions
   - Window dragging with boundary constraints
   - Focus management (single focused window per time)
   - Unique window IDs for lifecycle management
   - Clean separation of window state from DOM

2. **Terminal Application**
   - Command history with arrow key navigation
   - Autocomplete with Tab key (single-tap completes, double-tap shows options)
   - Inline suggestions with arrow key selection
   - Multiple command categories (help, about, projects, skills, contact, theme, desktop)
   - Escape key clears suggestions
   - Ctrl+C, Ctrl+L support
   - Proper contenteditable handling for input
   - Typing animation on boot

3. **File Manager**
   - Virtual file system with breadcrumb navigation
   - Markdown rendering in viewer
   - JSON pretty-printing
   - GitHub integration (repo fetching as file structure)
   - README.md display with branch fallback (main → master)
   - Back navigation and state restoration
   - Sidebar navigation with active state

4. **GitHub Integration (Projects App)**
   - API caching to minimize rate limit hits
   - Multiple sort modes (updated, stars, name, language)
   - Repository metadata display (stars, forks, language, archived status)
   - Fork and archived badges
   - Time-ago formatting
   - Language color coding
   - External link handling (Ctrl+click doesn't navigate, opens in browser)
   - Graceful error handling for API failures

5. **Settings System**
   - localStorage persistence with try/catch error handling
   - Accent color switching (purple, green, blue, amber)
   - CSS variable injection via data-accent attribute
   - Particles and grid toggle
   - Settings applied on boot

6. **Browser Application**
   - iframe sandbox for security (allow-scripts, allow-same-origin, allow-forms, allow-popups)
   - Fallback for blocked hosts (GitHub, etc.)
   - Repository info display in fallback card
   - History management (back/forward)
   - External open button

7. **Visual Design**
   - Glassmorphism with backdrop-filter: blur(8px)
   - Consistent dark theme (#0a0a0a background)
   - Monospace font stack (Cascadia Code → Fira Code → fallback)
   - Color-coded text (green for user, blue for paths, amber for warnings, red for errors)
   - Smooth transitions (0.15s–0.2s)
   - Scrollbar styling
   - Custom focus states

8. **Performance Considerations**
   - Particle count scales with viewport (max 50 particles)
   - Canvas resizes on window resize
   - Visibility API to pause particles when tab is hidden
   - requestAnimationFrame for smooth animation
   - Debounced completion rendering

---

### Fragile Areas (High Regression Risk)

| Risk | Impact | Current Mitigation | Redesign Risk |
|------|--------|-------------------|---------------|
| **Window Manager State** | Critical | Direct DOM manipulation + array state | HIGH — CSS changes (animations, transitions) could break visual state |
| **Terminal Input Focus** | High | contenteditable + manual caret placement | HIGH — Caret positioning, text selection, input lag |
| **GitHub API Rate Limits** | High | localStorage cache | MEDIUM — Cache must persist across redesign |
| **Markdown Rendering** | Medium | Custom regex parser | LOW — Logic unchanged, just styling |
| **Particle Performance** | High | Canvas + requestAnimationFrame | HIGH — Mobile devices, low-spec hardware |
| **localStorage Persistence** | Medium | try/catch error handling | LOW — Browser API, should survive redesign |
| **Responsive Breakpoints** | High | Fixed pixel values, no media queries | HIGH — Redesign should formalize breakpoints (320px, 768px, 1200px) |
| **Glass Effects** | Medium | backdrop-filter + -webkit prefix | MEDIUM — Browser compatibility varies |
| **Keyboard Navigation** | High | Event listeners (Tab, Enter, Arrows, Ctrl+C) | MEDIUM — Must preserve all shortcuts |
| **Color Accent Switching** | Low | CSS data-attribute binding | LOW — Mechanism is robust |

---

## Part 2: Regression Risk Assessment

### Top 10 Things That Could Break

1. **Window Dragging & Bounds**
   - **What**: Mouse events on titlebar to drag window
   - **Current**: `mousedown` → `mousemove` → `mouseup` with position clamping
   - **Risk**: CSS changes to titlebar (height, padding, cursor) could break drag start detection
   - **Verify**: Drag all window types, verify bounds (no off-screen windows), test on mobile (no dragging)

2. **Minimize/Maximize Transitions**
   - **What**: Toggle minimized class → opacity: 0, transform: scale(0.9)
   - **Current**: `.window.minimized { opacity: 0; transform: scale(0.9); pointer-events: none; }`
   - **Risk**: Changed transitions (duration, easing) could feel broken
   - **Verify**: Min/max all windows, verify taskbar updates, restore focus correctly

3. **Terminal Caret Positioning**
   - **What**: contenteditable input with manual `document.createRange()` for caret placement
   - **Current**: `placeCaretAtEnd()` function uses Selection API
   - **Risk**: Font changes (size, family, line-height) break caret position, input feels laggy
   - **Verify**: Type in terminal, verify caret is at text end, no input lag, autocomplete still works

4. **Autocomplete Grid Layout**
   - **What**: Multi-column suggestion grid with CSS display: grid
   - **Current**: Dynamic `gridTemplateColumns: 'repeat(' + cols + ',max-content)'`
   - **Risk**: Changed font size or char width breaks column count calculation
   - **Verify**: Type partial command (e.g., "t"), press Tab twice, verify suggestions layout, verify arrow key navigation

5. **GitHub API Cache Hit**
   - **What**: Projects app caches repos in `repoCache` variable + localStorage
   - **Current**: Fetch on first open, subsequent opens use cache
   - **Risk**: API fails silently, user sees stale or missing data
   - **Verify**: Open Projects app, verify repos load, open again verify instant load, force refresh verify new data

6. **Markdown Rendering Edge Cases**
   - **What**: Custom regex-based renderer for headings, lists, code blocks, links
   - **Current**: Handles ``` code blocks, inline backticks, bold/italic, links, blockquotes, hr
   - **Risk**: Changed CSS for `<pre>`, `<code>`, `<h1>–<h6>` breaks readability
   - **Verify**: Open file manager, open README.md, verify code blocks are readable, links are blue, headings are bold

7. **Particle Animation Performance**
   - **What**: Canvas particle system with mouse interaction, ~50 particles max
   - **Current**: Draws lines between particles < 150px apart, updates on mousemove
   - **Risk**: Low-end mobile devices lag, particles don't render, animation stalls
   - **Verify**: Open on mobile (320px), verify particles animate, disable particles in settings, verify smooth

8. **Settings localStorage Persistence**
   - **What**: User accent color and UI toggles persisted to localStorage
   - **Current**: Loaded on boot via `loadSettings()`, error-safe
   - **Risk**: localStorage full or disabled, settings lost, user reverts to defaults
   - **Verify**: Change theme to green, reload page, verify green persists, change to blue, verify persists

9. **Window Taskbar Button Sync**
   - **What**: Taskbar buttons update when window state changes (open, minimize, close, focus)
   - **Current**: `updateTaskbar()` called after every window operation
   - **Risk**: Taskbar out of sync with actual windows, buttons don't respond, focus lost
   - **Verify**: Open 3 windows, minimize middle one, verify taskbar shows correct state, click middle button, verify restores

10. **Responsive Glass Effects on Mobile**
   - **What**: Glassmorphism with `backdrop-filter: blur(8px)` across taskbar, windows, launcher
   - **Current**: Uses `-webkit-backdrop-filter` fallback
   - **Risk**: Mobile browsers don't support or disable blur, glass looks flat
   - **Verify**: Open on iOS/Android, verify blur renders, verify UI still readable, test without blur fallback

---

## Part 3: Critical Path Testing (Priority Order)

### Tier 1: Core Functionality (Test First)

#### 1. Window Manager — Drag, Minimize, Maximize, Close, Focus
**Acceptance Criteria:**
- [ ] Drag titlebar → window moves, stops at screen bounds, doesn't go off-screen
- [ ] Double-click titlebar → window maximizes (fills screen), minimize button shows restore
- [ ] Double-click again → window restores to original size/position
- [ ] Click close button → window closes, removed from taskbar
- [ ] Click minimize button → window minimizes (becomes small/translucent), taskbar shows "minimized" state
- [ ] Click minimized taskbar button → window restores and gains focus
- [ ] Click background window → it gains focus, becomes "focused" (accent border)
- [ ] Z-index increases with each click (windows bring to front)

**Test Environment:**
```bash
# Desktop: 1920x1080
# Open: Terminal, Files, Projects (3 windows)
- Drag Terminal to top-left
- Minimize Files
- Click Minimize → Files fades out
- Click Files taskbar button → Files restores
- Click Terminal → Terminal gains focus (accent border)
- Drag maximize button on Projects → Projects fills screen
- Double-click titlebar → back to normal size
```

**Mobile Test (320px):**
- [ ] Windows are readable (not too small)
- [ ] Taskbar buttons stack or scroll (don't overflow)
- [ ] Drag still works (touchmove)

---

#### 2. Terminal — Commands, History, Autocomplete
**Acceptance Criteria:**
- [ ] Type "help" → prints help text
- [ ] Type "about" → prints profile info
- [ ] Type "skills" → lists skills by category
- [ ] Type "contact" → prints contact links
- [ ] Type "clear" → clears output
- [ ] Type "theme green" → changes accent to green, persists on reload
- [ ] Type "launch projects" → opens Projects window
- [ ] Press Up arrow → previous command recalled
- [ ] Press Up twice → goes back 2 commands
- [ ] Press Down arrow → goes forward in history
- [ ] Type "t", press Tab → autocompletes to "terminal" (if available)
- [ ] Type "t", press Tab, Tab → shows all matches starting with "t"
- [ ] Press Escape → clears autocomplete menu
- [ ] Ctrl+C → cancels input, shows ^C
- [ ] Ctrl+L → clears output

**Test Environment:**
```bash
# Boot terminal
- Type "help" → verify output
- Type "skills" → verify 5 categories shown
- Type "theme amber" → verify color changes
- Reload page → verify theme persists
- Type "cli" (partial), Tab → autocompletes to "clear" (if unique)
- Type "c", Tab, Tab → shows "clear", "contact", "close"
- Type "projects" → window opens
```

**Mobile Test:**
- [ ] Keyboard appears on input focus
- [ ] Can type commands
- [ ] Autocomplete menu fits on screen
- [ ] No horizontal scroll needed

---

#### 3. File Manager — Navigation, Markdown Rendering
**Acceptance Criteria:**
- [ ] Double-click "/home/user" → lists files (about.txt, skills.json, contact.md, projects dir)
- [ ] Double-click "about.txt" → opens viewer, shows content
- [ ] Click back button → returns to file list
- [ ] Click breadcrumb "/" → goes to root
- [ ] Click "/home" breadcrumb → goes to /home
- [ ] Navigate to /home/user/projects → fetches GitHub repos (if available)
- [ ] Double-click repo → opens README.md (if available)
- [ ] Markdown rendering: headings are bold, code blocks have dark background, links are blue
- [ ] JSON files are pretty-printed with indentation
- [ ] Back button on README returns to repo list

**Test Environment:**
```bash
# Open File Manager
- Double-click "/home/user" → lists content
- Double-click "about.txt" → content visible
- Click back → returns to file list
- Click sidebar "home" → navigates to /home
- Click "/home/user" breadcrumb → back to user
- Navigate to projects → should show repos or "Loading..." message
```

**Mobile Test:**
- [ ] File list is scrollable
- [ ] Double-click works (or long-press alternative)
- [ ] Sidebar is accessible (drawer or always visible)
- [ ] Viewer doesn't have horizontal scroll

---

#### 4. GitHub Integration (Projects App) — API Fetch, Sorting, Caching
**Acceptance Criteria:**
- [ ] Open Projects app → fetches repos from GitHub API (shows spinner)
- [ ] Repos display with icon, name, description, stars, language dot, updated time
- [ ] "Sort: Updated" → repos sorted by most recently updated first
- [ ] "Sort: Stars" → repos sorted by highest stars first
- [ ] "Sort: Name" → repos sorted A-Z
- [ ] "Sort: Language" → repos grouped by language
- [ ] Archived repos show "ARCHIVED" badge
- [ ] Fork repos show "FORK" badge
- [ ] Click repo row (not link) → opens repo in browser window
- [ ] Click GitHub link → opens in external browser (_blank)
- [ ] Close Projects, reopen → repos load instantly (cached)
- [ ] If API fails → shows error message with retry option

**Test Environment:**
```bash
# Network: Online
- Open Projects app
- Verify repos load (spinner → content)
- Click "Sort: Stars" → re-sort
- Click "Sort: Name" → re-sort
- Click repo row → opens in browser window (iframe or fallback)
- Close app, reopen → instant load (cache hit)

# Network: Offline (DevTools throttle)
- Open Projects app → should show cache from before, or "Could not load..."
```

**Rate Limit Handling:**
- [ ] GitHub API returns 403 → display error, suggest opening manually
- [ ] localStorage cache expires or is absent → display loading state

---

#### 5. Settings — localStorage Persistence, Accent Color
**Acceptance Criteria:**
- [ ] Open Settings app → shows current theme and toggle options
- [ ] Change theme to "Green" → applies immediately, accent becomes green
- [ ] Toggle "Particles" off → particles disappear (canvas hidden)
- [ ] Toggle "Grid" off → grid overlay disappears
- [ ] Reload page → all settings persist (theme is green, particles off, grid off)
- [ ] Clear localStorage → settings revert to defaults on reload
- [ ] localStorage is disabled/full → settings lost, error caught gracefully

**Test Environment:**
```bash
# Desktop
- Open Settings
- Click "Green" theme → accent changes to green
- Toggle "Particles Off" → particles disappear
- Reload page → verify green persists, particles still hidden
- Open DevTools → Application → localStorage → verify `a0os_settings` contains correct values
- Delete `a0os_settings` → reload → reverts to defaults
```

---

#### 6. Responsive Layout — Mobile (320px), Tablet (768px), Desktop (1200px+)
**Acceptance Criteria:**

**Mobile (320px):**
- [ ] Taskbar buttons are readable (not cut off)
- [ ] Windows fit within viewport
- [ ] Scrollbars visible inside windows
- [ ] Text is readable (font size ≥ 11px)
- [ ] No horizontal scrolling at root level
- [ ] Launcher menu fits on screen
- [ ] Particles don't lag (optional disable)

**Tablet (768px):**
- [ ] 2–3 windows can be tiled (not overlapping)
- [ ] File manager sidebar is visible
- [ ] Terminal is readable

**Desktop (1200px+):**
- [ ] 4+ windows can be open and arranged
- [ ] Particles render smoothly
- [ ] No layout shifts

**Test Environment:**
```bash
# DevTools responsive mode
- Set to 320px width
  - Open Terminal, Files, Projects
  - Verify all readable, no horizontal scroll
- Set to 768px width
  - Open 2 windows side-by-side
  - Verify both visible, content readable
- Set to 1920px width
  - Open 4 windows
  - Verify all visible, no overlap
```

---

### Tier 2: Visual Consistency (Test After)

#### 7. Typography — Hierarchy, Readability, Consistency
**Acceptance Criteria:**
- [ ] Window titles are smaller than terminal input (var(--font-size-sm) < var(--font-size))
- [ ] Headings in markdown (h1–h6) have clear hierarchy
- [ ] Code blocks use monospace, darker background
- [ ] Links are blue, no underline (on hover, underline appears)
- [ ] Terminal text is aligned left, monospace
- [ ] No text is cut off (ellipsis or wrapping)
- [ ] Font is consistent (Cascadia Code or fallback)

**Test Environment:**
```bash
# Terminal
- Boot animation text is readable
- Commands are aligned
- Output doesn't overflow

# File Manager
- Open README.md with headers
- Verify h1 > h2 > h3 visually
- Verify code blocks are readable

# Projects
- Repo descriptions wrap correctly
- Language tag is visible
- Star count is right-aligned
```

---

#### 8. Color Contrast — WCAG AA Minimum
**Acceptance Criteria:**
- [ ] Text color (--text-primary: #e6edf3) on surface (--surface: #161b22): ≥4.5:1 ratio
- [ ] Links (--blue: #58a6ff) on surface: ≥4.5:1 ratio
- [ ] Accent borders (var(--accent)) visible against surface

**Test Environment:**
```bash
# Tools: WebAIM Color Contrast Checker
- Test #e6edf3 (text) on #161b22 (surface)
- Test #58a6ff (links) on #161b22 (surface)
- Test #a855f7 (accent) on #0a0a0a (background)
```

**WCAG AA Compliance:** (Note: Full WCAG validation requires manual testing with screen readers and assistive tech)

---

#### 9. Glass Effects — Glassmorphism, Blur Rendering
**Acceptance Criteria:**
- [ ] Taskbar has frosted glass appearance (backdrop-filter: blur(8px))
- [ ] Launcher menu has glass effect
- [ ] Windows have glass effect on titlebar
- [ ] Effect renders without visual artifacts
- [ ] On browsers without backdrop-filter support, fallback to solid bg

**Test Environment:**
```bash
# Desktop: Chrome, Firefox, Safari
- Open DevTools → check backdrop-filter applied
- Verify blur effect visible (compare to background)

# Mobile: iOS Safari, Chrome Android
- Open and inspect if backdrop-filter renders
- If not supported, verify fallback bg color is visible
```

---

#### 10. Animations — Smoothness, No Layout Shift
**Acceptance Criteria:**
- [ ] Window transitions (focus/unfocus) are smooth (transition: 0.2s)
- [ ] Minimize/maximize animation completes without stutter
- [ ] Particle animation at 60fps (no frame drops)
- [ ] No layout shift when window state changes (position, z-index stable)
- [ ] Hover states respond instantly (no lag)

**Test Environment:**
```bash
# DevTools Performance tab
- Record while dragging window
- Verify 60fps or close (no red frames)
- Record while minimizing window
- Verify smooth animation

# Lighthouse
- Measure CLS (Cumulative Layout Shift) — should be < 0.1
```

---

## Part 4: Detailed QA Checklist (Post-Implementation)

### Functionality Tests

- [ ] **Window Manager**
  - [ ] Drag window by titlebar
  - [ ] Drag doesn't work from control buttons
  - [ ] Drag stops at screen edges (no off-screen windows)
  - [ ] Minimize button → window fades out
  - [ ] Minimize again → window disappears from taskbar
  - [ ] Maximize button → window fills screen
  - [ ] Maximize again → window restores to previous size
  - [ ] Close button → window closes, removed from taskbar
  - [ ] Click window → gains focus (accent border)
  - [ ] Previous focused window loses accent border
  - [ ] Taskbar shows only open (non-closed) windows
  - [ ] Taskbar button for minimized window shows "minimized" state
  - [ ] Click minimized taskbar button → window restores
  - [ ] Z-index increases on each window click (top window always visible)

- [ ] **Terminal**
  - [ ] Boot animation plays (typing effect)
  - [ ] Input accepts keypresses
  - [ ] Enter executes command
  - [ ] "help" command shows available commands
  - [ ] "about" command shows profile
  - [ ] "skills" command shows all skill categories
  - [ ] "contact" command shows contact links
  - [ ] "clear" command clears output
  - [ ] "theme <color>" changes accent (green, blue, purple, amber)
  - [ ] Theme change persists on reload
  - [ ] "launch <app>" opens application
  - [ ] "close <app>" closes application
  - [ ] "apps" lists available applications
  - [ ] Unknown command shows error
  - [ ] Up arrow recalls previous command
  - [ ] Up arrow twice goes back 2 commands
  - [ ] Down arrow goes forward in history
  - [ ] Tab autocompletes command (if unique)
  - [ ] Tab, Tab shows all matches
  - [ ] Arrow keys navigate suggestions
  - [ ] Escape clears suggestions
  - [ ] Ctrl+C cancels input, shows ^C
  - [ ] Ctrl+L clears output
  - [ ] Input focuses on click inside terminal

- [ ] **File Manager**
  - [ ] Double-click folder → navigates into it
  - [ ] Double-click file → opens viewer
  - [ ] Back button returns to previous folder
  - [ ] Breadcrumb navigation works (click "/" → root, "/home" → home, etc.)
  - [ ] Sidebar shows folder hierarchy
  - [ ] Clicking sidebar folder navigates to it
  - [ ] Current folder highlighted in sidebar
  - [ ] .txt files display as plain text
  - [ ] .md files render as markdown (headers bold, code blocks, links)
  - [ ] .json files pretty-print with indentation
  - [ ] Unknown file types show raw content
  - [ ] Projects folder shows GitHub repos
  - [ ] Clicking repo opens in browser window
  - [ ] README.md displays correctly
  - [ ] Back button on README returns to repo list
  - [ ] "Open on GitHub" link opens in external browser
  - [ ] Sidebar active state follows current path

- [ ] **Projects App**
  - [ ] Repo list fetches from GitHub API
  - [ ] Spinner shows during fetch
  - [ ] Repos display name, description, language, stars, updated time
  - [ ] Language dot color matches language (Go=cyan, Rust=brown, JS=yellow, etc.)
  - [ ] "Sort: Updated" → sorted by most recent
  - [ ] "Sort: Stars" → sorted by highest stars
  - [ ] "Sort: Name" → sorted A-Z
  - [ ] "Sort: Language" → sorted by language
  - [ ] Archived repos show "ARCHIVED" badge
  - [ ] Forked repos show "FORK" badge
  - [ ] Private repos show lock icon
  - [ ] Public repos show folder icon
  - [ ] Click repo row → opens in browser window
  - [ ] Click GitHub link → opens in _blank external browser
  - [ ] Close app, reopen → repos load instantly (cache hit)
  - [ ] If API fails → error message shown
  - [ ] Repo count matches fetched repos

- [ ] **Settings**
  - [ ] Theme selector shows current accent
  - [ ] Clicking theme changes accent immediately
  - [ ] Particles toggle hides/shows canvas
  - [ ] Grid toggle hides/shows grid overlay
  - [ ] Settings persist on reload (localStorage)
  - [ ] Settings apply on boot (no flash of old settings)
  - [ ] Clear localStorage → defaults load on reload

- [ ] **Browser**
  - [ ] iframe loads safe URLs
  - [ ] Blocked URLs (GitHub) show fallback card
  - [ ] Fallback card shows repo info (if repo data available)
  - [ ] "Open in Browser" button opens in _blank
  - [ ] Back button navigates history
  - [ ] Forward button navigates history
  - [ ] Refresh button reloads iframe
  - [ ] URL bar shows current URL

- [ ] **System Info**
  - [ ] Shows OS, Host, Kernel, Uptime, Shell, Resolution, Theme
  - [ ] Uptime updates every second
  - [ ] All fields match config

---

### Visual Tests

- [ ] **Typography**
  - [ ] Window titles smaller than body text
  - [ ] Markdown h1–h6 hierarchy visible
  - [ ] Code blocks have monospace font, dark background
  - [ ] Links are blue, no decoration
  - [ ] Hover on link shows underline
  - [ ] Terminal text is monospace, left-aligned
  - [ ] No text overflow or cut-off (ellipsis or wrap)

- [ ] **Colors**
  - [ ] Text contrast ≥4.5:1 (WCAG AA)
  - [ ] Links contrast ≥4.5:1
  - [ ] Accent color visible on surface
  - [ ] Accent changes all instances (taskbar, buttons, borders, particles)
  - [ ] Dark mode is consistent (no light colors on dark background)

- [ ] **Spacing**
  - [ ] Padding inside windows is consistent (10px default)
  - [ ] Gap between elements is consistent (6–8px)
  - [ ] Taskbar items have equal spacing
  - [ ] Desktop icons aligned in grid

- [ ] **Glass Effects**
  - [ ] Taskbar has frosted blur (on supported browsers)
  - [ ] Launcher menu has glass effect
  - [ ] Window titlebar has glass effect
  - [ ] Fallback for unsupported browsers (solid background)

- [ ] **Focus States**
  - [ ] Focused window has accent border
  - [ ] Focused window is on top (highest z-index)
  - [ ] Unfocused windows have gray border
  - [ ] Buttons have hover state (background changes)
  - [ ] Buttons have active state (darker)

- [ ] **Transitions**
  - [ ] Window state changes are smooth (0.15–0.2s)
  - [ ] Minimize animation is fluid
  - [ ] Maximize animation is fluid
  - [ ] Hover effects respond instantly
  - [ ] No layout shift on transitions

---

### Accessibility Tests

- [ ] **Keyboard Navigation**
  - [ ] Tab key moves focus (desktop icons → taskbar items → windows)
  - [ ] Enter opens focused item
  - [ ] Escape dismisses menus (launcher)
  - [ ] Terminal keyboard shortcuts work (Tab, Enter, Ctrl+C, Ctrl+L, arrows)
  - [ ] All buttons are focusable
  - [ ] Focus visible (outline or highlight)

- [ ] **Screen Reader Support** (Manual test with NVDA/JAWS/VoiceOver)
  - [ ] Launcher button announced as "Applications Menu"
  - [ ] Window control buttons announced (Close, Maximize, Minimize)
  - [ ] Terminal input announced as "textbox"
  - [ ] aria-live="polite" on terminal output announces new commands
  - [ ] File list items announced with type (file or folder)
  - [ ] Repo list items announced with name, description, stats

- [ ] **Color Not Sole Indicator**
  - [ ] Archived repos have "ARCHIVED" text badge (not just color)
  - [ ] Forked repos have "FORK" text badge
  - [ ] Links have underline on hover (not just color)

- [ ] **ARIA Labels**
  - [ ] All interactive elements have labels or title attributes
  - [ ] Particles canvas has aria-hidden="true"
  - [ ] Grid overlay has aria-hidden="true"

---

### Performance Tests

- [ ] **Load Time**
  - [ ] Initial page load < 3 seconds (with network throttle)
  - [ ] Particles initialize smoothly (not blocking)
  - [ ] Terminal boot animation plays without lag

- [ ] **Animation Performance**
  - [ ] Particles animate at ≥55fps (DevTools Performance)
  - [ ] Particle count scales on mobile (≤25 on 320px width)
  - [ ] Dragging window smooth (no frame drops)
  - [ ] Minimize/maximize animation smooth

- [ ] **Memory**
  - [ ] Opening/closing windows doesn't leak memory
  - [ ] GitHub API response cached in memory
  - [ ] Particle count capped (max 50)

- [ ] **Network**
  - [ ] GitHub API called only on first Projects open (cached after)
  - [ ] README fetch tries main, then master branch
  - [ ] Failed API call shows error (not blank page)

---

### Browser Compatibility

- [ ] **Chrome (latest)**
  - [ ] All features work
  - [ ] Backdrop-filter renders
  - [ ] iframe sandbox works

- [ ] **Firefox (latest)**
  - [ ] All features work
  - [ ] Backdrop-filter fallback (solid bg)
  - [ ] iframe sandbox works

- [ ] **Safari (latest)**
  - [ ] All features work
  - [ ] Backdrop-filter renders (with -webkit prefix)
  - [ ] iframe sandbox works

- [ ] **Edge (latest)**
  - [ ] All features work
  - [ ] Backdrop-filter renders

- [ ] **Mobile Chrome (Android)**
  - [ ] Touch drag works
  - [ ] Terminal input works
  - [ ] Particles optional (disable if laggy)

- [ ] **Mobile Safari (iOS)**
  - [ ] Touch drag works
  - [ ] Terminal input works
  - [ ] Particles optional

---

### Console & Network Errors

- [ ] **No Console Errors**
  - [ ] Open DevTools Console
  - [ ] Perform all interactions (drag, click, type, open app)
  - [ ] No red errors logged
  - [ ] Warnings acceptable (deprecation notices)

- [ ] **Network Errors Handled**
  - [ ] GitHub API 403 (rate limit) → error message, not crash
  - [ ] GitHub API 404 (user not found) → error message
  - [ ] README fetch fails → "No README found" message
  - [ ] iframe blocked → fallback card shown

- [ ] **localStorage Errors Handled**
  - [ ] localStorage disabled → settings default, no error
  - [ ] localStorage full → settings default, no error

---

## Part 5: Test Environment Setup

### Local Testing

```bash
# Start local server (any static server)
npx http-server . -p 8000

# Open browser
http://localhost:8000

# DevTools checklist
- Console: No errors
- Network: Monitor GitHub API calls
- Performance: Check fps during animation
- Lighthouse: Run audit
```

### Mobile Testing

```bash
# Remote debugging (Chrome)
1. Android phone, enable USB debugging
2. Chrome://inspect/#devices
3. Click "inspect" on device
4. Test touch interactions

# iOS
1. Safari on Mac + iPhone (Develop menu)
2. Test Safari-specific behaviors
```

### Responsive Testing

```bash
# DevTools Responsive Mode
- 320px (iPhone SE)
- 375px (iPhone 12)
- 768px (iPad)
- 1024px (iPad Pro)
- 1920px (Desktop)
```

### GitHub API Testing

```bash
# Rate limit: 60 requests/hour (unauthenticated)

# Simulate failure
- DevTools > Network > Throttle > Offline
- Open Projects app
- Should show cached data or "Could not load..." error

# Check cache
- DevTools > Application > Local Storage
- Look for a0os_settings, a0os_repos_cache
```

### Performance Testing

```bash
# Lighthouse audit
1. DevTools > Lighthouse
2. Categories: Performance, Accessibility, Best Practices
3. Target: Performance > 80, Accessibility > 90

# Chrome DevTools Performance
1. Open DevTools > Performance
2. Click Record
3. Drag window, minimize, open apps
4. Stop recording
5. Check for dropped frames (red), FPS > 55

# Mobile simulation
1. DevTools > Device Emulation > Throttle CPU (4x)
2. Re-test performance with simulated low-end device
```

---

## Part 6: Known Risks & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **GitHub API Rate Limit (60/hour)** | High | Cache repos in localStorage, show cached data if rate-limited |
| **localStorage Disabled** | Medium | Gracefully default to hardcoded settings, catch errors |
| **Backdrop-filter Not Supported** | Medium | Provide solid bg fallback, test on browsers without support |
| **Particle Performance on Mobile** | High | Scale particle count by device width, allow toggle in settings |
| **Window Drag on Touchscreen** | Medium | Test touch events, may need polyfill or fallback |
| **Markdown Rendering Breaks** | Low | Keep existing regex parser, only style changes |
| **Focus Management Bug** | High | Test z-index, focus order with multiple windows |
| **Terminal Input Lag** | High | Profile contenteditable, consider replacing if needed |
| **Responsive Breakpoint Miss** | Medium | Test all breakpoints (320, 768, 1200, 1920), document in CSS |
| **ARIA Labels Missing** | Medium | Audit all interactive elements, test with screen reader |

---

## Part 7: Sign-Off Criteria

### Pre-Implementation
- [ ] Codebase reviewed (window manager, terminal, file manager, GitHub integration)
- [ ] Fragile areas identified (drag, caret, particles, responsive)
- [ ] Risk assessment complete

### Post-Implementation
- [ ] All Tier 1 critical path tests pass (window manager, terminal, file manager, GitHub, settings, responsive)
- [ ] All visual tests pass (typography, colors, spacing, glass effects)
- [ ] All accessibility tests pass (keyboard nav, ARIA labels, contrast)
- [ ] All performance tests pass (FPS, load time, no memory leak)
- [ ] No console errors
- [ ] Lighthouse score ≥80 Performance, ≥90 Accessibility
- [ ] All browsers tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile tested (iOS, Android, 320–768px)
- [ ] QA sign-off complete

---

## Appendix: Test Data

### Terminal Commands to Test
```
help
about
skills
contact
clear
theme green
theme blue
theme purple
theme amber
launch terminal
launch files
launch projects
launch settings
close terminal
apps
desktop
```

### File Paths to Test
```
/
/home
/home/user
/home/user/about.txt
/home/user/skills.json
/home/user/contact.md
/home/user/projects
/etc
/etc/hostname
/var/log
/var/log/system.log
```

### GitHub Repos to Verify (1tzArad)
- Fetch from: https://api.github.com/users/1tzArad/repos?sort=updated&per_page=100

### Settings Values to Test
```
accentColor: 'purple' (default) → 'green', 'blue', 'amber'
particlesEnabled: true → false
gridEnabled: true → false
```

---

**QA Plan Version:** 1.0  
**Last Updated:** 2026-10-11  
**Next Review:** Upon completion of frontend redesign

