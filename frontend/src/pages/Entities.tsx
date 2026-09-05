import { useQuery } from '@tanstack/react-query';
import { fetchEntities } from '../api';
import { useAuthStore } from '../store';
import { Search } from 'lucide-react';


const TYPE_COLORS: Record<string, string> = {
  CUSTOMER: '#0071e3', DEVICE: '#ff9500', IP: '#34c759', PAYMENT_INSTRUMENT: '#5856d6',
};

export default function Entities() {
  const { token } = useAuthStore();
  const { data: entities, isLoading } = useQuery({ queryKey: ['entities'], queryFn: () => fetchEntities(token!), enabled: !!token });
  const ents = Array.isArray(entities) ? entities : [];

  const counts = Object.fromEntries(['CUSTOMER','DEVICE','IP','PAYMENT_INSTRUMENT'].map(t => [t, ents.filter((e:any) => e.entity_type === t).length]));

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">Entities</h1>
          <p className="text-[15px] text-[#6e6e73] mt-1">Global node registry across all monitored networks.</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aeaeb2]" />
          <input type="text" placeholder="Search entity..." className="bg-white border border-[#d2d2d7] rounded-xl text-[13px] py-2 pl-8 pr-4 text-[#1d1d1f] w-56 focus:outline-none focus:border-[#0071e3] transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[['Customers','CUSTOMER'],['Devices','DEVICE'],['IP Addresses','IP'],['Payment Instruments','PAYMENT_INSTRUMENT']].map(([label, type]) => (
          <div key={type} className="bg-white rounded-2xl p-5 shadow-sm border border-[#d2d2d7]/50">
            <div className="w-8 h-8 rounded-xl mb-3" style={{ backgroundColor: (TYPE_COLORS[type] || '#0071e3') + '20' }}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] }} />
              </div>
            </div>
            <p className="text-[13px] text-[#6e6e73] mb-1">{label}</p>
            <p className="text-[32px] font-bold text-[#1d1d1f]">{counts[type] || 0}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#d2d2d7]/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-[#d2d2d7]">
            <tr>
              {['Entity ID', 'Type', 'Value', 'Status'].map(h => (
                <th key={h} className="px-5 py-3.5 text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f7]">
            {isLoading ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-[14px] text-[#aeaeb2]">Loading entities...</td></tr>
            ) : ents.slice(0, 100).map((ent: any) => (
              <tr key={ent.id} className="hover:bg-[#f5f5f7] transition-colors">
                <td className="px-5 py-3.5 text-[13px] font-mono text-[#424245]">{ent.id}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: (TYPE_COLORS[ent.entity_type] || '#aeaeb2') + '15', color: TYPE_COLORS[ent.entity_type] || '#6e6e73' }}>
                    {ent.entity_type}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[13px] font-mono text-[#0071e3]">{ent.entity_value}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[11px] font-semibold text-[#6e6e73] bg-[#f5f5f7] px-2.5 py-1 rounded-full border border-[#d2d2d7]">Monitored</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
