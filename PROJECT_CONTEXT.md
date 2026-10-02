# PROJECT CONTEXT — SQIZZY

> **This file is the canonical context document for AI coding agents working on Sqizzy. Read this file before modifying the project.**

---

## 1. Project Purpose & Stage
- **Brand Name:** SQIZZY
- **Category:** All-Natural Squeeze Peanut Butter
- **Current Stage:** Pre-launch DTC brand website & interest measurement platform.
- **Ecommerce Status:** NO active payment gateway, checkout, or cart processing is implemented at this stage. All purchase CTAs ("BUY NOW", "GET SQIZZY", "COMING SOON") route to product discovery, telemetry interest logging, and the VIP Waitlist.

---

## 2. Brand Identity & Visual Direction
- **Brand Philosophy:** Reimagining the century-old peanut butter jar with clean convenience.
- **Signature Motto:** `SHAKE → SQUEEZE → DRIZZLE`
- **Personality:** Premium, playful, energetic, delicious, modern, health-conscious without clinical fitness vibes.
- **Color Tokens:**
  - `Peanut Amber (Primary)`: `#D97706`
  - `Creamy Honey (Accent)`: `#F59E0B`
  - `Slow-Roasted Dark (Deep Amber)`: `#B45309`
  - `Dark Cocoa / Plum Espresso`: `#29150B` / `#190B05`
  - `Organic Cream Canvas`: `#FFFBEB` / `#FDF8F0`
  - `Zesty Pop`: `#F97316` / `#EA580C`
- **Typography:**
  - Display: `Outfit`, `Cabinet Grotesk`
  - Body: `Plus Jakarta Sans`, `Inter`
  - Accent Serif: `Instrument Serif`

---

## 3. Technology Stack
- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Framer Motion, Lucide React, TanStack Query v5, Recharts, Canvas Confetti.
- **Backend:** Node.js, Express.js (ES modules), Mongoose (with dual-mode fallback memory engine for instant local dev & deployment), jsonwebtoken, cookie-parser, express-rate-limit, helmet, cors, zod.
- **Deployment:** Vercel monorepo configuration with static frontend build (`dist`) and serverless `/api` routing.

---

## 4. Folder Structure
```
Sqizzy/
├── backend/
│   ├── src/
│   │   ├── config/ (db.js)
│   │   ├── controllers/ (product, analytics, feedback, waitlist, contact, admin)
│   │   ├── middleware/ (auth.js, rateLimiter.js, errorHandler.js)
│   │   ├── models/ (Product, AnalyticsEvent, Visitor, Session, Feedback, Waitlist, Contact)
│   │   ├── routes/ (product, analytics, feedback, waitlist, contact, admin)
│   │   ├── services/ (analyticsStore.js - real-time aggregations & fallback DB)
│   │   ├── utils/ (seedData.js, seed.js)
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── analytics/ (tracker.js - UUID visitorId, 30-min session timeout, beacon dispatcher, scroll depth)
│   │   ├── backend_mirror/ (products.js)
│   │   ├── components/
│   │   │   ├── common/ (SqizzyLogo, SqizzyBottle, JarComparison, WaitlistModal, SEO, LoadingSkeleton)
│   │   │   └── layout/ (AnnouncementBar, Navbar, Footer)
│   │   ├── contexts/ (AdminAuthContext.jsx)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── OurStoryPage.jsx
│   │   │   ├── FeedbackPage.jsx
│   │   │   ├── WaitlistPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── FAQPage.jsx
│   │   │   ├── PrivacyPolicyPage.jsx
│   │   │   ├── TermsPage.jsx
│   │   │   ├── ComingSoonPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── admin/ (AdminLoginPage.jsx, AdminDashboardPage.jsx)
│   │   ├── services/ (api.js)
│   │   ├── styles/ (index.css)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── docs/ (DESIGN_SYSTEM.md, ARCHITECTURE.md, ANALYTICS.md, API.md, DEPLOYMENT.md, IMAGE_PROMPTS.md, CHANGELOG.md)
├── vercel.json
├── AGENTS.md
└── package.json
```

---

## 5. Critical Routes & Access
| Route | Access | Purpose |
|---|---|---|
| `/` | Public | High-impact homepage with interactive bottle, Jar comparison, product showcase, FAQ |
| `/products` | Public | Product catalog with filter tags |
| `/products/:slug` | Public | Detail page with interactive 3D bottle preview, nutrition, and CTA |
| `/about` | Public | Brand pillars and clean food philosophy |
| `/our-story` | Public | Editorial multi-chapter founder journey |
| `/feedback` | Public | Mandatory 1-5 star feedback form with custom flavor inputs |
| `/waitlist` | Public | VIP Pre-Launch access registration |
| `/contact` | Public | General & wholesale contact form |
| `/faq` | Public | Categorized accordion with search filter |
| `/privacy-policy` | Public | Privacy disclosures matching implemented telemetry |
| `/terms` | Public | Pre-launch terms of service |
| `/coming-soon` | Public | Splash page |
| `/admin` | Private | Admin password login (NOT in public navigation) |
| `/admin/dashboard` | Protected | SaaS Analytics Dashboard (KPIs, Charts, Funnel, Sources, Tech, Geo, CSV) |

---

## 6. Admin Authentication Rules
- **Authentication Method:** Backend environment password (`ADMIN_PASSWORD`).
- **Token Mechanism:** Cryptographic JWT token (`ADMIN_JWT_SECRET`) issued inside an HTTP-only secure cookie (`sqizzy_admin_token`).
- **Forbidden Actions:** NEVER store admin password in MongoDB. NEVER create public registration. NEVER expose password in frontend code or client bundles.

---

## 7. Analytics System Overview
- **Storage:** Dual-mode persistence in MongoDB `analyticsEvents` collection with automatic fallback memory aggregation engine in `analyticsStore.js`.
- **Visitor ID:** UUID stored in `localStorage` under `sqizzy_visitor_id`.
- **Session ID:** UUID refreshed every 30 minutes of inactivity.
- **Events Tracked:** `page_view`, `session_start`, `session_end`, `product_view`, `product_cta_click`, `hero_cta_click`, `waitlist_open`, `waitlist_submit`, `feedback_open`, `feedback_submit`, `about_view`, `faq_open`, `faq_interaction`, `scroll_depth` (25%, 50%, 75%, 90%), `recipe_click`, `contact_submit`.

---

## 8. Development & Run Commands
```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Run both backend & frontend concurrently in dev mode
npm run dev

# Run backend only (port 5000)
npm run dev:backend

# Run frontend only (port 3000)
npm run dev:frontend

# Seed database with initial products
npm run seed
```

---

## 9. Rules for Future AI Coding Agents
1. Do NOT introduce fake testimonials or fabricated user reviews.
2. Do NOT introduce fake nutritional or medical claims.
3. Do NOT replace the first-party analytics system with third-party tracking scripts unless instructed.
4. Always test both responsive layouts and admin authentication before committing changes.
