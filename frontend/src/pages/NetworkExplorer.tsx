import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, BrainCircuit, ShieldAlert, Cpu, ChevronRight, CheckCircle, Ban, Trash2, ZoomIn, Box, Info } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
import { fetchNetworkGraph, fetchNetworkEvidence, analyzeNetwork, executeNetworkAction } from '../api';

export default function NetworkExplorer() {
  const { id } = useParams();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [evidence, setEvidence] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mode3d, setMode3d] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<any>(null);

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

  const getNodeColor = (type: string) => {
    switch(type) {
      case 'CUSTOMER': return '#0071e3';
      case 'DEVICE': return '#ff3b30';
      case 'IP': return '#34c759';
      case 'PAYMENT_INSTRUMENT': return '#ff9500';
      default: return '#5856d6';
    }
  };

  const uniqueTypes = Array.from(new Set(graphData.nodes.map((n: any) => n.entity_type)));

  if (loading) return <div className="p-8 text-[#6e6e73]">Loading Network...</div>;

  return (
    <div className="flex h-full w-full bg-[#f5f5f7]">
      <div className="flex-1 relative overflow-hidden bg-[#fafafa] border-r border-[#d2d2d7]">
        {/* Top Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button onClick={() => setMode3d(!mode3d)} className="bg-white px-3 py-2 rounded-lg border border-[#d2d2d7] shadow-sm text-[13px] font-bold text-[#1d1d1f] hover:bg-[#f5f5f7] flex items-center gap-2 transition-colors">
             {mode3d ? <Box size={16}/> : <ZoomIn size={16}/>} {mode3d ? 'Switch to 2D' : 'Switch to 3D'}
          </button>
        </div>

        {/* Info Box (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur px-5 py-4 rounded-2xl border border-[#d2d2d7] shadow-lg min-w-[260px] max-w-[320px]">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-[#0071e3]" />
            <h4 className="text-[12px] uppercase tracking-widest text-[#1d1d1f] font-bold">Node Inspector</h4>
          </div>
          
          {hoveredNode ? (
            <div className="bg-[#f5f5f7] rounded-xl p-3 border border-[#e5e5ea]">
              <p className="text-[11px] text-[#6e6e73] font-semibold uppercase tracking-wider mb-0.5">{hoveredNode.entity_type}</p>
              <p className="text-[15px] font-bold text-[#1d1d1f] truncate" title={hoveredNode.entity_value || hoveredNode.id}>
                {hoveredNode.entity_value || hoveredNode.id}
              </p>
              <p className="text-[11px] font-mono text-[#aeaeb2] mt-1 break-all">{hoveredNode.id}</p>
            </div>
          ) : (
            <div className="bg-[#f5f5f7] rounded-xl p-3 border border-[#e5e5ea] border-dashed flex items-center justify-center h-[76px]">
              <p className="text-[12px] text-[#aeaeb2] font-medium text-center">Hover over any node<br/>to view details</p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#d2d2d7]">
            <p className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest mb-2">Legend</p>
            <div className="flex flex-wrap gap-2">
              {uniqueTypes.map((type: any) => (
                <div key={type} className="flex items-center gap-1.5 bg-[#f5f5f7] px-2 py-1 rounded-md border border-[#e5e5ea]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getNodeColor(type) }} />
                  <span className="text-[10px] font-bold text-[#424245]">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {mode3d ? (
          <ForceGraph3D
            graphData={graphData}
            nodeColor={(node: any) => getNodeColor(node.entity_type)}
            nodeRelSize={6}
            nodeResolution={16}
            onNodeHover={setHoveredNode}
            backgroundColor="#fafafa"
            linkColor={() => '#d2d2d7'}
          />
        ) : (
          <ForceGraph2D
            graphData={graphData}
            nodeColor={(node: any) => getNodeColor(node.entity_type)}
            nodeRelSize={6}
            onNodeHover={setHoveredNode}
            backgroundColor="#fafafa"
            linkColor={() => '#d2d2d7'}
          />
        )}
      </div>

      <div className="w-[420px] flex flex-col bg-white border-l border-[#d2d2d7] text-[#1d1d1f] overflow-y-auto">
        <div className="p-6 border-b border-[#d2d2d7] bg-[#f5f5f7]">
          <h2 className="text-[22px] font-bold tracking-tight">{id}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[11px] font-bold rounded-md">HIGH RISK</span>
            <p className="text-[13px] text-[#6e6e73] font-medium">Score: {(evidence?.risk_score || 0.94).toFixed(2)}</p>
          </div>
        </div>

        <div className="p-6 border-b border-[#d2d2d7]">
          <h3 className="text-[11px] uppercase tracking-widest text-[#6e6e73] font-bold mb-4 flex items-center gap-2"><BrainCircuit size={14} className="text-[#0071e3]" /> SENTINEL AI COPILOT</h3>
          
          {isAiLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-[#0071e3]">
              <Cpu size={28} className="animate-spin mb-3" />
              <p className="text-[12px] font-semibold">Synthesizing Network Data...</p>
            </div>
          ) : aiAnalysis ? (
            <div className="bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl p-5 shadow-sm">
              <p className="text-[13px] leading-relaxed text-[#1d1d1f] font-medium">{aiAnalysis.summary}</p>
            </div>
          ) : (
            <button onClick={runAi} className="w-full bg-[#0071e3] text-white py-3 rounded-xl text-[14px] font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-[#0077ed] transition-colors">
              <BrainCircuit size={18} /> Generate Investigation Brief
            </button>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-[11px] uppercase tracking-widest text-[#6e6e73] font-bold mb-4 flex items-center gap-2"><ShieldAlert size={14} className="text-[#ff3b30]" /> HUMAN DECISION LAYER</h3>
          <div className="space-y-3">
            
            <button onClick={() => handleAction('MARK_LEGITIMATE')} className="w-full py-3 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#1b5e20] border border-[#a5d6a7] rounded-xl text-[14px] font-bold flex items-center justify-between px-5 transition-colors shadow-sm">
              <div className="flex items-center gap-2"><CheckCircle size={18} /> Mark as Safe (Legitimate)</div>
              <ChevronRight size={16} />
            </button>

            <button onClick={() => handleAction('PLACE_UNDER_REVIEW')} className="w-full py-3 bg-[#fff8e1] hover:bg-[#ffecb3] text-[#f57f17] border border-[#ffe082] rounded-xl text-[14px] font-bold flex items-center justify-between px-5 transition-colors shadow-sm">
              <div className="flex items-center gap-2"><Activity size={18} /> Send for Manual Review</div>
              <ChevronRight size={16} />
            </button>

            <div className="pt-4 mt-4 border-t border-[#d2d2d7]">
              <p className="text-[11px] text-[#6e6e73] mb-3 font-semibold uppercase tracking-widest">Destructive Actions</p>
              
              <button onClick={() => handleAction('RESTRICT')} className="w-full py-3 bg-[#ffebee] hover:bg-[#ffcdd2] text-[#b71c1c] border border-[#ef9a9a] rounded-xl text-[14px] font-bold flex items-center justify-between px-5 transition-colors shadow-sm mb-3">
                <div className="flex items-center gap-2"><Ban size={18} /> Block Network</div>
                <ChevronRight size={16} />
              </button>
              
              <button onClick={() => handleAction('DELETE')} className="w-full py-3 bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] border border-[#d2d2d7] rounded-xl text-[14px] font-bold flex items-center justify-between px-5 transition-colors shadow-sm">
                <div className="flex items-center gap-2"><Trash2 size={18} /> Delete Entities</div>
                <ChevronRight size={16} />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
