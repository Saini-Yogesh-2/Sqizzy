# SQIZZY — CHANGELOG

## [1.0.0] - 2026-10-02
### Initial Production Build Release
- **Brand System:** Initialized full SQIZZY brand identity, warm roasted palette, custom typography tokens, and interactive 3D SVG squeeze bottle component.
- **Frontend SPA:** Built 13 responsive public pages (Home, Products, Product Detail, About, Our Story, Feedback, Waitlist, Contact, FAQ, Privacy Policy, Terms, Coming Soon, Custom 404).
- **Backend API:** Built Express API with rate limiters, helmet security, cookie parser, product endpoints, and submission handlers for waitlist, feedback, and inquiries.
- **First-Party Telemetry:** Implemented anonymous UUID visitorId, 30-minute session management, milestone scroll tracking (25%, 50%, 75%, 90%), non-blocking beacon event dispatching, and UTM capture.
- **Admin Dashboard:** Built private `/admin` authentication and full SaaS analytics dashboard with Recharts visualizations, conversion funnel, product CTR analytics, traffic channels, device breakdown, and CSV data export.
- **Vercel & Mongo Ready:** Configured `vercel.json` for monorepo serverless deployment and dual-mode resilient in-memory fallback store when MongoDB is not connected.
- **Documentation:** Authored canonical `PROJECT_CONTEXT.md`, `AGENTS.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `ANALYTICS.md`, `API.md`, and `DEPLOYMENT.md`.
