# =============================================================================
# Custom tools — OPTIONAL for the Product Agent.
#
# The scaffold shipped with a sample tool; delete this file if you don't need tools.
#
# IMPLEMENT (only if the agent must call external APIs / search / files):
#
#   from typing import Type
#   from crewai.tools import BaseTool
#   from pydantic import BaseModel, Field
#
#   class MyToolInput(BaseModel):
#       query: str = Field(..., description="...")
#
#   class MyCustomTool(BaseTool):
#       name: str = "my_tool"
#       description: str = "What this tool does."
#       args_schema: Type[BaseModel] = MyToolInput
#
#       def _run(self, query: str) -> str:
#           # your logic here
#           return "..."
#
# Then in crew.py:
#   from product_crew.tools.custom_tool import MyCustomTool
#   tools=[MyCustomTool()] on the Agent(...)
# =============================================================================
