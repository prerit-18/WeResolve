export default function PriorityDistribution({ data = [] }) {
  const getColorForPrio = (label) => {
    if (label === 'High') return 'bg-red-500';
    if (label === 'Medium') return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getStrokeForPrio = (label) => {
    if (label === 'High') return '#ef4444';
    if (label === 'Medium') return '#f59e0b';
    return '#22c55e';
  };

  const chartData = data.length > 0 ? data : [
    {"label": "High", "count": 156},
    {"label": "Medium", "count": 642},
    {"label": "Low", "count": 450},
  ];

  const totalCount = chartData.reduce((sum, d) => sum + d.count, 0) || 1;
  const totalLength = 292.17; // 2 * PI * 46.5

  let currentOffset = 0;
  const priorities = chartData.map((d) => {
    const fraction = d.count / totalCount;
    const len = totalLength * fraction;
    const mapped = {
      label: d.label,
      count: d.count,
      color: getColorForPrio(d.label),
      stroke: getStrokeForPrio(d.label),
      len,
      offset: currentOffset
    };
    currentOffset -= len;
    return mapped;
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1">
      <h3 className="text-[15px] font-bold text-slate-900 mb-6">Priority Distribution</h3>

      <div className="flex items-center justify-between gap-4">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
            {/* Background circle track */}
            <circle cx="60" cy="60" r="46.5" fill="none" stroke="#f1f5f9" strokeWidth="12" />

            {/* Color slices */}
            {priorities.map((prio, idx) => (
              <circle
                key={idx}
                cx="60"
                cy="60"
                r="46.5"
                fill="none"
                stroke={prio.stroke}
                strokeWidth="12"
                strokeDasharray={`${prio.len} ${totalLength}`}
                strokeDashoffset={prio.offset}
                strokeLinecap="round"
                className="transition-all duration-500 hover:stroke-[14px] cursor-pointer"
              />
            ))}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
            <span className="text-lg font-black text-slate-950">{totalCount.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {priorities.map((prio, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-600 hover:bg-slate-50 p-2.5 rounded-lg transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${prio.color}`}></span>
                <span className="truncate text-slate-500 font-medium">{prio.label}</span>
              </div>
              <span className="text-slate-950 font-black">{prio.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
