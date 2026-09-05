# SENTINEL AI

> Explainable graph-based risk intelligence for detecting coordinated payment abuse.

SENTINEL AI is an enterprise-grade fintech risk operations platform designed for the **Razorpay AI Buildathon 2026**. It leverages deterministic machine learning (LightGBM) to evaluate graph-based network topologies and highlights sophisticated, coordinated payment abuse rings utilizing shared identities, IPs, and devices.

## Architecture

1. **Synthetic Data Engine:** Deterministically seeds both regular user traffic and isolated, coordinated "promo abuse" rings into the database.
2. **PostgreSQL/SQLite Persistence:** Primary data structure uses SQLAlchemy models. Gracefully falls back to SQLite for instant local development if a PostgreSQL instance is unavailable.
3. **Graph Traversal API:** FastAPI queries heterogeneous graphs (Customers, IPs, Devices) into a structured JSON for topological ML parsing and UI rendering.
4. **LightGBM Risk Model:** Explains exactly *why* a sub-graph was flagged by utilizing SHAP values directly mapped to visual representations.
5. **AI Investigator:** Processes verified graph intelligence structures (no direct database LLM mappings to avoid prompt injections).
6. **Command Center:** React + Vite + Three.js frontend delivering cinematic, performant visual reconstructions of the networks with human-in-the-loop audit logging.

## Tech Stack
*   **Backend:** Python, FastAPI, SQLAlchemy, Alembic, Passlib, python-jose, LightGBM, SHAP, NetworkX.
*   **Frontend:** React, Vite, TypeScript, Tailwind CSS (v4 via PostCSS), Zustand, TanStack Query, React Force Graph 3D (Three.js), Recharts.

## Local Installation

### Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations and seed data
alembic upgrade head
python -m scripts.generate_data

# Start FastAPI Server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Start Vite Server
npm run dev
```

Navigate to `http://localhost:5173`. 
*Note: Ensure the backend is running at `http://localhost:8000` to feed the graphical interface.*

## Environment Variables
See `.env.example` in the root and `frontend/.env.example` for deployment overrides. Be sure to configure `VITE_API_BASE_URL` on the Vercel frontend.

## Deployment Architecture
- **Frontend:** Vercel (Static Vite Build)
- **Backend:** Designed for Render/Heroku/AWS with a managed PostgreSQL instance. CORS securely bound to the specific frontend origin.

## Known Limitations
*   *Synthetic Data:* All names, IPs, devices, and transactions are procedurally generated for the hackathon demonstration.
*   *Mock LLM:* The AI execution endpoint currently simulates an LLM response based strictly on the deterministic models to guarantee the 3-minute hackathon pitch flow. Hooking up Gemini endpoints requires an API key in the `.env`.
