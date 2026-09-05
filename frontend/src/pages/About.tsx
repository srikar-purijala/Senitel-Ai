import { Network, Shield, Eye, Activity, Workflow } from 'lucide-react';

export default function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2 flex items-center gap-3">
          SENTINEL<span className="text-text-muted font-normal">AI</span>
          <span className="text-xs font-mono px-2 py-1 bg-surface border border-border rounded text-text-muted ml-2">v1.0.0</span>
        </h1>
        <p className="text-lg text-text-muted font-medium mb-6">Risk Intelligence Platform</p>
        
        <div className="flex items-center gap-4 text-sm font-mono border border-border bg-surface p-4 rounded">
          <div className="flex-1">
            <span className="text-text-muted">Built by</span>
            <p className="font-bold text-primary">Srikar Purijala</p>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="flex-1 pl-4">
            <span className="text-text-muted">Project</span>
            <p className="font-bold text-text-main">Razorpay AI Buildathon 2026</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold font-mono tracking-widest text-text-muted uppercase">About SENTINEL AI</h2>
        <div className="prose prose-invert max-w-none text-text-main text-sm leading-relaxed space-y-4">
          <p>
            SENTINEL AI is an explainable graph-based risk intelligence platform designed to identify coordinated payment abuse by connecting entities, behaviors and events across transactions and time.
          </p>
          <p>
            Traditional fraud detection often analyzes transactions in isolation, missing the coordinated nature of organized abuse rings. By constructing heterogeneous entity graphs (linking Customers, Devices, and IPs), SENTINEL AI surfaces the hidden topology of financial networks. It scores these networks using gradient-boosted trees and explains every decision using SHAP values, ensuring human analysts retain context, confidence, and ultimate decision-making authority.
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold font-mono tracking-widest text-text-muted uppercase">Architecture Pipeline</h2>
        <div className="bg-surface border border-border rounded p-6">
          <div className="flex flex-col items-center justify-center font-mono text-xs space-y-2">
            <div className="px-4 py-2 border border-border rounded bg-background">DATA (Transactions & Entities)</div>
            <Workflow size={14} className="text-text-muted" />
            <div className="px-4 py-2 border border-border rounded bg-background">ENTITY RESOLUTION</div>
            <Workflow size={14} className="text-text-muted" />
            <div className="px-4 py-2 border border-primary/30 rounded bg-primary/10 text-primary font-bold">GRAPH CONSTRUCTION</div>
            <Workflow size={14} className="text-text-muted" />
            <div className="px-4 py-2 border border-border rounded bg-background">NETWORK ANALYSIS (Features)</div>
            <Workflow size={14} className="text-text-muted" />
            <div className="px-4 py-2 border border-danger/30 rounded bg-danger/10 text-danger font-bold">LIGHTGBM RISK MODEL</div>
            <Workflow size={14} className="text-text-muted" />
            <div className="px-4 py-2 border border-success/30 rounded bg-success/10 text-success font-bold">SHAP EXPLAINABILITY</div>
            <Workflow size={14} className="text-text-muted" />
            <div className="px-4 py-2 border border-border rounded bg-background">FASTAPI BACKEND</div>
            <Workflow size={14} className="text-text-muted" />
            <div className="px-4 py-2 border border-border rounded bg-surface-hover font-bold">SENTINEL COMMAND CENTER (React)</div>
            <Workflow size={14} className="text-text-muted" />
            <div className="px-4 py-2 border border-warning/30 rounded bg-warning/10 text-warning font-bold">HUMAN INVESTIGATION</div>
            <Workflow size={14} className="text-text-muted" />
            <div className="px-4 py-2 border border-border rounded bg-background">AUDIT LOG</div>
          </div>
        </div>
      </section>

      {/* Principles & Demo Data */}
      <div className="grid grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-xs font-bold font-mono tracking-widest text-text-muted uppercase">Design Principles</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Eye size={16} className="text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-text-main mb-1">Explainable</h3>
                <p className="text-xs text-text-muted leading-relaxed">Risk decisions are supported by observable model evidence using SHAP metrics.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Shield size={16} className="text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-text-main mb-1">Human-in-the-loop</h3>
                <p className="text-xs text-text-muted leading-relaxed">AI assists investigation; the analyst makes the final decision.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Network size={16} className="text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-text-main mb-1">Defense-First</h3>
                <p className="text-xs text-text-muted leading-relaxed">SENTINEL is explicitly designed for detecting and investigating payment abuse.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold font-mono tracking-widest text-text-muted uppercase">Technology Stack</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-border bg-surface p-3 rounded">
              <h3 className="text-[10px] font-bold font-mono text-text-muted mb-2">FRONTEND</h3>
              <ul className="text-xs space-y-1 font-mono text-text-main">
                <li>React + TypeScript</li>
                <li>Vite + Tailwind CSS</li>
                <li>TanStack Query</li>
                <li>Zustand</li>
                <li>React Force Graph</li>
                <li>Three.js</li>
              </ul>
            </div>
            <div className="border border-border bg-surface p-3 rounded">
              <h3 className="text-[10px] font-bold font-mono text-text-muted mb-2">BACKEND</h3>
              <ul className="text-xs space-y-1 font-mono text-text-main">
                <li>Python 3.12</li>
                <li>FastAPI</li>
                <li>SQLAlchemy</li>
                <li>NetworkX</li>
                <li>LightGBM</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Demo Data Notice */}
      <section className="border border-warning/20 bg-warning/5 rounded p-4 flex gap-3">
        <Activity size={18} className="text-warning shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-warning mb-1">Demonstration Data Notice</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            The demonstration uses deterministic synthetic transaction and entity data with mathematically planted abuse scenarios and legitimate networks. No real customer or payment data is included in this build.
          </p>
        </div>
      </section>

    </div>
  );
}
