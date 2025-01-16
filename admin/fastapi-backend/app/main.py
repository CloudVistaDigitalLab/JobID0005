from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import prediction_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],  # Replace with your frontend's URL in production
  allow_credentials=True,
  allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
  allow_headers=["*"],  # Allow all headers
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Claims Prediction API"}

# Include prediction routes
app.include_router(prediction_router)
