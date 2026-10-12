# QA QUICK REFERENCE — Frontend Implementation Companion

## At a Glance

**You are here:** CSS redesign phase  
**Your role:** Implement cyan glassmorphism design system  
**QA role:** Validate before/after, catch regressions  
**Timeline:** 6-10 hours implementation + 8-11 hours QA validation  

---

## 🚨 CRITICAL CONSTRAINTS (Don't Break These)

### 1. Z-Index Hierarchy
```
DO NOT insert z-index values between these:
0   ← particle canvas
1   ← grid overlay
2   ← desktop icons
10  ← windows
100 ← taskbar
200 ← menus/modals
```
**Why:** Particles will appear on top of windows, or windows behind desktop. **How to fix:** Use exact values. No 5, 15, 50, etc.

### 2. Terminal Input Layout
```
Input is contenteditable with manual caret management.
DON'T change: padding, font-size, line-height on .term-prompt or .term-input
```
**Why:** Caret position and text alignment breaks. **How to test:** Type command after CSS change, verify caret visible.

### 3. File Manager Sidebar Width
```
Current: 180px
Minimum tablet (768px): 140px
Minimum mobile (375px): 100px
```
**Why:** Text overflows if narrower. **How to test:** Navigate folders at each breakpoint, check text fits.

### 4. Markdown CSS Hierarchy
```
.md-body h1, h2, h3, h4, h5, h6 styles control heading readability
DON'T drastically change font sizes
```
**Why:** Hierarchy becomes unclear. **How to test:** Open contact.md file, verify headings readable.

