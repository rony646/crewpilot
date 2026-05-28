"""CrewPilot API entry point.

Planned: POST /plan  body: { idea }  → full Product + Market + Tech plan
         (via product_crew — import from app.crew import ProductCrew)
"""

from __future__ import annotations

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.plan_service import generate_plan
from app.schemas import PlanRequest, PlanResponse

load_dotenv()

app = FastAPI(title="CrewPilot API", version="0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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