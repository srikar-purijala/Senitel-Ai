import os

content = '''import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, AlertTriangle, ShieldCheck, Activity, ChevronRight, Zap, ShieldAlert } from 'lucide-react';
import { useDemoStore } from '../store';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = Array.from({ length: 24 }, (_, i) => ({
  time: \:00,
  transactions: 400 + Math.floor(Math.sin(i / 3) * 150 + Math.random() * 80),
  threats: i > 9 && i < 18 ? Math.floor(Math.random() * 12) : Math.floor(Math.random() * 3),
}));

export default function Dashboard() {
  const navigate = useNavigate();
  const { transactionsProcessed, networksMonitored, activeThreats, exposureDetected, liveEvents, tick, isRunning } = useDemoStore();
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/networks/pending', { headers: { Authorization: Bearer demo-token } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPending(d.slice(0, 5)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [tick, isRunning]);

  const metrics = [
    { label: 'Transactions Analyzed', value: transactionsProcessed.toLocaleString(), change: '+12 / sec', icon: Activity, color: '#0071e3' },
    { label: 'Active Threat Networks', value: activeThreats, change: 'Live', icon: AlertTriangle, color: '#ff3b30', urgent: activeThreats > 5 },
    { label: 'Networks Monitored', value: networksMonitored, change: 'Updated', icon: ShieldCheck, color: '#34c759' },
    { label: 'Exposure Detected', value: INR \L, change: 'This session', icon: TrendingUp, color: '#ff9500' },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">Command Center</h1>
        <p className="text-[15px] text-[#6e6e73] mt-1">Real-time risk intelligence across your payment network.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={g-white rounded-2xl p-6 shadow-sm border \}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.color + '15' }}>
                  <Icon size={18} style={{ color: m.color }} />
                </div>
                <span className="text-[11px] text-[#aeaeb2] font-medium">{m.change}</span>
              </div>
              <p className="text-[30px] font-bold text-[#1d1d1f] leading-none mb-1">{m.value}</p>
              <p className="text-[13px] text-[#6e6e73]">{m.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d2d2d7]/50 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Decision Queue</h3>
            <p className="text-[13px] text-[#6e6e73]">Investigations requiring analyst review</p>
          </div>
          <button onClick={() => navigate('/investigations')} className="text-[#0071e3] text-[13px] font-medium hover:underline">View All</button>
        </div>
        
        <div className="space-y-3">
          {pending.length === 0 ? (
            <div className="p-8 text-center text-[#aeaeb2] border border-dashed border-[#d2d2d7] rounded-xl">No pending decisions.</div>
          ) : pending.map((net: any) => (
            <div key={net.id} className="flex items-center justify-between p-4 rounded-xl border border-[#d2d2d7]/50 hover:bg-[#f5f5f7] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                  <ShieldAlert size={18} className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#1d1d1f]">{net.id}</h4>
                  <p className="text-[12px] text-[#6e6e73]">Risk: <span className="text-red-500 font-medium">HIGH</span> - AI Recommends: <span className="font-mono text-[10px] bg-[#f5f5f7] px-1.5 py-0.5 rounded border border-[#d2d2d7] ml-1">PLACE UNDER REVIEW</span></p>
                </div>
              </div>
              <button onClick={() => navigate('/network/' + net.id)} className="px-4 py-2 bg-[#0071e3] text-white rounded-lg text-[13px] font-semibold hover:bg-[#0077ed] transition-colors">
                Review
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}'''

with open('frontend/src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
