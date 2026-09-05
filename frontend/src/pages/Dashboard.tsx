import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, AlertTriangle, ShieldCheck, Activity, ChevronRight, Zap, ShieldAlert } from 'lucide-react';
import { useDemoStore } from '../store';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  transactions: 400 + Math.floor(Math.sin(i / 3) * 150 + Math.random() * 80),
  threats: i > 9 && i < 18 ? Math.floor(Math.random() * 12) : Math.floor(Math.random() * 3),
}));

export default function Dashboard() {
  const navigate = useNavigate();
  const { transactionsProcessed, networksMonitored, activeThreats, exposureDetected, liveEvents, tick, isRunning } = useDemoStore();
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/networks/pending', { headers: { Authorization: `Bearer demo-token` } })
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
    { label: 'Exposure Detected', value: `INR ${(exposureDetected / 100000).toFixed(1)}L`, change: 'This session', icon: TrendingUp, color: '#ff9500' },
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
            <div key={m.label} className={`bg-white rounded-2xl p-6 shadow-sm border ${m.urgent ? 'border-red-200 bg-red-50' : 'border-[#d2d2d7]/50'}`}>
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#d2d2d7]/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Transaction Volume</h3>
              <p className="text-[13px] text-[#6e6e73]">Last 24 hours</p>
            </div>
            <span className="text-[11px] font-semibold text-[#34c759] bg-[#34c759]/10 px-3 py-1 rounded-full">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071e3" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0071e3" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3b30" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ff3b30" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#aeaeb2' }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fontSize: 11, fill: '#aeaeb2' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #d2d2d7', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="transactions" stroke="#0071e3" strokeWidth={2} fill="url(#txGrad)" name="Transactions" />
              <Area type="monotone" dataKey="threats" stroke="#ff3b30" strokeWidth={1.5} fill="url(#threatGrad)" name="Threats" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#d2d2d7]/50 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Zap size={15} className="text-[#ff9500]" /> Live Events
            </h3>
            <span className="text-[11px] text-[#34c759] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse inline-block" /> streaming
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[220px]">
            {liveEvents.slice(0, 15).map(ev => (
              <div key={ev.id} className={`px-3 py-2 rounded-xl text-[12px] flex items-start gap-2 ${ev.type === 'CRITICAL' ? 'bg-red-50 border border-red-100' : ev.type === 'WARNING' ? 'bg-amber-50 border border-amber-100' : 'bg-[#f5f5f7] border border-[#d2d2d7]/50'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${ev.type === 'CRITICAL' ? 'bg-red-500' : ev.type === 'WARNING' ? 'bg-amber-500' : 'bg-[#aeaeb2]'}`} />
                <span className={`leading-snug ${ev.type === 'CRITICAL' ? 'text-red-700' : ev.type === 'WARNING' ? 'text-amber-700' : 'text-[#424245]'}`}>{ev.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
