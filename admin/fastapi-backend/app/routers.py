from fastapi import APIRouter, HTTPException
import numpy as np
from app.models import PredictionRequest

prediction_router = APIRouter()

@prediction_router.post("/predict")
def predict_claims(data: PredictionRequest):
  try:
    days_data = np.array(data.days)
    claims_data = np.array(data.claims)

    if len(days_data) != len(claims_data):
      raise HTTPException(status_code=400, detail="Days and claims data must have the same length.")

    coefficients = np.polyfit(days_data, claims_data, 1)
    linear_model = np.poly1d(coefficients)

    predicted_claims = linear_model(data.next_day)

    return {
      "next_day": data.next_day,
      "predicted_claims": round(predicted_claims, 2),
      "model_coefficients": {
        "slope": coefficients[0],
        "intercept": coefficients[1],
      }
    }
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
