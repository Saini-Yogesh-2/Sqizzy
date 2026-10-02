# SQIZZY — FIRST-PARTY TELEMETRY & ANALYTICS SPECIFICATION

## 1. Core Philosophy
SQIZZY implements a privacy-first, first-party analytics system designed specifically to measure genuine customer interest, identify high-intent product interest, and measure conversion funnel metrics without relying on third-party tracking cookies or invasive fingerprinting.

---

## 2. Identifier Models

### Anonymous Visitor Identifier (`visitorId`)
- **Format:** `sqz_vis_<uuid-v4>`
- **Storage:** First-party `localStorage`
- **Lifespan:** Persistent until manual cache clearing
- **Scope:** Anonymous device/browser continuity across repeat visits.

### Session Identifier (`sessionId`)
- **Format:** `sqz_ses_<uuid-v4>`
- **Storage:** First-party `sessionStorage`
- **Timeout:** 30 minutes of inactivity. If a visitor returns after 30 minutes, a fresh `sessionId` is generated while preserving the `visitorId`.

---

## 3. Supported Event Taxonomy

| Event Name | Trigger | Payload Properties |
|---|---|---|
| `page_view` | Route change (deduplicated) | `path`, `referrer`, `device`, `utm`, `title` |
| `session_start` | First page load of a session | `sessionId`, `visitorId`, `initialReferrer`, `utm` |
| `session_end` | Expiration or window close | `sessionId`, `durationSeconds`, `pageViewsCount` |
| `product_view` | Product detail page loaded | `productId`, `productSlug`, `productName`, `flavor` |
| `product_cta_click` | "Buy Now" / "Coming Soon" clicked on product card/detail | `productId`, `productSlug`, `location`, `ctaText` |
| `hero_cta_click` | "Get Sqizzy" clicked on homepage hero / navbar | `location`, `ctaText` |
| `waitlist_open` | Waitlist modal opened | `location` |
| `waitlist_submit` | Waitlist form successfully submitted | `flavor`, `emailHashed: true` |
| `feedback_open` | Feedback page opened | — |
| `feedback_submit` | Feedback form successfully submitted | `rating` (1-5) |
| `scroll_depth` | Scroll milestone reached (25%, 50%, 75%, 90%) | `depth`, `page` |
| `faq_interaction` | FAQ accordion expanded/collapsed | `questionId`, `action` |
| `recipe_click` | "Ways to Sqizzy" recipe card clicked | `recipeName` |
| `contact_submit` | Contact inquiry submitted | `topic` |

---

## 4. Key Metric Calculations

- **Unique Visitors:** `COUNT(DISTINCT visitorId)` within date range.
- **Total Sessions:** `COUNT(DISTINCT sessionId)` within date range.
- **Page Views:** `COUNT(event == 'page_view')`.
- **Product Interest Rate:** `(COUNT(product_cta_click for product) / COUNT(product_view for product)) * 100`.
- **Conversion Funnel Rate:** `(COUNT(product_cta_click) / COUNT(DISTINCT visitorId)) * 100`.
- **Engagement Rate:** `(COUNT(sessions with >1 page view OR >0 CTA clicks) / Total Sessions) * 100`.

---

## 5. Data Retention & Privacy
- Zero raw IP addresses or invasive fingerprints are stored in reports.
- Coarse geographic analytics are derived without persisting raw network identifiers.
- Retention is maintained for statistical aggregation; records older than 180 days can be automatically rolled up into monthly summary aggregates.
