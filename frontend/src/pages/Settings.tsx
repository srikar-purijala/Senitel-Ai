import { Database, ShieldAlert, Cpu, Check } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-8 max-w-[980px] mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">Settings</h1>
        <p className="text-[15px] text-[#6e6e73] mt-1">Platform configuration and system status.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d2d2d7]/50 space-y-5">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2"><Database size={16} className="text-[#0071e3]" /> Demo Environment</h3>
          <div className="space-y-4">
            {[
              { label: 'Simulation Stream', value: 'Active', badge: true },
              { label: 'Active Scenario', select: ['Coordinated Abuse', 'Promo Ring', 'Legitimate Network'] },
              { label: 'Event Rate', select: ['Normal (1×)', 'Fast (2×)', 'Accelerated (5×)'] },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-3 border-b border-[#f5f5f7] last:border-0">
                <span className="text-[14px] text-[#424245]">{item.label}</span>
                {item.badge ? (
                  <span className="text-[11px] font-semibold text-[#34c759] bg-green-50 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1"><Check size={10} /> {item.value}</span>
                ) : (
                  <select className="bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[13px] px-3 py-1.5 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]">
                    {item.select!.map(o => <option key={o}>{o}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d2d2d7]/50 space-y-5">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2"><ShieldAlert size={16} className="text-[#ff3b30]" /> Risk Thresholds</h3>
          <div className="space-y-6">
            {[{ label: 'Critical Threshold', val: 80, color: '#ff3b30' }, { label: 'High Threshold', val: 60, color: '#ff9500' }].map(t => (
              <div key={t.label}>
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-[#424245]">{t.label}</span>
                  <span className="font-semibold font-mono" style={{ color: t.color }}>{(t.val / 100).toFixed(2)}</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={t.val} className="w-full h-1.5 rounded-full appearance-none bg-[#f5f5f7] cursor-pointer" style={{ accentColor: t.color }} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d2d2d7]/50 md:col-span-2">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2 mb-5"><Cpu size={16} className="text-[#5856d6]" /> Subsystem Status</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { name: 'Graph Construction Engine', status: 'Operational', ok: true },
              { name: 'LightGBM Risk Model', status: 'Online', ok: true },
              { name: 'SHAP Explainer', status: 'Online', ok: true },
              { name: 'LLM Investigator Pipeline', status: 'Degraded (Fallback)', ok: false },
              { name: 'Razorpay Payment Source', status: 'Simulation Mode', ok: false },
              { name: 'PostgreSQL Database', status: 'Connected', ok: true },
            ].map(s => (
              <div key={s.name} className="flex justify-between items-center p-4 rounded-xl bg-[#f5f5f7] border border-[#d2d2d7]/50">
                <span className="text-[13px] text-[#424245]">{s.name}</span>
                <span className={`text-[11px] font-semibold ${s.ok ? 'text-[#34c759]' : 'text-[#ff9500]'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
