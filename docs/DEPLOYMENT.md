* [ ] 

# SQIZZY — COMPLETE PRODUCTION DEPLOYMENT & ENVIRONMENT GUIDE

This guide provides step-by-step instructions for deploying SQIZZY, explaining both **Unified Monorepo Deployment (Vercel)** and **Separate Frontend + Backend Deployment (Vercel / Netlify / Render / Railway)**, along with the exact environment variables you need to replace in production.

---

## 🔑 Summary of Environment Variables to Replace in Production

| Variable Name        | Environment | Local Dev Value                          | Production Replacement Value                                                                    | Why it must be changed                                           |
| -------------------- | ----------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `MONGODB_URI`      | Backend     | `mongodb://localhost:27017/sqizzy`     | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/sqizzy?retryWrites=true&w=majority`     | Connects to your persistent cloud MongoDB Atlas database.        |
| `ADMIN_PASSWORD`   | Backend     | `SqizzyAdmin2026!`                     | `YourCustomStrongPassword123!#`                                                               | Protects`/admin/dashboard` analytics from unauthorized access. |
| `ADMIN_JWT_SECRET` | Backend     | `sqizzy_super_secret_jwt_key_2026_...` | `random_64_character_cryptographic_hex_string`                                                | Signs secure HTTP-only session cookies.                          |
| `FRONTEND_URL`     | Backend     | `http://localhost:3000`                | `https://sqizzy.co` (or `https://your-app.vercel.app`)                                      | Configures CORS whitelist to allow browser requests.             |
| `NODE_ENV`         | Backend     | `development`                          | `production`                                                                                  | Optimizes performance, disables verbose debug logs.              |
| `VITE_API_URL`     | Frontend    | `""` (empty for proxy)                 | `""` *(for Vercel monorepo)* OR `https://your-backend-api.com` *(for separate backend)* | Routes frontend API requests to the backend server.              |

---

## 🚀 OPTION 1: Unified Monorepo Deployment on Vercel (Recommended)

Both the React frontend and Express serverless backend deploy automatically on Vercel using the root [`vercel.json`](file:///c:/Users/yoges/Desktop/GitHub/Sqizzy/vercel.json).

### Step-by-Step Instructions:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete SQIZZY production website"
   git push origin main
   ```
2. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your `Sqizzy` GitHub repository.
3. **Configure Project Settings in Vercel:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (Leave as Root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm run install:all`
4. **Set Production Environment Variables in Vercel Dashboard:**
   Go to **Project Settings → Environment Variables** and add:
   ```env
   NODE_ENV = production
   FRONTEND_URL = https://your-project-name.vercel.app
   MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.mongodb.net/sqizzy?retryWrites=true&w=majority
   ADMIN_PASSWORD = YourStrongPrivateAdminPassword2026!
   ADMIN_JWT_SECRET = d8f9e0a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789a
   ```
5. **Click Deploy:**
   Vercel will build the frontend assets and provision serverless functions for all `/api/*` endpoints.

---

## 🌐 OPTION 2: Separate Deployments (Frontend on Vercel + Backend on Render/Railway)

If you prefer hosting the Node.js/Express backend on a dedicated server (like Render, Railway, Fly.io, Heroku, or AWS) and the React frontend on Vercel/Netlify:

### Part A: Deploy the Backend (e.g. Render / Railway)

1. **Create New Web Service on Render / Railway:**
   - Connect your GitHub repository.
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
2. **Add Backend Environment Variables:**
   ```env
   PORT = 5000
   NODE_ENV = production
   FRONTEND_URL = https://sqizzy.vercel.app
   MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.mongodb.net/sqizzy?retryWrites=true&w=majority
   ADMIN_PASSWORD = YourStrongPrivateAdminPassword2026!
   ADMIN_JWT_SECRET = random_64_character_string_here
   ```
3. Copy your live backend URL (e.g., `https://sqizzy-api.onrender.com`).

---

### Part B: Deploy the Frontend (Vercel / Netlify)

1. **Create New Project on Vercel / Netlify:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
2. **Add Frontend Environment Variables:**
   ```env
   VITE_API_URL = https://sqizzy-api.onrender.com
   ```
3. **Deploy.** The frontend will communicate directly with your dedicated backend API.

---

## 🗄️ Setting Up Free MongoDB Atlas (Cloud Database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g. `sqizzy_admin`) and generate a secure password.
4. Under **Network Access**, click **Add IP Address** → choose **Allow Access from Anywhere (`0.0.0.0/0`)** so serverless functions can connect.
5. Click **Connect** → **Drivers (Node.js)** and copy your connection string:
   ```
   mongodb+srv://sqizzy_admin:<password>@cluster0.mongodb.net/sqizzy?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your database user password and set it as `MONGODB_URI`.

---

## 🛡️ Security Best Practices

1. **Never commit `.env` files.** All `.env` files are ignored in `.gitignore`.
2. **Rotate Secrets:** If `ADMIN_PASSWORD` or `ADMIN_JWT_SECRET` are ever compromised, update them in your hosting provider dashboard to invalidate existing sessions immediately.
3. **Admin Dashboard:** Access your live analytics dashboard at `https://your-domain.com/admin` using your configured `ADMIN_PASSWORD`.
