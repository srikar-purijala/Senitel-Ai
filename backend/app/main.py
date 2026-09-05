from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router

app = FastAPI(
    title="SENTINEL AI - Risk Intelligence API",
    description="Backend API for SENTINEL AI platform.",
    version="1.0.0",
)

import os
import json

# CORS configuration
origins = ["http://localhost:3000", "http://localhost:5173"]
if os.environ.get("BACKEND_CORS_ORIGINS"):
    try:
        origins.extend(json.loads(os.environ.get("BACKEND_CORS_ORIGINS")))
    except:
        origins.extend(os.environ.get("BACKEND_CORS_ORIGINS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "SENTINEL AI Backend is running. Access API endpoints at /api or view docs at /docs"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
