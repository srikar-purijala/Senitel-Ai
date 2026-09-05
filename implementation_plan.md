# Goal Description

Evolve SENTINEL AI from a visualization tool into a fully operational Human-In-The-Loop payment risk platform with a Razorpay Test Environment integration, a Decision Queue, an Action Center, and Audit Logs. 

## Proposed Changes

### Backend Database & Models
- Update `Network` model in `networks.py` to include a `status` field (e.g., `ACTIVE`, `UNDER_REVIEW`, `RESTRICTED`, `RESOLVED`, `LEGITIMATE`).
- Run an Alembic migration to apply the schema change.
- Seed data to ensure there are Networks in different states for testing.

### Backend Endpoints
- **Networks (`networks.py`)**: 
  - `POST /api/v1/networks/{network_id}/action` -> Update the network's status and automatically generate an `AuditLog` entry. Ensures strict RBAC (only Analysts and Admins can act).
  - `GET /api/v1/networks/pending` -> Endpoint for the Decision Queue. Returns all networks with status `ACTIVE` and `is_abuse = True` (or high risk score).
- **Audit Logs (`audit.py`)**: 
  - Ensure the `/api/v1/audit` endpoint can list all actions chronologically for the audit UI.
- **AI Investigation (`investigations.py`)**:
  - Enhance `analyze_network` to output structured insights (Summary, Confidence, Recommended Action, Reason) based on the Network's features, simulating an intelligent copilot.
  - Implement a `chat` endpoint that responds to contextual questions about the network using synthetic rules to simulate a grounded AI agent.
- **Razorpay Integration (`razorpay.py` / `simulation.py`)**:
  - Create mock endpoints `/api/v1/razorpay/payments` to simulate fetching Razorpay Test Mode data into SENTINEL.

### Frontend UI Updates
- **Decision Queue (`CommandCenter.tsx`)**: Replace static metrics with a dynamic list of investigations requiring human decision, fetched from `/api/v1/networks/pending`.
- **Action Center (`NetworkExplorer.tsx`)**: Build the Human Decision UI. Show the AI's recommendation (e.g., "Place Under Review") alongside a suite of Analyst actions (Approve, Mark Legitimate, Restrict - Simulation).
- **Confirmation Modals (`ActionConfirmModal.tsx`)**: For state-changing actions (especially "Restrict - Simulation"), require explicit human confirmation.
- **Razorpay Portal (`RazorpayPortal.tsx`)**: Build a dedicated page showcasing the data pipeline: Razorpay Test Payments -> SENTINEL Detection -> Human Action.
- **Audit Logs (`Audit.tsx`)**: Connect the UI to the actual backend audit endpoint to trace all state-changing actions.

## Verification Plan

### Automated Tests
- Run `pytest` on backend endpoints to verify RBAC on actions and status transitions.
- Check Vite build with `npm run build` to verify strict TypeScript adherence.

### Manual Verification
- Walk through the entire flow:
  1. Open Razorpay Test Environment and see payments.
  2. Open Command Center and see networks in the Decision Queue.
  3. Click "Investigate" on a pending network.
  4. Run AI Risk Agent and see structured recommendation.
  5. Choose "Restrict - Simulation", confirm in modal.
  6. Verify state propagates: Status becomes RESTRICTED.
  7. Verify Audit Log captured the exact action, timestamp, and user.
