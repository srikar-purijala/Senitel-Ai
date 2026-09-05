import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const baselineData = [
  { name: 'Precision', Baseline: 0.62, SENTINEL: 0.94 },
  { name: 'Recall', Baseline: 0.58, SENTINEL: 0.89 },
  { name: 'F1 Score', Baseline: 0.60, SENTINEL: 0.91 },
];

export default function Analytics() {
  const kpis = [
    { label: 'Precision', value: '94.2%', delta: '+32.2%', good: true },
    { label: 'Recall', value: '89.1%', delta: '+31.1%', good: true },
    { label: 'F1 Score', value: '91.6%', delta: '+31.6%', good: true },
    { label: 'False Positive Rate', value: '1.2%', delta: '-4.8%', good: true },
  ];

  const matrix = [
    { label: 'True Negatives', value: '12,482', color: '#34c759', bg: '#34c75910' },
    { label: 'False Positives', value: '151', color: '#ff9500', bg: '#ff950010' },
    { label: 'False Negatives', value: '84', color: '#ff3b30', bg: '#ff3b3010' },
    { label: 'True Positives', value: '682', color: '#0071e3', bg: '#0071e310' },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">Analytics</h1>
        <p className="text-[15px] text-[#6e6e73] mt-1">LightGBM model performance and telemetry.</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-6 shadow-sm border border-[#d2d2d7]/50">
            <p className="text-[13px] text-[#6e6e73] mb-2">{k.label}</p>
            <p className="text-[32px] font-bold text-[#1d1d1f] leading-none mb-1">{k.value}</p>
            <p className="text-[13px] font-semibold text-[#34c759]">{k.delta} vs baseline</p>
          </div>
        ))}
      </div>

      {/* Chart + Matrix */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d2d2d7]/50">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-1">Baseline vs SENTINEL</h3>
          <p className="text-[13px] text-[#6e6e73] mb-6">Graph model vs transaction-level screening</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={baselineData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6e6e73' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#aeaeb2' }} tickLine={false} axisLine={false} domain={[0, 1]} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #d2d2d7', borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Baseline" fill="#d2d2d7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="SENTINEL" fill="#0071e3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d2d2d7]/50">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-1">Confusion Matrix</h3>
          <p className="text-[13px] text-[#6e6e73] mb-6">Evaluation on held-out test set</p>
          <div className="grid grid-cols-2 gap-4">
            {matrix.map(m => (
              <div key={m.label} className="rounded-2xl p-5 flex flex-col items-center justify-center text-center" style={{ backgroundColor: m.bg, border: `1px solid ${m.color}30` }}>
                <p className="text-[32px] font-bold mb-1" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[12px] font-semibold" style={{ color: m.color }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SHAP story */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#d2d2d7]/50">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-1">Top Risk Features (SHAP)</h3>
        <p className="text-[13px] text-[#6e6e73] mb-6">Average feature contribution across flagged networks</p>
        <div className="space-y-5 max-w-2xl">
          {[
            { feature: 'shared_device_count', val: 0.31 },
            { feature: 'ip_concentration', val: 0.24 },
            { feature: 'transaction_velocity', val: 0.18 },
            { feature: 'community_density', val: 0.14 },
            { feature: 'temporal_burst_score', val: 0.09 },
          ].map(row => (
            <div key={row.feature}>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="font-mono text-[#424245]">{row.feature}</span>
                <span className="font-semibold text-[#ff3b30]">+{row.val.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-[#f5f5f7] rounded-full overflow-hidden">
                <div className="h-full bg-[#0071e3] rounded-full" style={{ width: `${row.val * 280}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
