# CrewPilot

Turn a one-paragraph idea into a structured Product, Market, and Tech plan via a sequential CrewAI multi-agent pipeline.

## Repo

```text
crewpilot/
  backend/      FastAPI + CrewAI (Python, uv)
  frontend/     React + TypeScript + Vite
```

## Stack

| Layer | Tech |
|---|---|
| Backend | Python 3.12, FastAPI, CrewAI, uv |
| Frontend | React, TypeScript, Vite |
| Auth + DB | Supabase |
| Deployment | Backend on Render |

## Running locally

### Backend

```bash
cd backend
uv sync
cp .env.example .env  # then fill in OPENAI_API_KEY
uv run dev
```

If `uv run dev` fails, run the server directly:

```bash
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Deployment

- **Frontend (Vercel):** https://crewpilot-nine.vercel.app
- **Backend (Render):** https://crewpilot-nwm0.onrender.com

### Frontend (Vercel)

The frontend is deployed on [Vercel](https://vercel.com) as a static Vite build:

- **Live URL:** https://crewpilot-nine.vercel.app

Vercel configuration:

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Required environment variables on Vercel (set before build — `VITE_*` vars are
embedded at build time):

- `VITE_API_URL` — backend API URL (the Render URL above)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase publishable/anon key

> SPA routing (e.g. `/results/:id`, `/history`) is handled by
> `frontend/vercel.json`, which rewrites all paths to `index.html` so deep
> links and refreshes don't 404.

### Backend (Render)

The backend is deployed on [Render](https://render.com) as a web service:

- **Live URL:** https://crewpilot-nwm0.onrender.com
- **Health check:** https://crewpilot-nwm0.onrender.com/health

Render configuration:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install uv && uv sync` |
| Start Command | `uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Python version | pinned via `backend/.python-version` (3.12) |

Required environment variables on Render:

- `OPENAI_API_KEY` — OpenAI API key
- `CREWPILOT_MODEL` — optional, defaults to `gpt-4o-mini`
- `CORS_ALLOW_ORIGINS` — comma-separated frontend origins allowed to call the
  API (e.g. `https://your-frontend.vercel.app`). Defaults to
  `http://localhost:5173` when unset.

> Note: the free tier spins the service down after ~15 min idle, so the first
> request after a cold start can take ~30–60s.

Point the frontend at the deployed API by setting `VITE_API_URL` to the Render URL.
