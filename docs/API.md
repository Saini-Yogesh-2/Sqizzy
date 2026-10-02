# SQIZZY — API SPECIFICATION

## Base URL
- Local: `http://localhost:5000/api`
- Production: `https://sqizzy.co/api`

---

## 1. Public Endpoints

### `GET /api/health`
- **Purpose:** Server health and uptime verification.
- **Response `200`:** `{ "status": "online", "brand": "SQIZZY", "version": "1.0.0" }`

### `GET /api/products`
- **Purpose:** Retrieve complete Sqizzy product range with descriptions, benefits, and nutritional preview estimates.
- **Response `200`:** `{ "success": true, "data": [Product] }`

### `GET /api/products/:slug`
- **Purpose:** Retrieve single product by slug.
- **Response `200`:** `{ "success": true, "data": Product }`
- **Response `404`:** `{ "success": false, "error": "Product not found" }`

### `POST /api/analytics/events`
- **Rate Limit:** 120 requests/minute.
- **Body:** `{ "event": "product_cta_click", "visitorId": "...", "sessionId": "...", "page": "/products", "productId": "..." }`
- **Response `200`:** `{ "success": true, "recorded": true }`

### `POST /api/waitlist`
- **Rate Limit:** 15 requests/15 minutes.
- **Body:** `{ "email": "user@example.com", "name": "Jane", "city": "Austin", "productInterest": "Original" }`
- **Response `201`:** `{ "success": true, "message": "You're officially on the Sqizzy VIP list!" }`

### `POST /api/feedback`
- **Rate Limit:** 15 requests/15 minutes.
- **Body:** `{ "rating": 5, "feedback": "Love the squeeze bottle concept!" }`
- **Response `201`:** `{ "success": true, "message": "Thanks for helping us make Sqizzy better!" }`

### `POST /api/contact`
- **Rate Limit:** 15 requests/15 minutes.
- **Body:** `{ "name": "Alex", "email": "alex@example.com", "topic": "Retail", "message": "..." }`
- **Response `201`:** `{ "success": true, "message": "Thank you for reaching out!" }`

---

## 2. Authentication Endpoints

### `POST /api/admin/login`
- **Rate Limit:** 10 attempts/15 minutes.
- **Body:** `{ "password": "..." }`
- **Response `200`:** Sets `sqizzy_admin_token` HTTP-only cookie.
- **Response `401`:** `{ "success": false, "error": "Invalid admin password" }`

### `POST /api/admin/logout`
- **Response `200`:** Clears cookie session.

### `GET /api/admin/session`
- **Response `200`:** `{ "authenticated": true, "user": "sqizzy_owner" }`
- **Response `401`:** `{ "authenticated": false }`

---

## 3. Protected Admin Analytics Endpoints
*All require valid `sqizzy_admin_token` HTTP-only cookie or Bearer header.*

- `GET /api/analytics/overview?range=7d`
- `GET /api/analytics/traffic?range=7d`
- `GET /api/analytics/funnel?range=7d`
- `GET /api/analytics/products?range=7d`
- `GET /api/analytics/sources?range=7d`
- `GET /api/analytics/devices?range=7d`
- `GET /api/analytics/geo?range=7d`
- `GET /api/analytics/waitlist`
- `GET /api/analytics/feedback`
- `GET /api/analytics/export/waitlist` (Returns formatted CSV)
- `GET /api/analytics/export/feedback` (Returns formatted CSV)
