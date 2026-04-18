# Analytics Plan — Psicoprotego Tests

**Last updated:** 2026-04-18  
**Stack:** GTM + GA4 · Vercel Analytics

---

## 1. Measurement Goals

| Goal | Metric | Target |
|------|--------|--------|
| Test completion rate | `test_completed / test_started` | > 70% |
| Crisis detection rate | `crisis_triggered / test_completed` | Monitor (no target) |
| Result sharing rate | `result_shared / test_completed` | > 15% |
| PDF download rate | `pdf_downloaded / test_completed` | > 10% |
| Return visitors | % new vs returning sessions | Monitor |

---

## 2. Event Taxonomy

All events use GA4 custom event syntax via `trackEvent(name, params)` in `src/config/analytics.ts`.

### 2.1 Test Lifecycle Events

| Event Name | Trigger | Parameters |
|-----------|---------|------------|
| `test_started` | User lands on `/play` | `test_id`, `lang` |
| `test_question_answered` | Each question answered | `test_id`, `question_id`, `question_index`, `total_questions` |
| `test_completed` | All questions answered, score calculated | `test_id`, `lang`, `score`, `category`, `is_crisis` |
| `test_abandoned` | User leaves before completion | `test_id`, `question_index`, `total_questions` |
| `test_reset` | User clicks "Repetir test" | `test_id` |

### 2.2 Result Events

| Event Name | Trigger | Parameters |
|-----------|---------|------------|
| `result_viewed` | ResultCard renders | `test_id`, `score`, `category`, `color`, `is_crisis` |
| `crisis_triggered` | Crisis UI shown | `test_id`, `score`, `category` |
| `support_block_shown` | SupportBlock visible (redFlags or crisis) | `test_id` |
| `result_shared` | Share button clicked | `test_id`, `platform` (`whatsapp`\|`twitter`\|`copy`) |
| `pdf_downloaded` | PDF results download | `test_id`, `lang` |
| `pdf_blank_downloaded` | Blank test PDF downloaded | `test_id`, `lang` |

### 2.3 Navigation Events

| Event Name | Trigger | Parameters |
|-----------|---------|------------|
| `landing_viewed` | Test landing page loaded | `test_id`, `lang` |
| `interstitial_viewed` | Start page loaded | `test_id`, `lang` |
| `disclaimer_accepted` | User clicks "Empezar" in interstitial | `test_id` |
| `help_page_viewed` | Ayuda urgente page | `lang` |
| `related_test_clicked` | RelatedTests card clicked | `from_test_id`, `to_test_id` |

### 2.4 Error Events

| Event Name | Trigger | Parameters |
|-----------|---------|------------|
| `test_load_error` | TestContainer fails to load | `test_id`, `lang`, `error` |

---

## 3. GTM Configuration

- **GTM container:** configured via `NEXT_PUBLIC_GTM_ID` env var
- **GA4 stream:** configured via `NEXT_PUBLIC_GA4_ID`
- **Push via:** `window.dataLayer.push(...)` — wrapped in `trackEvent()` in `src/config/analytics.ts`
- **Cookie consent:** CookieBanner must fire before GA4 collects data (RGPD compliance)

---

## 4. Funnels to Monitor in GA4

### Primary Funnel: Test Completion
```
landing_viewed → interstitial_viewed → disclaimer_accepted → test_started → test_completed
```
Drop-off rates at each step reveal UX friction points.

### Secondary Funnel: Post-Result Engagement
```
test_completed → result_viewed → result_shared / pdf_downloaded / related_test_clicked
```

### Crisis Funnel (Safety Monitoring)
```
test_completed (is_crisis=true) → crisis_triggered → [user navigates to help page?]
```
Monitor that crisis users are not abandoning without seeing resources.

---

## 5. Privacy & Compliance

- No PII collected (no names, no emails, no auth)
- Responses never leave user's device — not sent to any server
- GA4 anonymizes IPs by default
- Cookie consent (CookieBanner) required before analytics fire
- Legal basis: legitimate interest for analytics (RGPD Art. 6.1.f)
- Data retention: 14 months (GA4 default)

---

## 6. Vercel Analytics

- Auto-instrumented via `@vercel/analytics` package
- Tracks: page views, Core Web Vitals (LCP, FID, CLS) per route
- No custom events — use GA4 for behavioral data
- Dashboard: vercel.com/[team]/psicoprotego-tests/analytics
