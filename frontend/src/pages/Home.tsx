import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, ChevronRight, ShieldAlert, Check, Network, Cpu, ShieldCheck } from 'lucide-react';
import ForceGraph3D from 'react-force-graph-3d';

// --- Reveal Animation Component ---
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`will-change-transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100 blur-none' : 'translate-y-8 opacity-0 blur-[2px]'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// --- 3D Diamond Graph Data ---
function generateHeroGraph() {
  const nodes: any[] = [{ id: 'target', type: 'network', val: 20, color: '#ff3b30' }];
  const links: any[] = [];
  const types = ['customer', 'device', 'ip', 'card'];
  // Colors from the screenshot: Pink, Blue, Orange, Green, Purple
  const colors = ['#f472b6', '#60a5fa', '#fb923c', '#4ade80', '#c084fc'];
  
  for (let i = 0; i < 35; i++) {
    const typeIdx = Math.floor(Math.random() * types.length);
    nodes.push({ id: `n${i}`, type: types[typeIdx], val: 5 + Math.random() * 10, color: colors[typeIdx % colors.length] });
    links.push({ source: `n${i}`, target: 'target', value: 1 });
    if (i > 0 && Math.random() > 0.5) {
      links.push({ source: `n${i}`, target: `n${Math.floor(Math.random() * i)}`, value: 0.5 });
    }
  }
  return { nodes, links };
}

export default function Home() {
  const navigate = useNavigate();
  const graphData = useMemo(() => generateHeroGraph(), []);
  const [scrolled, setScrolled] = useState(false);
  const graphRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Spin the 3D graph slowly
  useEffect(() => {
    if (graphRef.current) {
      let angle = 0;
      const interval = setInterval(() => {
        angle += 0.002;
        if (graphRef.current?.cameraPosition) {
          graphRef.current.cameraPosition({
            x: 150 * Math.sin(angle),
            z: 150 * Math.cos(angle)
          });
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="bg-[#ffffff] text-[#1d1d1f] font-sans min-h-screen overflow-x-hidden selection:bg-[#0071e3]/20">
      <style>{'html { scroll-behavior: smooth; } body { overflow-x: hidden; overflow-y: auto; background: #ffffff; }'}</style>

      {/* --- HEADER --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-[#d2d2d7]/50 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Hexagon size={22} strokeWidth={2} className="text-[#1d1d1f]" />
            <span className="text-[17px] font-semibold tracking-tight">SENTINEL AI</span>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 max-w-[1400px] mx-auto flex flex-col items-center text-center">
        
        <Reveal delay={100} className="w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#d2d2d7] mb-8">
            <div className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider text-[#6e6e73] uppercase">SENTINEL AI RISK PLATFORM</span>
          </div>
          
          <h1 className="text-[56px] md:text-[80px] font-bold leading-[1.05] tracking-tight text-[#1d1d1f] mb-6">
            See what transactions<br/>hide.
          </h1>
          
          <p className="text-[19px] md:text-[22px] text-[#6e6e73] leading-relaxed max-w-[700px] mx-auto mb-10 font-medium">
            AI-powered graph intelligence that detects, explains, and operationalizes coordinated payment risk before it becomes systemic loss.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            {/* The Blue Button from Screenshot */}
            <button 
              onClick={() => navigate('/command-center')} 
              className="w-full sm:w-auto bg-[#6b85f5] hover:bg-[#5a74e4] text-white text-[15px] font-semibold px-8 py-4 rounded-[6px] transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
            >
              ENTER COMMAND CENTER <ChevronRight size={18} />
            </button>
            {/* The Dark Button from Screenshot */}
            <button 
              onClick={() => navigate('/networks')} 
              className="w-full sm:w-auto bg-[#1a1a1c] hover:bg-[#000000] text-white text-[15px] font-semibold px-8 py-4 rounded-[6px] transition-all border border-[#333] shadow-md uppercase tracking-wider"
            >
              EXPLORE LIVE INVESTIGATION
            </button>
          </div>
        </Reveal>

        {/* 3D GRAPH MASTERPIECE CONTAINER */}
        <Reveal delay={300} className="w-full h-[600px] md:h-[700px] bg-[#050507] rounded-[32px] overflow-hidden shadow-2xl relative border border-[#d2d2d7]">
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
          
          <div className="absolute top-8 left-8 z-20 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 text-left shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <span className="text-white/70 font-mono text-[11px] uppercase tracking-widest block mb-2">Network NEX-1042</span>
              <div className="text-white text-[24px] font-semibold mb-2">Coordinated Cluster</div>
              <div className="flex items-center gap-2 bg-[#ff3b30]/10 border border-[#ff3b30]/30 px-3 py-1.5 rounded-lg inline-flex">
                <span className="w-2 h-2 rounded-full bg-[#ff3b30] animate-pulse" />
                <span className="text-[#ff3b30] font-semibold text-[13px] tracking-wide">94% HIGH RISK</span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 cursor-move">
            <ForceGraph3D
              ref={graphRef}
              graphData={graphData}
              backgroundColor="#050507"
              nodeRelSize={7}
              nodeResolution={3} // Makes them look like low-poly diamonds!
              nodeColor={n => n.color}
              linkColor={() => 'rgba(255,255,255,0.15)'}
              linkWidth={1.5}
              enableNodeDrag={false}
              enableNavigationControls={true}
              showNavInfo={false}
            />
          </div>
        </Reveal>
      </section>

      {/* --- SECTION 2: THE PROBLEM --- */}
      <section className="py-32 px-6 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto text-center">
          <Reveal>
            <h2 className="text-[40px] md:text-[64px] font-bold leading-[1.05] tracking-tight mb-8">
              Individual transactions look normal.<br/>
              <span className="text-[#6e6e73]">The network doesn't.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12 text-left max-w-[900px] mx-auto mt-16">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-[#d2d2d7]/50 hover:shadow-md transition-shadow">
                <ShieldAlert size={32} className="text-[#ff3b30] mb-6" />
                <h3 className="text-[22px] font-semibold mb-3">The Fragmentation Exploit</h3>
                <p className="text-[17px] text-[#424245] leading-relaxed">
                  Fraudsters distribute activity across multiple accounts, devices, and IPs. Traditional rules analyze one transaction at a time, missing the coordinated pattern.
                </p>
              </div>
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-[#d2d2d7]/50 hover:shadow-md transition-shadow">
                <Network size={32} className="text-[#0071e3] mb-6" />
                <h3 className="text-[22px] font-semibold mb-3">The Unified Layer</h3>
                <p className="text-[17px] text-[#424245] leading-relaxed">
                  SENTINEL resolves entities in real-time, building a behavioral graph that turns fragmented, isolated data points into actionable network evidence.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- SECTION 3: AI INVESTIGATION (WHITE THEME) --- */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <h2 className="text-[40px] md:text-[56px] font-bold leading-[1.05] tracking-tight">
              From signal<br/>
              <span className="text-[#6e6e73]">to evidence.</span>
            </h2>
            <p className="text-[17px] text-[#6e6e73] max-w-sm font-medium">
              The SENTINEL Investigation Agent acts as your copilot, analyzing complex topology and synthesizing structured evidence.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Evidence Card */}
            <div className="rounded-[32px] border border-[#d2d2d7] bg-[#f5f5f7] p-10 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Cpu size={22} className="text-[#0071e3]" />
                  <span className="text-[13px] font-bold tracking-wide text-[#0071e3] uppercase">SENTINEL Investigation Agent</span>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm font-mono text-[14px] text-[#1d1d1f] leading-relaxed border border-[#d2d2d7]/50">
                  <span className="text-[#0071e3] font-semibold">&gt; Analyzing Network NEX-1042...</span><br/><br/>
                  Evidence identified:<br/>
                  &middot; 8 accounts connected through 3 devices<br/>
                  &middot; 2 IP ranges reused across accounts<br/>
                  &middot; 17 transactions within 11 minutes<br/>
                  &middot; Coordinated temporal behavior detected
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-[#d2d2d7]">
                <span className="text-[11px] font-bold text-[#ff3b30] uppercase tracking-widest block mb-2">Risk Assessment</span>
                <p className="text-[20px] text-[#1d1d1f] font-bold">High Confidence Coordinated Abuse</p>
              </div>
            </div>
            
            {/* Recommendation Card */}
            <div className="rounded-[32px] border border-[#0071e3]/20 bg-[#0071e3]/5 p-10 md:p-12 flex flex-col justify-center items-center text-center">
               <ShieldCheck size={56} className="text-[#0071e3] mb-8" />
               <h4 className="text-[32px] font-bold text-[#1d1d1f] mb-4">Recommended Action</h4>
               <p className="text-[18px] text-[#424245] mb-12">Place network under human review.</p>
               <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                 <button className="px-8 py-4 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-[15px] font-semibold transition-colors shadow-sm">
                   Accept Recommendation
                 </button>
                 <button className="px-8 py-4 bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full text-[15px] font-semibold border border-[#d2d2d7] transition-colors shadow-sm">
                   Review Evidence
                 </button>
               </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --- SECTION 4: HUMAN IN THE LOOP --- */}
      <section className="py-32 px-6 bg-[#1d1d1f] text-white rounded-[40px] max-w-[1400px] mx-auto my-10 overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d2d2f] to-[#1d1d1f] z-0" />
        
        <div className="relative z-10 text-center">
          <Reveal>
            <h2 className="text-[48px] md:text-[72px] font-bold leading-[1.0] tracking-tight mb-6">
              Detect. Decide. Act.
            </h2>
            <p className="text-[19px] text-[#aeaeb2] max-w-2xl mx-auto mb-20 font-medium">
              SENTINEL is an operational risk platform. We surface the evidence, but the human analyst makes the final call.
            </p>
          </Reveal>
          
          <Reveal delay={200}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-20">
              {['Detect', 'Investigate', 'AI Review', 'Human Decision', 'Action', 'Audit'].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-4 md:gap-8">
                  <span className={`text-[15px] font-semibold tracking-wide ${i === 3 ? 'text-white' : 'text-[#6e6e73]'}`}>{step}</span>
                  {i < arr.length - 1 && <ChevronRight size={16} className="text-[#424245] hidden md:block" />}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={400} className="max-w-[480px] mx-auto text-left">
            <div className="rounded-3xl border border-[#424245] bg-[#2d2d2f] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[13px] font-bold text-[#aeaeb2] uppercase tracking-wide">Investigation Action</span>
                <span className="text-[11px] px-2.5 py-1 bg-white/10 rounded-full font-mono text-white/70 font-semibold tracking-wider">SIMULATION</span>
              </div>
              <div className="space-y-3 mb-10">
                <button className="w-full text-left px-5 py-4 rounded-xl border border-[#6e6e73] bg-[#424245] transition-colors flex justify-between items-center shadow-inner">
                  <span className="text-white text-[15px] font-semibold">Place Under Review</span>
                  <Check size={18} className="text-[#34c759]" />
                </button>
                <button className="w-full text-left px-5 py-4 rounded-xl border border-transparent hover:bg-[#424245] transition-colors flex justify-between items-center">
                  <span className="text-[#aeaeb2] text-[15px] font-medium">Mark Legitimate</span>
                </button>
                <button className="w-full text-left px-5 py-4 rounded-xl border border-transparent hover:bg-[#ff3b30]/20 transition-colors flex justify-between items-center mt-4 group">
                  <span className="text-[#ff3b30] text-[15px] font-medium">Restrict / Freeze</span>
                  <ShieldAlert size={18} className="text-[#ff3b30]/50 group-hover:text-[#ff3b30]" />
                </button>
              </div>
              <button className="w-full py-4 bg-[#0071e3] text-white text-[15px] font-bold rounded-xl hover:bg-[#0077ed] transition-colors shadow-lg">
                Confirm Action
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 max-w-[1400px] mx-auto mt-20 border-t border-[#d2d2d7]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hexagon size={20} strokeWidth={2} className="text-[#1d1d1f]" />
              <span className="text-[15px] font-bold tracking-tight">SENTINEL AI</span>
            </div>
            <p className="text-[13px] text-[#6e6e73]">
              AI-powered risk intelligence for modern payment operations.
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#6e6e73] uppercase tracking-widest text-left md:text-right font-semibold">
            Built by Srikar Purijala<br/>
            Razorpay AI Buildathon 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
