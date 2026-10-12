# QA Test Matrix — Desktop OS Simulator Redesign

## Phase 0: Regression Baseline (Current State)

### Window Manager
- [ ] Window creation opens at correct offsets (terminal: 0, files: 30, sysinfo: 60, projects: 70, settings: 90)
- [ ] Drag window by titlebar — bounds stay within viewport
- [ ] Minimize toggles minimized class, removes from focus
- [ ] Maximize: saves prev state, expands to full viewport (minus taskbar)
- [ ] Close removes window, calls lifecycle cleanup
- [ ] Focus on click brings window to top (z-index increments)
- [ ] Multiple windows: only one has `.focused` class and focused border
- [ ] Taskbar updates dynamically as windows open/close
- [ ] Browser window allows multiple instances (others don't)
- [ ] Window resize constraints: min-width 280px, min-height 160px

### Terminal
- [ ] Boot animation: "A0/OS Terminal v2.0" + "Type 'help'" displays on startup
- [ ] Input accepts text, contenteditable works
- [ ] Enter executes command, adds to history, clears input
- [ ] History navigation: ArrowUp/ArrowDown, wraps at ends
- [ ] Tab completion: single match auto-fills, multiple shows grid
- [ ] ArrowLeft/Right navigate suggestions in completion grid
- [ ] Escape closes completion
- [ ] Ctrl+C cancels input, prints "^C"
- [ ] Ctrl+L clears output
- [ ] Commands execute:
  - `help` — shows command list
  - `about` — displays profile (name, title, location, email, website, summary)
  - `skills` — lists categories and items from config
  - `contact` — shows email, GitHub, Telegram links
  - `projects` / `repos` / `github` — opens Projects window
  - `launch <app>` — opens app by ID
  - `close <app>` — closes app window
  - `apps` — lists available applications
  - `theme <color>` — changes accent (green/blue/purple/amber)
  - `clear` — clears output
  - `desktop` — shows desktop subcommands
- [ ] Links are clickable (mailto:, https://, t.me/)
- [ ] Output scrolls automatically
- [ ] Cwd displays in prompt (starts as ~)

### File Manager
- [ ] Virtual filesystem mounts at `/home/user`, `/etc`, `/var`
- [ ] Sidebar shows directory tree (Projects marked as dynamic)
- [ ] Pathbar shows breadcrumb navigation
- [ ] File list displays files with icons and sizes
- [ ] Click file shows viewer below list (markdown rendering if `.md`)
- [ ] Markdown renders: headings, paragraphs, lists, code blocks, blockquotes, links
- [ ] Archived files/repos show badge, reduced opacity on hover
- [ ] About.txt, skills.json, contact.md render correctly
- [ ] Projects folder loads GitHub repos dynamically
- [ ] Repo README displays in browser fallback (if no iframe)

### GitHub Integration (Projects Window)
- [ ] Fetches repos from `github.username` (config.js)
- [ ] Shows: name, description, language, stars, fork badge, last updated
- [ ] Repo sort dropdown works (default: updated)
- [ ] Click repo name opens GitHub link
- [ ] Archived repos show badge
- [ ] Rate limit handling: graceful fallback or error message
- [ ] Loading spinner displays during fetch
- [ ] No auth token needed (public repos only)

### Browser Window
- [ ] URL bar accepts input
- [ ] Load button attempts iframe navigation
- [ ] Fallback displays if CORS-blocked or invalid
- [ ] Fallback shows repo data if data passed in window creation
- [ ] Close button removes iframe
- [ ] Navigation buttons present but may not be functional (acceptable)

### Settings
- [ ] Accent color swatches: green, blue, purple, amber
- [ ] Click swatch changes accent, saves to localStorage
- [ ] Active swatch shows white border
- [ ] Toggle: Particles enabled/disabled
- [ ] Toggle: Grid overlay enabled/disabled
- [ ] Settings persist after page reload
- [ ] Default settings load if localStorage empty
- [ ] About section displays

### System Info
- [ ] ASCII art renders correctly
- [ ] System details display: OS, kernel, build, user, hostname
- [ ] Information is static/presentational

### Desktop Icons
- [ ] Desktop icons (Terminal, Files, System Info, Settings) present
- [ ] Double-click opens window
- [ ] Projects folder shortcut at bottom
- [ ] Icon labels visible
- [ ] Responsive: scale down on mobile

### Taskbar
- [ ] Clock updates (--:--)
- [ ] Launcher button (A0) opens/closes menu
- [ ] Menu items: Terminal, Files, Projects, System Info, Settings
- [ ] Click menu item opens window, closes menu
- [ ] Active window has highlight in taskbar
- [ ] Minimized windows show as muted in taskbar
- [ ] Click taskbar item toggles minimize/focus

### Particle System
- [ ] Canvas renders particles
- [ ] Particles move, wrap screen edges
- [ ] Mouse proximity affects particles (repel)
- [ ] Particles link when close (<150px)
- [ ] Toggle via settings disables/enables
- [ ] Resize window recreates particles
- [ ] Tab visibility pause/resume animation
- [ ] Performance: max 50 particles

### General
- [ ] Settings load on page init
- [ ] Particle system initializes
- [ ] Grid overlay shows/hides per settings
- [ ] Accent color applies to all components
- [ ] No console errors on startup
- [ ] Responsive behavior on mobile (<768px)
- [ ] Touch interactions work (no hover-only features broken)

---

## Phase 1: Visual Regression (Post-CSS Redesign)

### Colors & Glass Effects
- [ ] Background is pure black (#0a0a0a)
- [ ] Glass surfaces use correct blur values (8px, 12px, 16px)
- [ ] Glass borders opacity correct (0.12 = 1px solid rgba(255,255,255,0.12))
- [ ] Accent is cyan (#06d6ff), not previous purple
- [ ] Text contrast: primary text ≥7:1 on glass, secondary ≥6:1
- [ ] All accent colors updated (accent-dim, accent-glow)
- [ ] Grid overlay opacity reduced (if visible)
- [ ] Particle colors updated to cyan

### Typography
- [ ] Font stack loaded (system fonts, no external)
- [ ] H1/H2/H3 sizes correct (48px, 32px, 24px)
- [ ] Body text 15px, readable on 14" laptop
- [ ] Terminal font unchanged (mono stack)
- [ ] Letter spacing correct (display +0.02em)

### Layout & Spacing
- [ ] Window default sizes respect new layout (may need adjustment)
- [ ] Padding uses 4px scale (4, 8, 12, 16, 24, 32, 48)
- [ ] Gap between components consistent
- [ ] Hero section exists (if added in redesign)
- [ ] Container max-width 1200px (if applicable)
- [ ] Responsive breakpoints: 640, 960, 1280px

### Interactions
- [ ] Hover states work (scale, brightness, border)
- [ ] Focus states visible (ring, outline)
- [ ] Active states feedback
- [ ] Transitions smooth (150ms-500ms)
- [ ] Animations respect prefers-reduced-motion

### Components
- [ ] Cards have new radius (12px, not 8px)
- [ ] Buttons style updated
- [ ] Form inputs styled (if any added)
- [ ] Tags/pills styled
- [ ] Modals glass treatment

---

## Phase 2: Functional Integrity (Post-Redesign)

### Regression: All Phase 0 tests must STILL PASS
- [ ] Window manager fully functional
- [ ] Terminal executes all commands
- [ ] File manager shows all files
- [ ] GitHub integration works
- [ ] Settings persist
- [ ] Desktop icons launch apps
- [ ] Taskbar reflects state
- [ ] Particle system renders
- [ ] No console errors

### New Features (if added)
- [ ] Nav bar sticky or fixed (if added)
- [ ] Hero section interactive elements work
- [ ] Project showcase cards clickable
- [ ] Footer links functional
- [ ] Social media links open correctly

### Cross-Browser
- [ ] Chrome/Chromium latest
- [ ] Firefox latest
- [ ] Safari (macOS + iOS)
- [ ] Edge latest

### Performance
- [ ] Initial load < 3s (target)
- [ ] Window operations smooth (60fps minimum)
- [ ] Terminal typing responsive
- [ ] GitHub fetch doesn't block UI
- [ ] Particle system doesn't stutter (toggleable)
- [ ] No memory leaks after 10 min usage

### Mobile Responsiveness
- [ ] 320px width: layout doesn't break
- [ ] 640px breakpoint: columns adjust
- [ ] Touch targets ≥44px
- [ ] Keyboard doesn't push content
- [ ] Terminal usable on mobile
- [ ] File manager sidebar collapsible or stacked

### Accessibility
- [ ] All interactive elements keyboard-navigable
- [ ] Tab order logical
- [ ] Focus visible (2px ring)
- [ ] Form labels associated
- [ ] ARIA attributes correct (`aria-hidden` for decorative, `role` for custom)
- [ ] Links have meaningful text
- [ ] Color not only indicator of state
- [ ] Motion can be disabled
- [ ] Contrast ≥ 4.5:1 (WCAG AA)

### Data Integrity
- [ ] Config data (profile, skills, contact) unchanged
- [ ] localStorage structure preserved
- [ ] GitHub fetch returns expected structure
- [ ] Virtual FS unchanged
- [ ] File contents unchanged

---

## Phase 3: Known Risk Testing

### GitHub API Rate Limiting
- [ ] Fetch succeeds with > 60 repos (own account)
- [ ] Fetch fails gracefully at rate limit (error message or fallback)
- [ ] Retry mechanism exists (if applicable)
- [ ] Cached results used on subsequent opens (if implemented)

### Browser CORS Issues
- [ ] iframe fallback displays correctly
- [ ] Fallback shows project info (not blank)
- [ ] Users can still view project data (via fallback)

### Particle Performance
- [ ] Toggle particles: no visual jump
- [ ] 50 particles on 4K screen: smooth
- [ ] Mobile: particles optional, no lag when disabled
- [ ] Tab visibility: pause/resume works

### localStorage Edge Cases
- [ ] Private/incognito mode: settings don't persist (acceptable)
- [ ] localStorage full: graceful handling
- [ ] localStorage cleared: defaults load
- [ ] Corrupt JSON in localStorage: reload safely

---

## Test Environment Setup

### Devices
- Desktop: 1920x1080 (primary)
- Laptop: 1366x768
- Tablet: 768x1024 (iPad)
- Mobile: 375x667 (iPhone SE)
- Ultra-wide: 3440x1440 (optional)

### Browsers
- Chrome 130+ (latest)
- Firefox 131+ (latest)
- Safari 18+ (macOS)
- Safari Mobile (iOS 18)

### Network
- Normal (2mbps+)
- Slow 3G (simulate GitHub delay)
- Offline (test fallbacks)

### Tools
- DevTools (Elements, Console, Network, Performance)
- Accessibility Inspector (WAVE, Axe)
- Lighthouse (Performance, Accessibility, Best Practices)

---

## Sign-Off Criteria

✅ **Pass if:**
- All Phase 0 tests pass (no regressions)
- All Phase 1 visual tests pass (design system applied)
- All Phase 2 functional tests pass
- No P1 bugs (crash, data loss, broken core feature)
- ≤5 P2 bugs (visual glitch, minor UX friction)
- ≤10 P3 bugs (cosmetic, optional enhancement)
- Performance ✓ (LH score ≥85)
- Accessibility ✓ (WCAG AA, no critical issues)

❌ **Fail if:**
- Any Phase 0 test fails (regression detected)
- Functional feature broken
- Data not persisted
- GitHub integration completely broken (not just rate limited)
- Console errors on critical paths
