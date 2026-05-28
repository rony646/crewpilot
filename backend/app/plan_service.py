from fastapi.concurrency import run_in_threadpool

from app.crew import ProductCrew
from app.schemas import PlanResponse

async def generate_plan(idea: str) -> PlanResponse:
    """Run Product → Market → Tech and return all three markdown outputs."""

    def _kickoff() -> PlanResponse:
        result = ProductCrew().crew().kickoff(inputs={"idea": idea})
        outputs = result.tasks_output

        if len(outputs) < 3:
            raise RuntimeError("Expected 3 task outputs, got %s" % len(outputs))

        return PlanResponse(
            product=outputs[0].raw,
            market=outputs[1].raw,
            tech=outputs[2].raw,
        )

    return await run_in_threadpool(_kickoff)
