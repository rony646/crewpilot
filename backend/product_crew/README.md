# Product crew (CrewPilot)

Single **Product Manager** agent → one structured Markdown product definition.

Scaffold cleaned from the default `researcher` + `reporting_analyst` template. Implementation lives in the files marked with `TODO` / `IMPLEMENT`.

## Layout

```text
src/product_crew/
  config/
    agents.yaml      # product_manager — role, goal, backstory
    tasks.yaml       # product_task — description, expected_output
  crew.py            # @agent / @task / @crew methods
  main.py            # kickoff inputs (`idea`)
  tools/             # optional custom tools (unused by default)
```

## Setup

```bash
cd backend/product_crew
cp .env.example .env   # or symlink ../.env — set OPENAI_API_KEY
crewai install         # or: uv sync
```

## Run locally

```bash
crewai run
```

Edit `main.py` → `inputs["idea"]` before running.

## What to implement

| File | What |
|------|------|
| `config/agents.yaml` | Product Manager role, goal, backstory |
| `config/tasks.yaml` | Prompt + expected Markdown sections |
| `crew.py` | Tune `Agent(...)` / `Task(...)` / `Crew(...)` options |
| `main.py` | Wire `idea` from your test case or CLI |

Later: call `ProductCrew().crew().kickoff(inputs={"idea": ...})` from `backend/app/` when you add `POST /agents/product`.

## Removed from scaffold

- `researcher`, `reporting_analyst` agents
- `research_task`, `reporting_task` tasks
- `train`, `replay`, `test`, `run_with_trigger` entrypoints in `pyproject.toml`
- Default `knowledge/user_preference.txt` (not needed for MVP)