### 5. GitHub API Rate Limit
```
60 requests/hour without auth token
Each Projects window open = 1 API call
After 60 fetches in 1 hour: 403 Forbidden
```
**Why:** Users can't open Projects window. **How to test:** Don't worry in dev (won't hit limit). Document fallback.

---

## 🎨 DESIGN SYSTEM VALUES (Copy-Paste Ready)

### Colors
```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #0d1117;
  --bg-tertiary: #161b22;
  --bg-light: #1c2333;
  
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --text-tertiary: #6e7681;
  
  --accent-primary: #06d6ff;      /* cyan (NEW) */
  --accent-dim: rgba(6,214,255,0.12);
  
  --accent-success: #10b981;
  --accent-warning: #fbbf24;
  --accent-error: #ef4444;
}
```

### Glass Effects (3 Tiers)
```css
/* Light: inputs, subtle */
backdrop-filter: blur(8px);
background: rgba(255,255,255,0.06);
border: 1px solid rgba(255,255,255,0.12);

/* Medium: windows, cards (CURRENT) */
backdrop-filter: blur(12px);
background: rgba(255,255,255,0.06);
border: 1px solid rgba(255,255,255,0.12);
box-shadow: 0 8px 32px rgba(0,0,0,0.1), 
            inset 0 1px 0 rgba(255,255,255,0.1);

/* Heavy: modals, overlays */
backdrop-filter: blur(16px);
background: rgba(255,255,255,0.08);
border: 1px solid rgba(255,255,255,0.12);
box-shadow: 0 16px 48px rgba(0,0,0,0.25), 
            inset 0 1px 0 rgba(255,255,255,0.1);
```

### Spacing Scale
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;
--space-lg: 16px;
--space-xl: 24px;
--space-2xl: 32px;
--space-3xl: 48px;
--space-4xl: 64px;
```

### Border Radius
```css
--radius-sm: 4px;         /* buttons */
--radius-md: 8px;         /* current default */
--radius-lg: 12px;        /* cards (UPDATE THIS) */
--radius-xl: 16px;        /* large sections */
--radius-full: 9999px;    /* circular */
```

### Typography (System Fonts)
```css
--font-display: 'Inter', 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
--font-mono: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', monospace;

--text-h1: 48px;   /* 700 weight */
--text-h2: 32px;   /* 700 weight */
--text-h3: 24px;   /* 600 weight */
--text-h4: 18px;   /* 600 weight */
--text-body: 15px; /* 400 weight, 1.6 line-height */
--text-small: 13px;   /* 400 weight */
--text-caption: 12px; /* 400 weight */
--text-code: 13px;    /* monospace, 1.5 line-height */
```

### Transitions
```css
--transition-fast: 150ms ease-out;
--transition-normal: 300ms ease-out;
--transition-slow: 500ms ease-out;
```

---

## ✅ FRAGILE AREAS NEEDING EXTRA CARE

| Component | Risk | Test After CSS Change |
|-----------|------|----------------------|
| Terminal input | 🟠 MEDIUM | Type "help" + Enter, verify caret visible, text aligned |
| Completion grid | 🟠 MEDIUM | Type "hel" + TAB, verify columns match output width |
| File manager sidebar | 🟠 MEDIUM | Navigate at 768px, 375px, verify text doesn't overflow |
| Markdown styles | 🟠 MEDIUM | Open contact.md, verify h1/h2/code readable |
| Settings accent | 🟠 MEDIUM | Change color, reload, verify localStorage updated |
| Particle z-index | 🟢 LOW | Verify particles behind windows, not on top |
| Window drag bounds | 🟢 LOW | Drag window, stays in viewport |
| Responsive breaks | 🟠 MEDIUM | Test at 320, 640, 768, 960, 1280px |

---

## 🧪 TEST LOCALLY (Quick Validation)

### Terminal Input Test
```
1. Double-click Terminal icon
2. Type: help
3. Press: Enter
4. VERIFY: 
   - [ ] Caret visible (blinking line)
   - [ ] Text aligns with prompt
   - [ ] Command output displays
   - [ ] Prompt reappears
   - [ ] No console errors
```

### Markdown Rendering Test
```
1. Double-click Files icon
2. Click: contact.md
3. Viewer shows markdown content
4. VERIFY:
   - [ ] H1 "Contact" displays
   - [ ] Bullet list visible
   - [ ] Links are cyan (accent color)
   - [ ] Layout readable
   - [ ] No horizontal scroll
```

### Settings Persistence Test
```
1. Double-click Settings icon
2. Click: cyan swatch (if added)
3. All UI updates to cyan
4. Close window
5. Reload page (F5)
6. VERIFY:
   - [ ] Accent still cyan
   - [ ] Settings window shows cyan swatch active
   - [ ] All windows use cyan accent
```

### Mobile Test
```
1. DevTools (F12) → Device toolbar (Cmd+Shift+M)
2. Select: iPhone SE (375x667)
3. Reload page
4. VERIFY:
   - [ ] No horizontal scroll
   - [ ] Icons visible
   - [ ] Text readable (not tiny)
   - [ ] Double-click Terminal works
   - [ ] Window fits viewport
```

---

## 📋 CHECKLIST FOR EACH CSS PHASE

### After Phase 1 (CSS Variables)
- [ ] All colors updated (background, text, accent)
- [ ] No old accent (purple) remaining
- [ ] Terminal still uses monospace font
- [ ] Glass blur values correct (8/12/16px)

### After Phase 2 (Component Styling)
- [ ] Windows have 12px radius (softer)
- [ ] Buttons styled correctly
- [ ] Terminal input layout unchanged (caret test)
- [ ] File manager markdown readable
- [ ] Hover/focus states work

### After Phase 3 (Layout & Responsive)
- [ ] No horizontal scroll at 320px
- [ ] Breakpoints trigger at 640/960/1280px
- [ ] Touch targets ≥44px on mobile
- [ ] Windows sized appropriately per viewport

### After Phase 4 (Animations)
- [ ] Hover: scale 1.02, shadow, border brighten
- [ ] Focus: 2px ring (cyan), visible
- [ ] Active: scale 0.98
- [ ] Transitions smooth (150-300ms)

### After Phase 5 (Accessibility)
- [ ] Tab navigation works
- [ ] Focus ring visible on all elements
- [ ] Color contrast ≥4.5:1
- [ ] Motion respects prefers-reduced-motion

---

## 🚀 IMPLEMENTATION WORKFLOW

```
1. UPDATE CSS VARIABLES
   - Colors, glass, typography, spacing, radius
   - Verify colors in DevTools
   
2. UPDATE COMPONENT STYLES
   - Windows, buttons, inputs, cards
   - Keep terminal input unchanged
   - Test after each major change
   
3. UPDATE LAYOUT
   - Responsive breakpoints
   - Window sizing per viewport
   - No overflow at 320px
   
4. ADD ANIMATIONS
   - Hover, focus, active states
   - Transitions smooth
   - Particle z-index correct
   
5. VERIFY ACCESSIBILITY
   - Keyboard nav
   - Color contrast
   - Motion preferences
   
6. RUN LOCAL TESTS
   - Terminal works
   - Markdown renders
   - Settings persist
   - Mobile responsive
   
7. COMMIT & PUSH
   - Clear commit message
   - Reference this guide if needed
```

---

## 🔍 HOW QA VALIDATES YOU

### Pre-Redesign Baseline (1 hour)
QA captures BEFORE metrics:
- Screenshots (1920x1080, 768x1024, 375x667)
- Lighthouse audit (Performance, Accessibility, Best Practices, SEO)
- Console errors count
- Performance metrics (LCP, FCP, CLS)

### Post-Redesign Validation (8-11 hours)
QA compares BEFORE vs. AFTER:
- **Visual:** Colors, glass, typography, spacing, radius match spec
- **Functional:** Terminal, file manager, GitHub API, settings all work
- **Responsive:** No overflow, readable, touchable at all breakpoints
- **Accessibility:** Keyboard nav, focus visible, contrast WCAG AA
- **Performance:** Lighthouse ≥85, no regression
- **Cross-browser:** Chrome, Firefox, Safari, Edge latest

### Sign-Off Criteria
✅ **PASS if:**
- All core features work (no regressions)
- Visual design matches spec
- Performance ≥85 Lighthouse
- Accessibility WCAG AA
- Mobile responsive
- Cross-browser compatible
- No P0/P1 bugs
- No console errors

❌ **FAIL if:**
- Terminal broken
- File manager broken
- GitHub API broken
- Settings don't persist
- Mobile unusable
- Contrast fails WCAG
- Multiple console errors

---

## 📞 HOW TO ASK QA FOR HELP

**During Implementation:**
- "Can you spot-check terminal input on mobile?"
- "Should I use blur(12px) or blur(16px) for cards?"
- "Is this z-index hierarchy correct?"

**Pre-Sign-Off:**
- "We're ready for baseline capture"
- "CSS phase 1 complete, please quick validation"

**After Implementation:**
- "Running full test matrix now"
- "Found issue X, working on fix"
- "Ready for sign-off"

---

## 📁 RELATED DOCUMENTS

**Read These:**
- `QA_TEST_MATRIX.md` — All 140+ test cases (use as reference)
- `QA_ASSESSMENT_REPORT.md` — Risk analysis, fragile areas detail
- `QA_EXECUTION_GUIDE.md` — Step-by-step testing procedures
- `QA_HANDOFF_DOCUMENT.md` — Full strategy & edge cases

**Keep Open:**
- This Quick Reference (bookmark it!)
- DevTools (F12)
- This repo's issues/PRs

---

## ⏱️ TIMELINE ESTIMATE

| Task | Duration | Status |
|------|----------|--------|
| CSS Variables & Colors | 1-2 hrs | To Do |
| Component Styling | 2-3 hrs | To Do |
| Layout & Responsive | 1-2 hrs | To Do |
| Animations & Interactions | 1 hr | To Do |
| Accessibility & Polish | 1-2 hrs | To Do |
| **Frontend Total** | **6-10 hrs** | **To Do** |
| | | |
| QA Baseline Capture | 1 hr | Pending Frontend |
| QA Validation | 8-11 hrs | Pending Frontend |
| QA Sign-Off | 30 min | Pending Validation |
| **QA Total** | **8-11 hrs** | **Pending** |

---

## 🎯 SUCCESS METRICS

**At the end, you'll have:**
- ✅ Black glassmorphism design system implemented
- ✅ Cyan accent applied globally
- ✅ All core features working (no regressions)
- ✅ Responsive on all devices (320px - 1920px+)
- ✅ Accessible (WCAG AA, keyboard nav, screen reader friendly)
- ✅ Performant (Lighthouse ≥85, <2.5s LCP)
- ✅ QA sign-off ready for deployment

---

**Questions? Refer to the full QA documents above or ask QA directly.**

**Ready to start? Frontend → Phase 1 CSS Variables.**

**Done? Notify QA for baseline capture → full validation → sign-off.**
