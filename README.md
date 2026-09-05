# SENTINEL AI

<img width="1262" height="731" alt="image" src="https://github.com/user-attachments/assets/d72f3b5f-7a10-4843-b0b2-3ace25562962" />


## Overview

**SENTINEL AI** is an AI-powered payment risk intelligence and operations platform designed to uncover coordinated abuse hidden across transactions, customers, devices, IP addresses, payment instruments, and behavioral patterns.

Traditional transaction-level analysis can miss relationships that become obvious when activity is viewed as a connected network.

SENTINEL approaches payment risk differently.

It connects entities across transactions and time, builds an interactive risk graph, identifies suspicious networks, explains the evidence using AI, and gives human analysts the authority to make the final decision.

### Core Principle

> **Individual transactions may look normal. The network can reveal the truth.**

SENTINEL is built around:

**DETECT → INVESTIGATE → AI ANALYZE → HUMAN DECISION → ACT → AUDIT**

---

# ⚡ Capabilities

## 🕸️ Graph-Based Risk Intelligence

SENTINEL transforms disconnected payment activity into an interconnected entity graph.

The graph can connect:

- Customer Accounts
- Transactions
- Devices
- IP Addresses
- Payment Instruments
- Addresses
- Merchants
- Behavioral Signals
- Temporal Relationships

This allows analysts to investigate coordinated networks rather than isolated transactions.

### Example Network

    Customer A
        │
        ├──────── Device 01
        │              │
        │              └──────── Customer B
        │
        ├──────── IP Address
        │              │
        │              └──────── Customer C
        │
        └──────── Payment Instrument
                       │
                       └──────── Transactions

A single transaction may appear normal.

The relationship between multiple transactions may reveal coordinated abuse.

---

## 🌐 Interactive Network Explorer

SENTINEL provides interactive:

- 2D network visualization
- 3D network visualization
- Entity inspection
- Relationship exploration
- Suspicious cluster detection
- Network isolation
- Entity filtering
- Timeline analysis

Analysts can move from an individual transaction to the broader network surrounding it.

<img width="1262" height="738" alt="image" src="https://github.com/user-attachments/assets/f116902d-e985-47db-872d-37c77d13f403" />

# 🤖 SENTINEL AI

**SENTINEL** is the platform's AI Risk Intelligence Agent.

It is designed as an investigation copilot rather than a generic chatbot.

SENTINEL can help analysts:

- Explain why a network is suspicious
- Identify the strongest evidence
- Summarize investigation timelines
- Identify connected entities
- Analyze device reuse
- Analyze IP reuse
- Explain risk signals
- Summarize suspicious behavior
- Compare patterns with legitimate activity
- Recommend an appropriate next action
- Prepare investigation summaries

The AI works with structured SENTINEL evidence.

It does not serve as the source of truth.

The underlying graph, database, and risk model remain authoritative.

### Example Investigation

    SENTINEL INVESTIGATION

    Network:
    NEX-1042

    Risk:
    94%

    Confidence:
    HIGH

    Evidence:

    • 8 linked accounts
    • 3 shared devices
    • 2 reused IP ranges
    • 17 related transactions
    • High temporal transaction density

    Recommendation:

    PLACE UNDER REVIEW

    Human Decision Required

<img width="780" height="556" alt="image" src="https://github.com/user-attachments/assets/d304c269-4d3f-4538-ac5e-380c9a53f1a2" />


# 👤 Human-in-the-Loop

SENTINEL does not turn risk detection into an uncontrolled autonomous enforcement system.

The AI provides intelligence.

**The human retains authority.**

The operating model is:

**AI → DETECT → EXPLAIN → RECOMMEND → HUMAN REVIEW → HUMAN DECISION → ACTION → AUDIT**

The analyst can review the evidence and choose the appropriate response.

### Analyst Actions

- Mark Suspicious
- Mark Legitimate
- Place Under Review
- Request Verification
- Escalate Investigation
- Assign Investigation
- Add Analyst Note
- Resolve Investigation

### Higher-Impact Actions

Where appropriate:

- Restrict Network
- Restrict Entity
- Freeze / Block — Simulation

Consequential actions require explicit human confirmation and appropriate permissions.

---

# 🎯 Decision Queue

SENTINEL provides a dedicated **Decision Queue** for investigations that require human attention.

Instead of simply displaying alerts, the system surfaces cases that require an analyst's decision.

### Example

    PENDING HUMAN DECISIONS

    NEX-1042
    HIGH RISK

    AI Recommendation:
    PLACE UNDER REVIEW

    [ REVIEW ]

    --------------------------------

    NEX-0931
    HIGH RISK

    AI Recommendation:
    REQUEST VERIFICATION

    [ REVIEW ]

    --------------------------------

    NEX-0882
    MEDIUM RISK

    AI Recommendation:
    ESCALATE

    [ REVIEW ]

