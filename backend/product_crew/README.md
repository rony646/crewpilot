# CrewPilot — full plan crew

Sequential CrewAI pipeline that turns a one-paragraph **idea** into three structured Markdown deliverables:

1. **Product** — product definition  
2. **Market** — market validation (uses product output as context)  
3. **Tech** — technical execution plan (uses product + market as context)

This package is the core AI layer for [CrewPilot](../../README.md). The FastAPI app in `backend/app/` will call it from a single endpoint (e.g. `POST /plan`); for now it runs locally via `crewai run`.

---

## Pipeline

```text
  {idea}
    │
    ▼
┌─────────────────┐
│  product_task   │  product_manager
│  → product.md   │
└────────┬────────┘
         │ context=
         ▼
┌─────────────────┐
│  market_task    │  market_manager
│  → market.md    │
└────────┬────────┘
         │ context=
         ▼
┌─────────────────┐
│  tech_task      │  tech_lead
│  → tech.md      │
└─────────────────┘
```

- **Order:** `Process.sequential` in `crew.py`  
- **Context:** `market_task` receives `product_task` output; `tech_task` receives both (see `context=[...]` in `crew.py`)  
- **Kickoff input:** only `{idea}` — prior steps are not passed manually in YAML  

---

## Agents & outputs

| Agent | Task | Markdown sections |
|-------|------|-------------------|
| Product Manager | `product_task` | Idea summary, Value proposition, Target user, Core features, Problem being solved |
| Market Analyst | `market_task` | Market context, Competitors, Target audience, Opportunities, Risks |
| Tech Lead | `tech_task` | Architecture, Technical features, System flow, MVP scope, Timeline estimation, Technical risks |

Prompts and personas: `src/product_crew/config/agents.yaml`  
Task wording and templates: `src/product_crew/config/tasks.yaml`

---

## Project layout

```text
product_crew/
  pyproject.toml          # deps + run_crew / product_crew scripts
  uv.lock                 # commit this — reproducible installs
  .env.example            # copy to .env
  output/                 # generated on each run (gitignored)
    product_task.md
    market_task.md
    tech_task.md
  knowledge/              # optional domain docs (unused in MVP)
  src/product_crew/
    config/
      agents.yaml
      tasks.yaml
    crew.py               # agents, tasks, context=, output_file paths
    main.py               # local entry: kickoff(inputs={"idea": ...})
    tools/                # optional custom tools (empty stub)
  AGENTS.md               # CrewAI reference for AI assistants (optional read)
```

---

## Prerequisites

- Python **3.12**
- [uv](https://docs.astral.sh/uv/) (recommended) or CrewAI CLI
- **OpenAI API key** (or provider configured in `.env` / `MODEL`)
- ~2–10+ minutes per full run (3 LLM calls)

---

## Setup

```bash
cd backend/product_crew
cp .env.example .env
# Edit .env — set OPENAI_API_KEY (and optionally MODEL=gpt-4o-mini)
uv sync
```

On Apple Silicon, `pyproject.toml` pins `onnxruntime` via `[tool.uv]` so CrewAI’s transitive deps resolve on macOS.

---

## Run locally

### 1. Set the idea

Edit `src/product_crew/main.py` — change `inputs["idea"]`:

```python
inputs = {
    "idea": "Your one-paragraph idea here",
}
```

### 2. Execute

```bash
crewai run
```

Equivalent:

```bash
uv run product_crew
# or
uv run run_crew
```

### 3. Read results

| Where | What |
|-------|------|
| `output/product_task.md` | Product definition |
| `output/market_task.md` | Market analysis |
| `output/tech_task.md` | Tech plan |
| Terminal | `result.raw` = last task only (tech); use loop below for all three |

To print all three in the terminal, uncomment in `main.py`:

```python
for i, task_output in enumerate(result.tasks_output):
    print(f"--- Task {i} ---\n{task_output.raw}\n")
```

For FastAPI later:

```python
product_md = result.tasks_output[0].raw
market_md  = result.tasks_output[1].raw
tech_md    = result.tasks_output[2].raw
```

---

## Configuration

| File | Purpose |
|------|---------|
| `config/agents.yaml` | Role, goal, backstory per agent |
| `config/tasks.yaml` | Task description, `expected_output`, assigned agent |
| `crew.py` | Python wiring: `context=`, `output_file=`, `verbose`, `allow_delegation=False` |
| `main.py` | Local test harness and `kickoff` inputs |

**Tuning tips**

- Stricter sections → edit `expected_output` in `tasks.yaml`  
- Tone / MVP focus → edit `agents.yaml`  
- Faster/cheaper runs → set `MODEL=gpt-4o-mini` in `.env`  
- No tools / memory in MVP — keeps deps and runtime simple  

---

## Git

Committed: `src/`, `pyproject.toml`, `uv.lock`, `.env.example`, this README  

Ignored (see repo root `.gitignore`): `.env`, `.venv/`, `output/`, local CrewAI caches  

---

## Next step (backend integration)

Expose the same `kickoff` from FastAPI:

```python
from product_crew.crew import ProductCrew

result = ProductCrew().crew().kickoff(inputs={"idea": body.idea})
# return { "product": ..., "market": ..., "tech": ... }
```

Resolve import path from `backend/app/` (local package / path) when you wire `POST /plan`.

---

## Links

- [CrewAI docs](https://docs.crewai.com)  
- [CrewPilot root README](../../README.md)
