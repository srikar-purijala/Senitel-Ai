# SENTINEL AI

<!-- ?? PLACEHOLDER 1: Drag and drop your BEST, wide screenshot of the Home/Command Center dashboard here -->

**SENTINEL AI** is a premium, cinematic risk-intelligence platform designed for modern payment security. It combines real-time 3D graph intelligence, AI-synthesized investigation briefs, and a strict Human-in-the-Loop decision architecture to detect, analyze, and neutralize payment abuse rings.

---

## ? Core Features

- **Real-Time 3D Graph Intelligence:** Interactive 2D and 3D force-directed graphs for visualizing complex entity resolution (IPs, Devices, Customer Accounts).
- **SENTINEL AI Copilot:** Instant synthesis of raw transaction data into actionable risk briefs.
- **Human-in-the-Loop Architecture:** AI provides intelligence; the human retains authority. Includes a dedicated Decision Queue and Action Center.
- **Razorpay Integration Engine:** Live simulation of high-velocity transaction feeds monitoring for velocity attacks and device sharing.

<!-- ?? PLACEHOLDER 2: Drag and drop a screenshot of the Network Explorer with the 3D Graph and AI Copilot side-panel here -->

---

## ??? Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Lucide React Icons
- **Visualizations:** `react-force-graph-3d`, `react-force-graph-2d`, `recharts`
- **Theme:** Clean, high-contrast minimal aesthetic (Apple/Linear inspired)

### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite / PostgreSQL via SQLAlchemy
- **AI Integration:** Sentinel Core Engine (Risk Scoring & Pattern Detection)

---

## ?? Quick Start

### 1. Start the Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Start the Frontend (Vite/React)
```bash
cd frontend
npm install
npm run dev
```

<!-- ?? PLACEHOLDER 3: Drag and drop a screenshot of the Razorpay Test Environment transaction feed here -->

---

## ??? Operational Workflow

1. **Detect:** Razorpay webhooks feed live transactions into the Sentinel Engine.
2. **Investigate:** Analysts explore flagged clusters via the 3D Network Explorer.
3. **AI Analyze:** The Copilot synthesizes historical data and risk vectors.
4. **Human Decision:** Analysts execute strict state changes (`PLACE_UNDER_REVIEW`, `MARK_LEGITIMATE`, `RESTRICT`).
5. **Audit:** Every state change and AI recommendation is cryptographically hashed and logged.
