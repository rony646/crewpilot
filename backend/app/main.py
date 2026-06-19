"""CrewPilot API entry point.

Planned: POST /plan  body: { idea }  → full Product + Market + Tech plan
         (via product_crew — import from app.crew import ProductCrew)
"""

from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.plan_service import generate_plan
from app.schemas import PlanRequest, PlanResponse

load_dotenv()

DEFAULT_ALLOWED_ORIGINS = ["http://localhost:5173"]


def _allowed_origins() -> list[str]:
    """Read allowed CORS origins from CORS_ALLOW_ORIGINS (comma-separated).

    Falls back to local dev origins when the env var is unset.
    """
    raw = os.getenv("CORS_ALLOW_ORIGINS", "")
    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
    return origins or DEFAULT_ALLOWED_ORIGINS


app = FastAPI(title="CrewPilot API", version="0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/plan", response_model=PlanResponse)
async def plan(body: PlanRequest) -> PlanResponse:
    try:
        return await generate_plan(body.idea)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Plan generation failed. Check server logs.") from exc