This turns SENTINEL from a passive dashboard into an operational workflow.

---

# ⚔️ Action Center

Every important investigation can expose an operational Action Center.

### Example

    NETWORK NEX-1042

    HIGH RISK
    94%

    8 Entities
    17 Transactions
    3 Devices

    --------------------------------

    SENTINEL RECOMMENDATION

    PLACE UNDER REVIEW

    --------------------------------

    ANALYST ACTIONS

    [ Mark Suspicious ]
    [ Place Under Review ]
    [ Request Verification ]
    [ Escalate ]
    [ Assign ]
    [ Add Note ]
    [ Resolve ]

    --------------------------------

    HIGH IMPACT

    [ Restrict / Freeze — Simulation ]

Actions update application state through the backend rather than acting as cosmetic UI buttons.

---

# 🔐 Controlled Enforcement

SENTINEL separates investigation from enforcement.

For simulated or test-only enforcement:

    RESTRICT NETWORK

    SIMULATION / TEST ENVIRONMENT

    Network:
    NEX-1042

    Risk:
    94%

    Affected:
    8 entities

    Reason:
    Coordinated payment abuse

    This action will change the network status
    to RESTRICTED in the simulation.

    [ CANCEL ]

    [ CONFIRM RESTRICTION ]

After confirmation, the state change is reflected throughout the application.

Where a real payment-provider enforcement API is unavailable, SENTINEL clearly labels the operation as a simulation.

---

# 📋 Auditability

Every important state-changing decision should be traceable.

Audit records can contain:

- Analyst
- Role
- Action
- Target
- Previous State
- New State
- Timestamp
- Reason
- Investigation / Network ID

### Example

    ACTION COMPLETED

    Network:
    NEX-1042

    Action:
    PLACE UNDER REVIEW

    Performed By:
    Analyst

    Previous State:
    ACTIVE

    New State:
    UNDER REVIEW

    Time:
    14:32:18

    Audit:
    RECORDED

This creates a complete chain of accountability.

**Detection → AI Analysis → Human Decision → Action → Audit**

---

# 💳 Razorpay Test Environment

SENTINEL includes a Razorpay-oriented test environment designed to demonstrate how payment activity can feed into the risk intelligence workflow.

The goal is **not** to recreate the Razorpay Dashboard.

Instead, the integration provides payment-system context around the SENTINEL intelligence layer.

**RAZORPAY TEST ENVIRONMENT → PAYMENT ACTIVITY → SENTINEL INGESTION → ENTITY RESOLUTION → RISK GRAPH → RISK MODEL → SENTINEL AI → HUMAN DECISION → ACTION → AUDIT**

Where supported, Razorpay TEST/SANDBOX APIs and events can be used.

Where external integration is unavailable, SENTINEL uses deterministic simulation so that the complete demonstration remains functional.

Production payment enforcement is never falsely represented.

<img width="1276" height="725" alt="image" src="https://github.com/user-attachments/assets/4b013f84-18af-4c99-87eb-1e9bda78afa5" />

# 🧠 Investigation Experience

A typical investigation follows this path:

**Payment Activity → Suspicious Pattern → Network Detected → Analyst Opens Investigation → Network Explorer → SENTINEL AI Analysis → Evidence Review → AI Recommendation → Human Decision → Action → Audit Trail**

This allows analysts to understand not only:

**"Is this risky?"**

but also:

**"Why is it risky?"**

**"What is connected?"**

**"What should I do?"**

**"What happened after I acted?"**

---

# 📊 Risk Intelligence

SENTINEL combines graph-based signals and machine-learning features to evaluate suspicious behavior.

Depending on the configured dataset and evaluation pipeline, the platform can measure:

- Precision
- Recall
- F1 Score
- False Positive Rate
- Detection Latency
- Exposure Captured
- Transaction Velocity
- Device Reuse
- IP Reuse
- Temporal Density
- Network Connectivity

Synthetic/demo metrics are clearly distinguished from production performance.

---

# 🏗️ Architecture

    Razorpay Test Mode
            ↓
      Data Ingestion
            ↓
     Entity Resolution
            ↓
         Risk Graph
            ↓
         Risk Model
        ↙          ↘
    Model Evidence   SENTINEL AI
       + SHAP       Investigation
        ↘          ↙
       Human Decision
            ↓
       Action Center
            ↓
         Audit Log

---

# 🛠️ Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Zustand
- TanStack Query
- React Force Graph 2D
- React Force Graph 3D
- Three.js
- Recharts

## Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- PostgreSQL
- SQLite fallback

## Intelligence

- NetworkX
- LightGBM
- SHAP
- Graph-based risk features
- Deterministic synthetic data generation
- SENTINEL AI investigation layer

## Security

- Role-Based Access Control
- Server-side authorization
- Environment-based secrets
- Audit logging
- Webhook verification where applicable
- Parameterized database access
- Secure configuration
- Secret management

---

# 👥 Role-Based Access

SENTINEL separates viewing, investigation, and sensitive operational permissions.

## VIEWER

Can:

- View dashboards
- Explore networks
- Read investigations
- Access investigation intelligence

## ANALYST

Can:

- Investigate
- Add notes
- Mark suspicious
- Mark legitimate
- Place under review
- Request verification
- Escalate
- Resolve

## ADMIN

Can:

- Perform analyst actions
- Perform sensitive operational actions
- Manage configuration
- Manage integrations
- Manage administrative settings

Authorization is enforced server-side.

Frontend button visibility is not treated as a security boundary.

---

# 🔒 Security

SENTINEL is designed with public repository safety in mind.

Private credentials must never be committed to source control.

Sensitive configuration should be supplied through environment variables.

Example environment variables:

- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RAZORPAY_WEBHOOK_SECRET
- DATABASE_URL
- JWT_SECRET
- AI_API_KEY

The repository should contain:

**`.env.example`**

with placeholders only.

Never commit:

- `.env`
- `.env.local`
- `credentials.json`
- `*.pem`
- `*.key`
- Private tokens
- Database passwords
- API secrets

Private credentials remain server-side.

Frontend configuration must never expose backend secrets.

---

# 🚀 Getting Started

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

## 1. Clone the Repository

    git clone <YOUR_GITHUB_REPOSITORY>
    cd sentinel-ai

## 2. Start the Backend

    cd backend
    python -m venv venv

### Windows

    venv\Scripts\activate

### macOS / Linux

    source venv/bin/activate

Install dependencies:

    pip install -r requirements.txt

Create your environment file:

    cp .env.example .env

Add local configuration and TEST credentials where required.

Start FastAPI:

    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

## 3. Start the Frontend

Open another terminal:

    cd frontend
    npm install
    npm run dev

Open the local development URL displayed by Vite.

---

# 🧪 Demo Mode

SENTINEL includes deterministic synthetic data so the complete risk workflow can be demonstrated without depending entirely on external payment infrastructure.

The demo can represent:

- Normal payment activity
- Suspicious transactions
- Coordinated networks
- Shared devices
- Reused IP addresses
- Temporal transaction patterns
- High-risk investigations
- Human decisions
- Simulated actions
- Audit events

Demo data should be clearly identified as synthetic where displayed.

---

# 🔄 End-to-End Workflow

## 01 — DETECT

SENTINEL identifies suspicious transactions and network-level patterns.

## 02 — INVESTIGATE

Analysts explore the connected entities through the Network Explorer.

## 03 — AI ANALYZE

SENTINEL AI synthesizes the available evidence and explains the risk.

## 04 — DECIDE

The analyst reviews the evidence and AI recommendation.

## 05 — ACT

The analyst performs the appropriate operational action.

## 06 — AUDIT

The action and resulting state change are recorded.

**DETECT → INVESTIGATE → AI ANALYZE → HUMAN DECISION → ACT → AUDIT**

---

<img width="1019" height="668" alt="image" src="https://github.com/user-attachments/assets/860d6c77-f5f2-4d77-90fa-6f5d8be65544" />


---

<img width="1266" height="736" alt="image" src="https://github.com/user-attachments/assets/32510c19-b53d-4a1d-831f-d470f78e637d" />

---

# 🎯 Product Philosophy

SENTINEL is built around one principle:

> **AI provides intelligence. Humans retain authority.**

The platform is designed to help payment-risk teams understand complex coordinated behavior without turning enforcement into an opaque autonomous process.

Every recommendation should be explainable.

Every consequential decision should require appropriate human authority.

Every important action should be traceable.

---

# 🏆 The Demo

The complete product experience can be demonstrated as:

**Razorpay Test Activity → Suspicious Pattern → Network Detected → Network Explorer → SENTINEL AI Investigation → Evidence → AI Recommendation → Human Decision → Action → Audit Trail**

The objective is not simply to show that a transaction is risky.

The objective is to show:

**Why it is risky.**

**What is connected.**

**What the AI discovered.**

**What the AI recommends.**

**What the human decides.**

**What action follows.**

**And how that decision is recorded.**

---

# 👨‍💻 Built By

## Srikar Purijala

CSE Core  
SRM Institute of Science and Technology


