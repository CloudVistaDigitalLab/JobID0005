from pydantic import BaseModel

class PredictionRequest(BaseModel):
    days: list[int]
    claims: list[float]
    next_day: int
