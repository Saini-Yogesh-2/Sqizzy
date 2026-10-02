# SQIZZY — SYSTEM ARCHITECTURE & TELEMETRY DESIGN

## 1. System Overview
SQIZZY is structured as a fullstack consumer web application built with React, Node.js/Express, and MongoDB, deployable seamlessly on Vercel as a unified monorepo.

```mermaid
graph TD
    Client[React Frontend / SPA] -->|First-Party Events (Beacon/Fetch)| IngestionAPI[Express Analytics Ingestion]
    Client -->|Public Form Submissions| FormAPI[Waitlist & Feedback Controllers]
    Client -->|Authenticated Cookie Session| AdminAPI[Protected Analytics APIs]
    
    IngestionAPI --> StorageEngine{Database Connectivity Check}
    FormAPI --> StorageEngine
    AdminAPI --> AggregationEngine[Real-Time Aggregations Engine]
    
    StorageEngine -->|Online| MongoAtlas[(MongoDB Mongoose Models)]
    StorageEngine -->|Offline / Dev Fallback| MemoryStore[(High-Performance Memory Engine)]
    
    AggregationEngine --> MongoAtlas
    AggregationEngine --> MemoryStore
```

---

## 2. Key Architecture Decisions

### 1. Dual-Mode Storage & Aggregation Resilience
- **Problem:** When deploying pre-launch previews or testing in local dev environments without an active MongoDB connection string, traditional apps fail with 500 connection errors.
- **Solution:** `backend/src/services/analyticsStore.js` maintains an in-memory active store and syncs seamlessly with Mongoose collections when `MONGODB_URI` is connected. All tracking, submissions, aggregations, and dashboard metrics function with 100% reliability in both modes.

### 2. First-Party Privacy-Conscious Telemetry
- Uses client-generated UUIDs stored in `localStorage` (`sqizzy_visitor_id`) and 30-minute inactivity session tracking (`sqizzy_session_id`).
- Employs `navigator.sendBeacon` for non-blocking background telemetry dispatch.
- Analytics failures fail silently in the client without ever interrupting user clicks, page transitions, or modal triggers.

### 3. Isolated Admin Security
- No public user registration or signup endpoints exist.
- Single-owner admin authentication is verified directly against the server environment variable (`ADMIN_PASSWORD`), signing a cryptographic JWT (`ADMIN_JWT_SECRET`) embedded inside an HTTP-only secure cookie.
- Admin dashboard route `/admin/dashboard` is completely protected from unauthenticated access, returning `401 Unauthorized` on API endpoints and redirecting to `/admin` on the client.
