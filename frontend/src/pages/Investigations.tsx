import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNetworks } from '../api';
import { useAuthStore } from '../store';
import { ChevronRight, Search } from 'lucide-react';
import clsx from 'clsx';

export default function Investigations() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { data: networks, isLoading } = useQuery({ queryKey: ['networks'], queryFn: () => fetchNetworks(token!), enabled: !!token });
  const nets = Array.isArray(networks) ? networks : [];
  const abuse = nets.filter((n: any) => n.is_abuse);
  const critical = abuse.filter((n: any) => n.risk_score > 0.8);
  const high = abuse.filter((n: any) => n.risk_score > 0.6 && n.risk_score <= 0.8);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">Investigations</h1>
          <p className="text-[15px] text-[#6e6e73] mt-1">Active analyst workloads requiring review.</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aeaeb2]" />
          <input type="text" placeholder="Search INV-ID..." className="bg-white border border-[#d2d2d7] rounded-xl text-[13px] py-2 pl-8 pr-4 text-[#1d1d1f] w-56 focus:outline-none focus:border-[#0071e3] transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#d2d2d7]/50">
          <p className="text-[13px] text-[#6e6e73] mb-2">Total Queue</p>
          <p className="text-[36px] font-bold text-[#1d1d1f]">{abuse.length}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-5 shadow-sm border border-red-100">
          <p className="text-[13px] text-red-600 mb-2">Critical Priority</p>
          <p className="text-[36px] font-bold text-red-600">{critical.length}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-5 shadow-sm border border-amber-100">
          <p className="text-[13px] text-amber-600 mb-2">High Priority</p>
          <p className="text-[36px] font-bold text-amber-600">{high.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#d2d2d7]/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-[#d2d2d7]">
            <tr>
              {['INV ID', 'Network', 'Scenario', 'Risk Score', 'Severity', 'Created'].map(h => (
                <th key={h} className="px-5 py-3.5 text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">{h}</th>
              ))}
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f7]">
            {isLoading ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-[14px] text-[#aeaeb2]">Loading queue...</td></tr>
            ) : abuse.map((net: any) => {
              const isCritical = net.risk_score > 0.8;
              const invId = `INV-26${net.id?.split('-')[1] || '000'}`;
              return (
                <tr key={net.id} onClick={() => navigate(`/network/${net.id}`)} className="hover:bg-[#f5f5f7] transition-colors cursor-pointer group">
                  <td className="px-5 py-4 text-[13px] font-semibold text-[#0071e3] font-mono">{invId}</td>
                  <td className="px-5 py-4 text-[13px] text-[#424245] font-mono">{net.id}</td>
                  <td className="px-5 py-4 text-[13px] text-[#1d1d1f]">{net.scenario_type}</td>
                  <td className="px-5 py-4 text-[13px] font-semibold font-mono" style={{ color: isCritical ? '#ff3b30' : '#ff9500' }}>
                    {net.risk_score.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={clsx('text-[11px] font-semibold px-2.5 py-1 rounded-full', isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}>
                      {isCritical ? 'Critical' : 'High'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#6e6e73]">{new Date(net.created_at).toLocaleTimeString()}</td>
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
