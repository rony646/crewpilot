"""Bridge to the CrewAI full-plan crew (installed from backend/product_crew).

Step 2 will call ProductCrew from the /plan route handler.
"""

from product_crew.crew import ProductCrew

__all__ = ["ProductCrew"]
