export default function CategoryDistribution({ data = [] }) {
  const getColorForLabel = (label) => {
    if (label.includes('Road')) return 'bg-blue-500';
    if (label.includes('Garbage')) return 'bg-green-500';
    if (label.includes('Water')) return 'bg-amber-500';
    if (label.includes('Light')) return 'bg-indigo-500';
    return 'bg-slate-400';
  };

  const getStrokeForLabel = (label) => {
    if (label.includes('Road')) return '#3b82f6';
    if (label.includes('Garbage')) return '#22c55e';
    if (label.includes('Water')) return '#f59e0b';
    if (label.includes('Light')) return '#6366f1';
    return '#94a3b8';
  };

  const chartData = data.length > 0 ? data : [
    {"label": "Road & Infrastructure", "percentage": "38%", "count": 474},
    {"label": "Garbage & Waste", "percentage": "24%", "count": 300},
    {"label": "Water Supply", "percentage": "13%", "count": 162},
    {"label": "Street Light", "percentage": "12%", "count": 150},
    {"label": "Others", "percentage": "13%", "count": 162},
  ];

  const totalCount = chartData.reduce((sum, d) => sum + d.count, 0) || 1;
  const totalLength = 292.17; // 2 * PI * 46.5

  let currentOffset = 0;
  const categories = chartData.map((d) => {
    const fraction = d.count / totalCount;
    const len = totalLength * fraction;
    const mapped = {
      label: d.label,
      percentage: d.percentage,
      count: d.count,
      color: getColorForLabel(d.label),
      stroke: getStrokeForLabel(d.label),
      len,
      offset: currentOffset
    };
    currentOffset -= len;
    return mapped;
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1">
      <h3 className="text-[15px] font-bold text-slate-900 mb-6">Issues by Category</h3>

      <div className="flex items-center justify-between gap-4">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
            {/* Background circle track */}
            <circle cx="60" cy="60" r="46.5" fill="none" stroke="#f1f5f9" strokeWidth="12" />

            {/* Color slices */}
            {categories.map((cat, idx) => (
              <circle
                key={idx}
                cx="60"
                cy="60"
                r="46.5"
                fill="none"
                stroke={cat.stroke}
                strokeWidth="12"
                strokeDasharray={`${cat.len} ${totalLength}`}
                strokeDashoffset={cat.offset}
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
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-600 hover:bg-slate-50 p-1.5 rounded-lg transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.color}`}></span>
                <span className="truncate text-slate-500 font-medium">{cat.label}</span>
              </div>
              <span className="text-slate-950 font-black">{cat.percentage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
