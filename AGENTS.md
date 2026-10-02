# SQIZZY — AGENT GUIDELINES & WORKFLOW RULES

## Mandatory First Steps
1. **Read `PROJECT_CONTEXT.md` first.** It contains the single source of truth for the codebase structure, routes, environment variables, and design tokens.
2. **Consult `docs/DESIGN_SYSTEM.md` before making any visual modifications.**

---

## Non-Negotiable Project Rules
1. **No Fake Social Proof:** Because SQIZZY is in a pre-launch stage, never create fabricated customer reviews, fake quotes, or 5-star badges claiming thousands of reviews that don't exist in the database.
2. **No Fake Health/Medical Claims:** Only list verified product facts (e.g. "100% slow-roasted peanuts", "no palm oil", "silicone anti-drip valve"). Never claim medical cure, weight loss, or disease prevention benefits.
3. **No Database Admin Collections:** Admin authentication is intentionally single-owner environment-based (`ADMIN_PASSWORD`). Do not create an `AdminUsers` collection in MongoDB.
4. **Preserve First-Party Telemetry:** Every interactive CTA ("BUY NOW", "GET SQIZZY", "COMING SOON") must continue to emit `product_cta_click` or `hero_cta_click` events.
5. **Non-Blocking Analytics:** Analytics events must always dispatch asynchronously using `navigator.sendBeacon` or fetch keepalive. Analytics failure must never break or delay user navigation.
6. **Mobile Responsiveness:** All UI components must be tested from 320px up to 1920px without horizontal overflow.
7. **Accessibility First:** Keep interactive elements accessible via keyboard navigation, maintain visible focus states, and respect `prefers-reduced-motion`.
