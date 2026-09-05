import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNetworks } from '../api';
import { useAuthStore } from '../store';
import { ChevronRight, Search } from 'lucide-react';
import clsx from 'clsx';

export default function Networks() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { data: networks, isLoading } = useQuery({ queryKey: ['networks'], queryFn: () => fetchNetworks(token!), enabled: !!token });
  const nets = Array.isArray(networks) ? networks : [];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">Networks</h1>
          <p className="text-[15px] text-[#6e6e73] mt-1">All detected entity networks and their risk status.</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aeaeb2]" />
          <input type="text" placeholder="Search network..." className="bg-white border border-[#d2d2d7] rounded-xl text-[13px] py-2 pl-8 pr-4 text-[#1d1d1f] w-56 focus:outline-none focus:border-[#0071e3] transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Networks', value: nets.length, color: '#1d1d1f' },
          { label: 'Critical', value: nets.filter((n: any) => n.risk_score > 0.8).length, color: '#ff3b30' },
          { label: 'High Risk', value: nets.filter((n: any) => n.risk_score > 0.6 && n.risk_score <= 0.8).length, color: '#ff9500' },
          { label: 'Normal', value: nets.filter((n: any) => n.risk_score < 0.2).length, color: '#34c759' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#d2d2d7]/50">
            <p className="text-[13px] text-[#6e6e73] mb-2">{s.label}</p>
            <p className="text-[36px] font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#d2d2d7]/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-[#d2d2d7]">
            <tr>
              {['Network ID', 'Scenario', 'Risk Score', 'Severity', 'Detected'].map(h => (
                <th key={h} className="px-5 py-3.5 text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">{h}</th>
              ))}
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f7]">
            {isLoading ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-[14px] text-[#aeaeb2]">Loading networks...</td></tr>
            ) : nets.map((net: any) => {
              const isCritical = net.risk_score > 0.8;
              const isHigh = net.risk_score > 0.6;
              return (
                <tr key={net.id} onClick={() => navigate(`/network/${net.id}`)} className="hover:bg-[#f5f5f7] transition-colors cursor-pointer group">
                  <td className="px-5 py-4 text-[13px] font-semibold text-[#0071e3] font-mono">{net.id}</td>
                  <td className="px-5 py-4 text-[13px] text-[#424245]">{net.scenario_type}</td>
                  <td className="px-5 py-4 text-[13px] font-semibold font-mono" style={{ color: isCritical ? '#ff3b30' : isHigh ? '#ff9500' : '#34c759' }}>
                    {net.risk_score.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={clsx('text-[11px] font-semibold px-2.5 py-1 rounded-full',
                      isCritical ? 'bg-red-100 text-red-700' : isHigh ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700')}>
                      {isCritical ? 'Critical' : isHigh ? 'High' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#6e6e73]">{new Date(net.created_at).toLocaleString()}</td>
                  <td className="px-5 py-4"><ChevronRight size={16} className="text-[#aeaeb2] group-hover:text-[#0071e3] transition-colors ml-auto" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
