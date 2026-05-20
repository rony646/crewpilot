"""CrewPilot API entry point.

Agent endpoints will live here, one per agent:
    POST /agents/product   body: { idea }
    POST /agents/market    body: { idea, product }
    POST /agents/tech      body: { idea, product, market }
"""

from __future__ import annotations

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
