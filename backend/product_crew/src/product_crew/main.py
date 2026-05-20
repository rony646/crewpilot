#!/usr/bin/env python
"""Local entry point — run from product_crew/ with: crewai run"""

import warnings

from product_crew.crew import ProductCrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def run():
    """Run the full plan: Product → Market → Tech."""
    inputs = {
        "idea": "AI-powered code review tool for teams",
    }

    result = ProductCrew().crew().kickoff(inputs=inputs)

    # Last task output (tech plan)
    print(result.raw)

    # All three outputs (useful when wiring POST /plan in FastAPI):
    # for i, task_output in enumerate(result.tasks_output):
    #     print(f"--- Task {i} ---\n{task_output.raw}\n")

    return result
