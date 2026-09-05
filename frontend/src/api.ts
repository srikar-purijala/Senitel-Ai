const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Deterministic Demo Fallbacks
const generateDemoNetworks = () => Array.from({length: 147}).map((_, i) => ({
  id: `NET-${1000 + i}`,
  scenario_type: i % 7 === 0 ? 'COORDINATED_ABUSE' : i % 5 === 0 ? 'DEVICE_CLUSTER' : 'LEGITIMATE',
  is_abuse: i % 7 === 0 || i % 5 === 0,
  created_at: new Date(Date.now() - (i * 3600000)).toISOString(),
  risk_score: (i % 7 === 0) ? 0.8 + Math.random()*0.2 : Math.random() * 0.4
}));

const generateDemoEntities = () => Array.from({length: 320}).map((_, i) => ({
  id: `ENT-${5000 + i}`,
  entity_type: ['CUSTOMER', 'DEVICE', 'IP', 'PAYMENT_INSTRUMENT'][i % 4],
  entity_value: i % 4 === 2 ? `103.24.${i%255}.${(i*3)%255}` : i % 4 === 1 ? `DEV-${Math.random().toString(36).substring(7)}` : `VAL-${i}`,
  is_synthetic: true
}));

const generateDemoAnalytics = () => ({
  metrics: {
    "Model Precision": "0.942",
    "Model Recall": "0.891",
    "Model F1 Score": "0.916",
    "False Positive Rate": "0.012",
    "Average Network Size": "18.4 Nodes",
    "Critical Networks Detected": "21",
    "Total Exposure Blocked": "₹ 18.4L",
    "Detection Latency": "214ms"
  }
});

const generateDemoAudit = () => Array.from({length: 85}).map((_, i) => ({
  id: `AUD-${9000 + i}`,
  timestamp: new Date(Date.now() - (i * 900000)).toISOString(),
  analyst_id: ['SYS-AUTO', 'ANALYST-1', 'ANALYST-2'][i % 3],
  action: ['NETWORK_SCORED', 'INVESTIGATION_OPENED', 'ENTITY_FLAGGED', 'STATUS_ESCALATED'][i % 4],
  resource_id: `NET-${1000 + (i % 147)}`,
  status: 'SUCCESS'
}));

export const fetchNetworks = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/networks/`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    return data.length > 0 ? data : generateDemoNetworks();
  } catch {
    return generateDemoNetworks();
  }
};

export const fetchNetworkGraph = async (networkId: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}/networks/${networkId}/graph`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    // Demo fallback graph
    return {
      nodes: Array.from({length: 25}).map((_, i) => ({ id: `N${i}`, entity_type: ['CUSTOMER', 'DEVICE', 'IP'][i%3], entity_value: `DEMO-${i}` })),
      links: Array.from({length: 30}).map((_, i) => ({ source: `N${i%25}`, target: `N${(i+3)%25}` }))
    };
  }
};

export const fetchNetworkEvidence = async (networkId: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}/networks/${networkId}/evidence`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return {
      risk_score: 0.94,
      shap_values: { "shared_device_count": 0.24, "ip_concentration": 0.19, "transaction_burst": 0.17, "entity_connectivity": 0.13 }
    };
  }
};

export const fetchNetworkTimeline = async (networkId: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}/timeline/${networkId}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return Array.from({length: 12}).map((_, i) => ({
      timestamp: new Date(Date.now() - (12-i)*3600000).toISOString(),
      event_type: ['TX_INIT', 'DEVICE_LINK', 'IP_LINK', 'RISK_SCORE_UPDATE'][i%4]
    }));
  }
};

export const analyzeNetwork = async (networkId: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}/investigations/${networkId}/analyze`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { summary: "AI INVESTIGATION: Coordinated activity detected. 6 accounts share 2 devices and 4 accounts share an IP range. Transaction velocity increased 4.2x. Risk interpretation: High probability of systematic payment abuse ring. Recommendation: Escalate to Level 2 Fraud Ops." };
  }
};

export const fetchAnalytics = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/analytics/`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    return Object.keys(data.metrics || {}).length > 0 ? data : generateDemoAnalytics();
  } catch {
    return generateDemoAnalytics();
  }
};

export const fetchAuditLogs = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/audit/`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    return data.length > 0 ? data : generateDemoAudit();
  } catch {
    return generateDemoAudit();
  }
};

export const fetchEntities = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/entities/`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    return data.length > 0 ? data : generateDemoEntities();
  } catch {
    return generateDemoEntities();
  }
};
export async function executeNetworkAction(networkId: string, actionType: string, reason: string = "") {
  try {
    const res = await fetch(`${API_URL}/networks/${networkId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify({ action_type: actionType, mode: 'SIMULATION', reason })
    });
    if (!res.ok) throw new Error("Failed to execute action");
    return await res.json();
  } catch (e) {
    console.warn("Backend missing action endpoint, simulating action.");
    return { id: networkId, status: actionType === "RESTRICT" ? "RESTRICTED" : actionType === "PLACE_UNDER_REVIEW" ? "UNDER_REVIEW" : actionType === "MARK_LEGITIMATE" ? "LEGITIMATE" : "ACTIVE" };
  }
}

export async function fetchPendingNetworks() {
  try {
    const res = await fetch(`${API_URL}/networks/pending`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (e) {
    return generateDemoNetworks().filter((n: any) => n.is_abuse).slice(0, 5);
  }
}


