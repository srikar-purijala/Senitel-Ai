import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '../api';
import { useAuthStore } from '../store';
import { Search } from 'lucide-react';
import clsx from 'clsx';

export default function Audit() {
  const { token } = useAuthStore();
  const { data: logs, isLoading } = useQuery({ queryKey: ['audit'], queryFn: () => fetchAuditLogs(token!), enabled: !!token });
  const auditLogs = Array.isArray(logs) ? logs : [];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">Audit Logs</h1>
          <p className="text-[15px] text-[#6e6e73] mt-1">Immutable activity trail for all system actions.</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aeaeb2]" />
          <input type="text" placeholder="Search logs..." className="bg-white border border-[#d2d2d7] rounded-xl text-[13px] py-2 pl-8 pr-4 text-[#1d1d1f] w-56 focus:outline-none focus:border-[#0071e3] transition-colors" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#d2d2d7]/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-[#d2d2d7]">
            <tr>
              {['Timestamp', 'Audit ID', 'Actor', 'Action', 'Resource', 'Status'].map(h => (
                <th key={h} className="px-5 py-3.5 text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f7]">
            {isLoading ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-[14px] text-[#aeaeb2]">Loading logs...</td></tr>
            ) : auditLogs.map((log: any) => (
              <tr key={log.id} className="hover:bg-[#f5f5f7] transition-colors">
                <td className="px-5 py-3.5 text-[12px] font-mono text-[#6e6e73]">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-5 py-3.5 text-[12px] font-mono text-[#424245]">{log.id}</td>
                <td className="px-5 py-3.5 text-[13px] font-semibold text-[#0071e3]">{log.user_id}</td>
                <td className="px-5 py-3.5 text-[13px] text-[#1d1d1f]">{log.action}</td>
                <td className="px-5 py-3.5 text-[12px] font-mono text-[#6e6e73]">{log.resource_id}</td>
                <td className="px-5 py-3.5">
                  <span className={clsx('text-[11px] font-semibold px-2.5 py-1 rounded-full',
                    log.action === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                    {log.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

