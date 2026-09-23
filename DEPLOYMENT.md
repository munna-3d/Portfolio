# Moon 3D Studio — Production Deployment Guide

**Frontend: Vercel (Next.js) | Backend: Render (Node.js / Express)**

---

## Architecture Overview

```
┌─────────────────────────────────┐           ┌──────────────────────────────────┐
│        VERCEL (Frontend)        │           │         RENDER (Backend)         │
│                                 │           │                                  │
│  - Next.js 16 App Router        │           │  - Express.js API & CMS Engine   │
│  - SSR / Static Optimization   │  REST API │  - In-Memory Rate Limiting       │
│  - High-Speed Edge Global CDN   │ ────────> │  - JWT Auth + bcrypt Security    │
│  - Built-in Offline Fallbacks   │           │  - Persistent CMS & Media Server │
└─────────────────────────────────┘           └──────────────────────────────────┘
```

---

## Part 1: Deploy Backend on Render

You can deploy the backend using either **Method A (Blueprint — Recommended)** or **Method B (Manual)**.

### Method A: One-Click Blueprint (Recommended)

1. Push your repository to GitHub or GitLab.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** in the top navigation and select **Blueprint**.
4. Connect your portfolio repository.
5. Render will automatically read [`render.yaml`](file:///render.yaml) and configure:
   - Service Name: `moon3d-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Health Check Path: `/api/health`
6. Click **Apply**.
7. In the service settings, set the environment variable:
   - `ALLOWED_ORIGIN`: Your Vercel frontend URL (e.g. `https://moon-3d-studio.vercel.app`)

---

### Method B: Manual Web Service Setup

1. In the Render Dashboard, click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure the following fields:
   | Setting | Value |
   | :--- | :--- |
   | **Name** | `munna-backend` (or your preferred name) |
   | **Region** | Choose the region closest to you (e.g., Singapore, Frankfurt, Oregon) |
   | **Branch** | `main` (or your production branch) |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |
   | **Plan Type** | `Free` (or Starter for 24/7 active runtime) |

4. Scroll down to **Advanced** → **Health Check Path** and set:

   ```
   /api/health
   ```

5. Under **Environment Variables**, add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production security & logging |
   | `PORT` | `10000` | Render standard port (assigned dynamically) |
   | `JWT_SECRET` | `generate-a-strong-random-secret` | 32+ character secret for token signing |
   | `ALLOWED_ORIGIN` | `https://your-portfolio.vercel.app` | Your Vercel URL for CORS |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-portfolio.vercel.app` | Canonical site URL |
   | `ADMIN_USER` | `admin` | Initial admin username |
   | `ADMIN_PASS` | `YourSecurePassword2026!` | Initial admin password (will be bcrypt-hashed) |

6. Click **Create Web Service**.
7. Once deployed, copy your backend URL:
   `https://moon3d-backend.onrender.com`

---

### Optional: Render Persistent Disk (For Permanent Uploads)

_On Render's Free tier, the filesystem is ephemeral (resets on restart). If you want uploaded images and CMS edits to persist permanently, attach a Render Disk:_

1. In your Render Web Service settings, go to **Disks** → **Add Disk**.
2. Name: `data-storage`
3. Mount Path: `/var/data`
4. Size: `1 GB` (or as needed)
5. Go to **Environment Variables** and add:
   - `DATA_DIR`: `/var/data`
   - `UPLOAD_DIR`: `/var/data/uploads`
6. Click **Save Changes**. The service will redeploy with permanent storage.

---

## Part 2: Deploy Frontend on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your Git repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: `./` (leave default repository root)
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. Expand **Environment Variables** and add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-portfolio.vercel.app` | Your frontend production URL (without trailing slash) |
   | `NEXT_PUBLIC_BACKEND_URL` | `https://moon3d-backend.onrender.com` | Your Render backend URL (without trailing slash) |

6. Click **Deploy**.
7. Vercel will build and deploy your Next.js application in ~60 seconds.

---

## Part 3: Connect & Verify

### 1. Test Backend Health

Open your browser or run:

```bash
curl https://moon3d-backend.onrender.com/api/health
```

**Expected Response:**

```json
{ "status": "ok", "timestamp": "..." }
```

### 2. Test Frontend-to-Backend Connectivity

1. Visit your Vercel deployment: `https://your-portfolio.vercel.app`.
2. Check the browser Console (F12) — verify there are no CORS or CSP errors.
3. Browse to the `/contact` page:
   - Fill out and submit a test message.
   - Verify success notification appears ("Thank you! Your message has been received.").
4. Log into Admin CMS:
   - Navigate to `/admin`.
   - Log in using your configured credentials.
   - Go to the **Client Inbox** tab — your test contact submission will be listed with full contact details, timestamp, and status controls (`Mark Read`, `Replied`, `Archive`).

---

## Pro Tip: Preventing Render Free-Tier Cold Starts

Render's Free tier spins down web services after 15 minutes of inactivity. When a new visitor arrives, it may take 30–50 seconds to wake up.

> [!NOTE]
> **Built-in Resilience**: Even if the Render backend is sleeping or spinning up, Moon 3D Studio's frontend never crashes or shows a broken page. Next.js gracefully serves all projects, experiences, software tools, and vehicle categories from embedded static fallbacks.

If you want your backend API to stay awake 24/7 on Render Free tier without paying:

1. Create a free account at [cron-job.org](https://cron-job.org) or [uptimerobot.com](https://uptimerobot.com).
2. Set up an HTTP monitor hitting your health check:
   `https://moon3d-backend.onrender.com/api/health`
3. Set the interval to **every 10 minutes**.
4. This keeps the backend continuously warm with zero cold-start latency.
