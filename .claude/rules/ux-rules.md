# .claude/rules/ux-rules.md

## ADHD-Optimized Design (LOCKED — Do Not Deviate)

This is a clinical decision, not aesthetic preference. Every rule reduces cognitive friction for ADHD users.

### Core Rules
1. **One question per screen** — Never show multiple questions
2. **4 option cards maximum** — Radio button left, label right, no sliders
3. **Progress bar always visible** — Sticky top, format: "X of Y • Z remaining"
4. **Auto-advance** — 200ms after answer selection (visual feedback required)
5. **Mobile first** — Always test mobile before desktop

### Brand Colors (Psicoprotego)
- Primary: `#2d4a3e` (Verde Bosque)
- Accent: `#8b6914` (Dorado)
- Background: `#f5f0eb` (Crema)
- Typography: Source Serif 4 (headings) + Montserrat (body)

### Animations (Functional Feedback)
All timings are functional, not decorative:
- Question enters: `fadeIn 0.6s ease-out (delay 0.2s)`
- Question rises: `translateY -50px, 0.8s ease-out (delay 0.9s)`
- Options enter: `stagger 1.8s–2.25s`
- No response after 2.8s: `options float (infinite gentle bounce)`
- Answer selected: `slideOutUp 0.4s (TikTok-style exit)`

### What NOT To Do
- NEVER show ads during test-taking (between questions)
- NEVER skip progress indicator
- NEVER use sliders instead of cards
- NEVER break mobile experience for desktop perfection
- NEVER assume user will scroll — all content must fit viewport

---

**Status:** These rules are locked. Do not debate or modify without explicit instruction.
