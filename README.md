# NER CognitiveCare

AI-powered cognitive gaming and memory assistance platform designed for elderly dementia patients across India's North Eastern Region (NER).

---

## 🌿 About the Project

NER CognitiveCare empowers elderly individuals in Northeast India with culturally familiar neuro-cognitive exercises, routine and medication adherence tracking, native multilingual voice companionship, and offline-first resiliency for remote hilly districts.

### Key Features
- **Adaptive Cognitive Games**: 6 culturally tailored cognitive games (Memory Garden, Object Recall, Handloom Flow, Reflex Tap, Friendly Face, and Daily Routine) with gentle 1-step adaptive difficulty progression.
- **Multilingual & Voice Support**: Native voice companion supporting 5 regional languages (Assamese, Bengali, Khasi, Manipuri, and English).
- **Senior-Centric UX**: 56px+ large touch targets, high-contrast modes, text scaling, and audio chime feedback.
- **Offline Sync**: Offline-first queue with automatic background sync when internet connectivity returns.
- **Caregiver & Healthcare Portals**: Real-time adherence telemetry, mood logging, and clinical triage dashboards for ASHA community health workers.

---

## 🛠️ Technology Stack & Architecture

- **Frontend (`/frontend`)**: React 19, TypeScript, Vite, TailwindCSS, Three.js (WebGL 3D ambient canvas)
- **Backend (`/backend`)**: Python, FastAPI, SQLAlchemy 2.0, Pydantic v2
- **Database & Cache**: PostgreSQL / SQLite, Redis
- **Containerization**: Docker & Docker Compose

---

## 🚀 Running Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🌐 Production Deployment

For complete production deployment instructions on **Vercel** (Frontend) and **Render / Railway / Fly.io** (FastAPI Backend), see [DEPLOYMENT.md](DEPLOYMENT.md).
