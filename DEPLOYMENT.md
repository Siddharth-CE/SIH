# 🚀 NER CognitiveCare Deployment Guide

This document explains how to deploy **NER CognitiveCare** in a production-ready decoupled architecture:

```text
                    INTERNET
                       │
              ┌────────┴────────┐
              │                 │
          VERCEL             BACKEND HOST (Render / Railway / Fly.io)
             │                 │
        React + Vite         FastAPI
        Frontend             Backend
             │                 │
             └──── HTTPS API ──┘
                               │
                          PostgreSQL
```

---

## 1. 🌐 Frontend Deployment on Vercel

### Configuration Settings in Vercel:
1. **Import Repository**: Select your GitHub repository (`SIH`).
2. **Root Directory**: Select `frontend` (Click *Edit* next to Root Directory and choose `frontend`).
3. **Framework Preset**: `Vite`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Environment Variables on Vercel:
Add the following in **Settings → Environment Variables**:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://<your-backend-domain>/api/v1` | Public URL of your deployed FastAPI backend |
| `VITE_USE_MOCK` | `false` | Set to `false` for live backend API integration |

> **SPA Routing**: `frontend/vercel.json` contains single-page application rewrite rules so navigating directly to routes like `/patient`, `/caregiver`, or `/healthcare` will not result in 404s.

---

## 2. ⚡ Backend Deployment (Render / Railway / Fly.io / Custom VPS)

### Deployment Specifications:
- **Build / Runtime**: Python 3.11 / 3.12 / 3.14 or Docker
- **Root Directory**: `backend`
- **Install Command**: `pip install -r requirements.txt`
- **Start Command**:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
  *(Or use the included `backend/Dockerfile` if deploying via Docker)*

### Required Backend Environment Variables:

| Variable | Example Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/ner_cognitivecare` | Production PostgreSQL connection string |
| `JWT_SECRET` | `generate-a-strong-random-secret-key-32-chars-min` | Secret key for signing JWT tokens |
| `JWT_ALGORITHM` | `HS256` | Token signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Token expiration (24h) |
| `CORS_ORIGINS` | `https://your-project.vercel.app,http://localhost:5173` | Allowed frontend domains for CORS |
| `ENVIRONMENT` | `production` | Environment mode |
| `DEBUG` | `False` | Disable debug logs in production |
| `REDIS_URL` | `redis://default:pass@host:6379/0` | Optional Redis cache for distributed locks |

---

## 3. 🩺 Health & Readiness Verification

Once deployed, verify backend uptime:
- **Health Check**: `GET https://<your-backend-domain>/health` (Returns `{"status": "healthy"}`)
- **Swagger Documentation**: `GET https://<your-backend-domain>/api/v1/docs`
- **OpenAPI Schema**: `GET https://<your-backend-domain>/api/v1/openapi.json`

---

## 4. 💻 Local Development Workflow

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
*(Runs at `http://localhost:5173`)*

### Backend:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*(Runs at `http://localhost:8000`)*
