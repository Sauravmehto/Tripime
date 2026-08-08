# Tripime — Mock Domestic Flight Search & Booking

A simple full-stack app for testing the complete flight booking flow using **local mock inventory**. No real airline, GDS, or payment APIs.

Supported flow:

```text
Home → Search → Results → Passengers → Review
  → SweetAlert confirm → Seats → Payment → Booking → Confirmation (+ PDF invoice)
```

Booking is created only **after successful mock payment**.

## What's included

| Piece | Tech |
|-------|------|
| Frontend | React + TypeScript + Vite + Tailwind + Axios + React Router + SweetAlert2 |
| Backend | Python FastAPI + Pydantic + ReportLab (PDF invoices) |
| Data | Local JSON (`backend/data/flights.json`, `bookings.json`) |

### Routes (mock inventory)

- **DEL → BOM** (Delhi → Mumbai)
- **DEL → BLR** (Delhi → Bangalore)

### Date range

**2026-08-04 through 2026-08-31** (~280 pre-generated flights)

Dates outside this range return a clear validation error.

## Prerequisites

- Node.js 20+
- Python **3.11** recommended (3.12–3.14 also work with current `requirements.txt`)

## Backend setup

```bash
cd backend
py -3.11 -m venv .venv

# Windows
.\.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
```

Optional — regenerate flight inventory:

```bash
python scripts/generate_flights.py
```

Start the API (port **8002**):

```bash
uvicorn app.main:app --reload --port 8002
```

Health check: http://127.0.0.1:8002/api/health  
Docs: http://127.0.0.1:8002/docs

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/flights/search?origin=DEL&destination=BOM&date=2026-08-20&passengers=1` | Search flights |
| GET | `/api/flights/{flight_id}` | Flight detail |
| POST | `/api/payments/mock` | Mock payment (UPI / QR / card metadata) |
| POST | `/api/bookings` | Create booking after successful payment |
| GET | `/api/bookings/{booking_id}` | Booking confirmation |
| GET | `/api/bookings/{booking_id}/invoice` | Download PDF invoice |

### Architecture note

Routes call services that use provider abstractions:

- **FlightProvider** → today `MockFlightProvider` (`flights.json`); later a real GDS/Amadeus provider
- **PaymentProvider** → today `MockPaymentProvider`; later a real payment gateway

Never store CVV or full card numbers — only safe payment metadata is persisted.

## Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App: http://localhost:5173

Leave `VITE_API_BASE_URL` empty so the browser calls `/api` on the Vite origin (no CORS). Vite proxies `/api` to `http://127.0.0.1:8002`.

## Manual test scenarios

1. Search DEL → BOM on **2026-08-04** → ~5 flights  
2. Search DEL → BLR on **2026-08-20** → ~5 flights  
3. Search DEL → BOM on **2026-08-31** → ~5 flights  
4. Search date **2026-09-05** → validation error about inventory range  
5. Full flow: Review → Confirm & Continue → Seats → Payment → Confirmation → Download invoice PDF  
6. Also test with **2 passengers** (must select 2 seats before payment)  
7. Admin: `/admin/login` → confirm a `PROCESSING` booking on `/admin/bookings`

## Deploy (GitHub + Render + Netlify)

Push this repo to GitHub, then host:

| Part | Service | Config in repo |
|------|---------|----------------|
| Backend API | [Render](https://render.com) free Web Service | [`render.yaml`](render.yaml), [`backend/runtime.txt`](backend/runtime.txt) |
| Frontend | [Netlify](https://netlify.com) free site | [`netlify.toml`](netlify.toml) |

### 1. Backend on Render

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** (or **Web Service**) → connect the GitHub repo.
2. If using Blueprint, Render reads [`render.yaml`](render.yaml) (`rootDir: backend`).
3. **Pin Python (recommended).** In **Environment**, add:

| Variable | Value |
|----------|--------|
| `PYTHON_VERSION` | `3.11.9` |

Current `requirements.txt` also installs on Render’s default 3.14 (prebuilt wheels). Older pins (`pydantic==2.11.7`) fail on 3.14 with a maturin/Rust build error.

4. Set the other environment variables (Blueprint marks several as “sync: false” — fill them in the UI):

| Variable | Example |
|----------|---------|
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | strong password |
| `ADMIN_JWT_SECRET` | long random string (or use Generate) |
| `CORS_ORIGINS` | `https://YOUR-SITE.netlify.app` (add custom domain later if any) |
| `SMTP_*` | optional until you want real confirmation emails |

5. Build / start (Root Directory = `backend`):

- Build: `python scripts/render_build.py`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

   Prefer `PYTHON_VERSION=3.11.9`. If the log still shows 3.14, updated deps should still install; use **Clear build cache & deploy** after pushing `requirements.txt`.

6. After deploy, open `https://YOUR-API.onrender.com/api/health` — should return `{"ok":true,...}`.

**Notes**

- Free Render services **sleep** when idle; the first request after sleep can take ~30–60s.
- Disk is **ephemeral**: `backend/data/bookings.json` can reset on redeploy/restart. Fine for demos; use a database for production persistence later.
### 2. Frontend on Netlify

1. [Netlify](https://app.netlify.com) → **Add new site** → **Import from Git** → this repo.
2. Build settings are already in [`netlify.toml`](netlify.toml) (`base = frontend`, `npm run build`, publish `dist`).
3. **Site configuration → Environment variables** (required for production):

| Variable | Value |
|----------|--------|
| `VITE_API_BASE_URL` | `https://YOUR-API.onrender.com` (no trailing slash) |

4. Trigger a deploy. Open the Netlify URL and run a search; Network tab should call your Render host under `/api/...`.
5. Set `CORS_ORIGINS` on Render to that exact Netlify URL, then redeploy/restart the API if needed.

### 3. Admin panel after deploy

- URL: `https://YOUR-SITE.netlify.app/admin/login`
- Credentials: whatever you set as `ADMIN_USERNAME` / `ADMIN_PASSWORD` on Render.
- **Before real users touch this:** read [`backend/SECURITY_CHECKLIST.md`](backend/SECURITY_CHECKLIST.md) — it lists the insecure dev defaults you must override and other hardening steps.

### Local vs production API URL

- **Local:** leave `VITE_API_BASE_URL` empty — Vite proxies `/api` → `http://127.0.0.1:8002`.
- **Netlify:** set `VITE_API_BASE_URL` to the Render URL (Vite proxy does not exist in production).

## Project structure

```text
backend/
  app/
    main.py
    config.py
    models/
    routes/
    services/
    providers/   # FlightProvider + MockFlightProvider
  data/
    flights.json
    bookings.json
  scripts/
    generate_flights.py
  requirements.txt
  runtime.txt

frontend/
  src/
    api/
    components/
    context/
    pages/
    types/

netlify.toml
render.yaml
```
