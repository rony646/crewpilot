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
| Deployment (later) | Render (both services), via `render.yaml` |

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

## Status

Skeleton only. Building up manually — agent first, then API, then UI.
