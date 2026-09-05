import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function RazorpayPortal() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#0d2366] tracking-tight flex items-center gap-3">
            <CreditCard className="text-[#2b88d8]" size={36} /> RAZORPAY
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] font-bold bg-[#f3f4f6] text-[#4b5563] px-2 py-1 rounded uppercase tracking-widest border border-[#e5e7eb]">TEST ENVIRONMENT</span>
            <span className="flex items-center gap-1 text-[12px] font-semibold text-[#059669]"><div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></div> CONNECTED TO SENTINEL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Payments', value: '1,284', color: 'text-[#111827]' },
          { label: 'Orders', value: '942', color: 'text-[#111827]' },
          { label: 'Failed', value: '37', color: 'text-[#dc2626]' },
          { label: 'Risk Flagged by SENTINEL', value: '18', color: 'text-[#f59e0b]' }
        ].map(m => (
          <div key={m.label} className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
            <p className="text-[13px] font-medium text-[#6b7280] mb-2">{m.label}</p>
            <p className={'text-[32px] font-bold ' + m.color}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#e5e7eb] bg-[#f9fafb] flex justify-between items-center">
          <h3 className="text-[15px] font-bold text-[#111827]">Recent Payment Activity</h3>
          <span className="text-[12px] text-[#6b7280] font-medium">Live Feed</span>
        </div>
        <div className="divide-y divide-[#e5e7eb]">
          {[
            { id: 'pay_H93X7P', amount: 'INR 4,500', cust: 'Customer C-1042', status: 'HIGH RISK', net: 'NET-1042', time: 'Just now' },
            { id: 'pay_J12Q8L', amount: 'INR 12,800', cust: 'Customer C-4912', status: 'HIGH RISK', net: 'NET-1051', time: '1 min ago' },
            { id: 'pay_H93W2A', amount: 'INR 1,200', cust: 'Customer C-8831', status: 'LOW RISK', net: 'NET-1043', time: '2 min ago' },
            { id: 'pay_K88B9M', amount: 'INR 350', cust: 'Customer C-1120', status: 'LOW RISK', net: 'NET-1092', time: '3 min ago' },
            { id: 'pay_H93V1Z', amount: 'INR 8,900', cust: 'Customer C-2094', status: 'MEDIUM RISK', net: 'NET-1044', time: '5 min ago' },
            { id: 'pay_P90Z2X', amount: 'INR 2,400', cust: 'Customer C-5591', status: 'HIGH RISK', net: 'NET-1077', time: '8 min ago' },
            { id: 'pay_M11C4N', amount: 'INR 14,200', cust: 'Customer C-3301', status: 'LOW RISK', net: 'NET-1088', time: '12 min ago' },
            { id: 'pay_T44V8K', amount: 'INR 600', cust: 'Customer C-2290', status: 'LOW RISK', net: 'NET-1011', time: '15 min ago' },
          ].map(p => (
            <div key={p.id} className="flex items-center justify-between p-5 hover:bg-[#f9fafb] transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-32">
                  <p className="text-[14px] font-bold font-mono text-[#374151]">{p.id}</p>
                  <p className="text-[12px] text-[#6b7280] mt-1">{p.time}</p>
                </div>
                <div className="w-40">
                  <p className="text-[15px] font-bold text-[#111827]">{p.amount}</p>
                  <p className="text-[13px] text-[#4b5563]">{p.cust}</p>
                </div>
                <div className="w-48">
                  <div className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ' + (p.status === 'HIGH RISK' ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]' : p.status === 'MEDIUM RISK' ? 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]' : 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]')}>
                    {p.status === 'HIGH RISK' ? <AlertCircle size={12} /> : p.status === 'MEDIUM RISK' ? <ShieldAlert size={12} /> : <CheckCircle2 size={12} />}
                    {p.status}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/network/' + p.net)}
                className={'flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-bold transition-colors ' + (p.status === 'HIGH RISK' ? 'bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-sm' : 'bg-white border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6]')}
              >
                {p.status === 'HIGH RISK' ? 'INVESTIGATE' : 'VIEW'} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'''

with open('frontend/src/pages/RazorpayPortal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
