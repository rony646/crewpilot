# Knowledge (optional)

CrewAI can attach domain docs here (PDF, text, etc.) and pass them via `knowledge_sources` on the crew or agent.

**Not required for the Product Agent MVP.** Leave empty unless you want the agent grounded on specific files.

```python
# Example (in crew.py) — implement only if needed:
# from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
# source = StringKnowledgeSource(content="...")
# Crew(..., knowledge_sources=[source])
```
