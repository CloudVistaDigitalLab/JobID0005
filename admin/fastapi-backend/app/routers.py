from fastapi import APIRouter, HTTPException
import numpy as np
from app.models import PredictionRequest

# Router setup
prediction_router = APIRouter()

# Historical example data (used for the `/example-prediction` endpoint)
days = np.array([1, 2, 3, 4, 5])
claims = np.array([50, 55, 53, 60, 65])

# Endpoint to predict claims for a given week
@prediction_router.post("/predict")
def predict_claims(data: PredictionRequest):
  try:
    # Convert input data to numpy arrays
    days_data = np.array(data.days)
    claims_data = np.array(data.claims)

    # Validate input lengths
    if len(days_data) != len(claims_data):
      raise HTTPException(status_code=400, detail="Weeks and claims data must have the same length.")

    # Fit a linear trend
    coefficients = np.polyfit(days_data, claims_data, 1)  # Degree 1 for a straight line
    linear_model = np.poly1d(coefficients)

    # Predict claims for the next week
    predicted_claims = linear_model(data.next_day)

    return {
      "next_week": data.next_day,
      "predicted_claims": round(predicted_claims, 2),
      "model_coefficients": {
        "slope": coefficients[0],
        "intercept": coefficients[1],
      }
    }
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

# Example endpoint for default prediction
@prediction_router.get("/example-prediction")
def example_prediction():
  try:
    coefficients = np.polyfit(days, claims, 1)  # Fit a linear trend
    linear_model = np.poly1d(coefficients)

    # Predict for the next week
    next_week = max(days) + 1
    predicted_claims = linear_model(next_week)

    return {
      "next_week": next_week,
      "predicted_claims": round(predicted_claims, 2),
      "model_coefficients": {
        "slope": coefficients[0],
        "intercept": coefficients[1],
      }
    }
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
