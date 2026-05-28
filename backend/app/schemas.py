from pydantic import BaseModel, Field

class PlanRequest(BaseModel):
    idea: str = Field(..., min_length=10, max_length=5000, description="The idea for the plan")

class PlanResponse(BaseModel):
    product: str = Field(..., description="The product definition")
    market: str = Field(..., description="The market analysis")
    tech: str = Field(..., description="The technical execution plan")


