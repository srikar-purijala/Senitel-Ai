import os

filepath = 'frontend/src/pages/NetworkExplorer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("confirm(`Execute ", "confirm(Execute  on ?)")

# Actually let me just write the file completely in python so there is NO powershell variable substitution!

content = '''import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Network, Activity, BrainCircuit, ShieldAlert, Cpu, ChevronRight, RefreshCw, ZoomIn, Box } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
import { fetchNetworkGraph, fetchNetworkEvidence, analyzeNetwork, executeNetworkAction } from '../api';

export default function NetworkExplorer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [evidence, setEvidence] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mode3d, setMode3d] = useState(false);

  useEffect(() => {
    if (!id) return;
    const token = 'demo-token';
    Promise.all([fetchNetworkGraph(id, token), fetchNetworkEvidence(id, token)])
      .then(([graph, ev]) => {
        setGraphData(graph);
        setEvidence(ev);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const runAi = async () => {
    setIsAiLoading(true);
    try {
      const res = await analyzeNetwork(id!, 'demo-token');
      setAiAnalysis(res);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAction = async (actionType: string) => {
    if (confirm('Execute ' + actionType + ' on ' + id + '?')) {
      await executeNetworkAction(id!, actionType);
      alert('Network status updated to ' + actionType);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-full w-full bg-[#f5f5f7]">
      <div className="flex-1 relative overflow-hidden bg-white border-r border-[#d2d2d7]">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button onClick={() => setMode3d(!mode3d)} className="bg-white px-3 py-1.5 rounded-lg border border-[#d2d2d7] shadow-sm text-[12px] font-semibold flex items-center gap-2">
             {mode3d ? <Box size={14}/> : <ZoomIn size={14}/>} {mode3d ? '3D View' : '2D View'}
          </button>
        </div>
        {mode3d ? (
          <ForceGraph3D
            graphData={graphData}
            nodeAutoColorBy="entity_type"
            nodeRelSize={6}
            nodeResolution={16}
            backgroundColor="#ffffff"
            linkColor={() => '#d2d2d7'}
          />
        ) : (
          <ForceGraph2D
            graphData={graphData}
            nodeAutoColorBy="entity_type"
            nodeRelSize={6}
            backgroundColor="#ffffff"
            linkColor={() => '#d2d2d7'}
          />
        )}
      </div>

      <div className="w-[400px] flex flex-col bg-[#1d1d1f] text-[#f5f5f7] overflow-y-auto">
        <div className="p-6 border-b border-[#3f3f46]">
          <h2 className="text-[20px] font-bold tracking-tight">{id}</h2>
          <p className="text-[12px] text-[#a1a1aa] mt-1">Risk Score: {evidence?.risk_score || 0.94}</p>
        </div>

        <div className="p-6 border-b border-[#3f3f46]">
          <h3 className="text-[12px] uppercase tracking-widest text-[#a1a1aa] font-bold mb-4">SENTINEL AI Copilot</h3>
          
          {isAiLoading ? (
            <div className="flex flex-col items-center justify-center p-6 text-[#a1a1aa]">
              <Cpu size={24} className="animate-spin mb-2" />
              <p className="text-[11px]">Synthesizing...</p>
            </div>
          ) : aiAnalysis ? (
            <div className="bg-[#27272a] rounded-xl p-4">
              <p className="text-[13px] leading-relaxed text-[#e4e4e7]">{aiAnalysis.summary}</p>
            </div>
          ) : (
            <button onClick={runAi} className="w-full bg-[#0071e3] text-white py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#0077ed]">
              <BrainCircuit size={16} /> Generate Brief
            </button>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-[12px] uppercase tracking-widest text-[#a1a1aa] font-bold mb-4">Analyst Actions</h3>
          <div className="space-y-3">
            <button onClick={() => handleAction('PLACE_UNDER_REVIEW')} className="w-full py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#e4e4e7] rounded-lg text-[13px] font-semibold flex items-center justify-between px-4 transition-colors">
              Place Under Review <ChevronRight size={16} />
            </button>
            <button onClick={() => handleAction('MARK_LEGITIMATE')} className="w-full py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#e4e4e7] rounded-lg text-[13px] font-semibold flex items-center justify-between px-4 transition-colors">
              Mark Legitimate <ChevronRight size={16} />
            </button>
            <button onClick={() => handleAction('RESTRICT')} className="w-full py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-lg text-[13px] font-semibold flex items-center justify-between px-4 transition-colors mt-6">
              Restrict / Freeze (Sim) <ShieldAlert size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}'''

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
