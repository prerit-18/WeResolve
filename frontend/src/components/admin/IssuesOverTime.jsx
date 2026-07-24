export default function IssuesOverTime({ data = [] }) {
  // Fallback to defaults if no data is provided
  const chartData = data.length > 0 ? data : [
    {"date": "May 12", "reported": 200, "resolved": 40},
    {"date": "May 13", "reported": 350, "resolved": 150},
    {"date": "May 14", "reported": 280, "resolved": 170},
    {"date": "May 15", "reported": 250, "resolved": 110},
    {"date": "May 16", "reported": 310, "resolved": 185},
    {"date": "May 17", "reported": 290, "resolved": 160},
    {"date": "May 18", "reported": 340, "resolved": 200},
  ];

  const dates = chartData.map(d => d.date);
  const reported = chartData.map(d => d.reported);
  const resolved = chartData.map(d => d.resolved);

  // SVG dimensions
  const svgWidth = 550;
  const svgHeight = 220;
  
  const chartWidth = svgWidth - 50 - 20; // 480
  const chartHeight = svgHeight - 30 - 20; // 170
  const paddingLeft = 50;
  const paddingTop = 20;

  // Helpers to get X and Y coordinates
  const getX = (idx) => paddingLeft + (idx * (chartWidth / (dates.length - 1)));
  const getY = (val) => paddingTop + chartHeight - ((val / 400) * chartHeight);

  // Generate path coordinates
  const reportedPoints = reported.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
  const resolvedPoints = resolved.map((val, idx) => ({ x: getX(idx), y: getY(val) }));

  // Generate SVG path string (Reported - smooth Bezier curves)
  const createSmoothPath = (points) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const reportedPath = createSmoothPath(reportedPoints);
  const resolvedPath = createSmoothPath(resolvedPoints);

  // Closed paths for gradients under the lines
  const reportedClosedPath = reportedPoints.length > 0 ? `${reportedPath} L ${reportedPoints[reportedPoints.length - 1].x} ${paddingTop + chartHeight} L ${reportedPoints[0].x} ${paddingTop + chartHeight} Z` : '';
  const resolvedClosedPath = resolvedPoints.length > 0 ? `${resolvedPath} L ${resolvedPoints[resolvedPoints.length - 1].x} ${paddingTop + chartHeight} L ${resolvedPoints[0].x} ${paddingTop + chartHeight} Z` : '';

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-slate-900">Issues Over Time</h3>
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary/100"></span>
            <span className="text-slate-500">Reported</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-slate-500">Resolved</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[220px]">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
          <defs>
            <linearGradient id="reportedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines (Horizontal) */}
          {[0, 100, 200, 300, 400].map((val, idx) => (
            <g key={idx}>
              <text x={paddingLeft - 10} y={getY(val) + 4} textAnchor="end" className="text-[10px] font-bold fill-slate-400">
                {val}
              </text>
              <line
                x1={paddingLeft}
                y1={getY(val)}
                x2={svgWidth - 20}
                y2={getY(val)}
                className="stroke-slate-100"
                strokeWidth={1}
                strokeDasharray={val === 0 ? "0" : "4 4"}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {dates.map((date, idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={svgHeight - 8}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-400"
            >
              {date}
            </text>
          ))}

          {/* Gradient Areas */}
          {reportedClosedPath && <path d={reportedClosedPath} fill="url(#reportedGradient)" />}
          {resolvedClosedPath && <path d={resolvedClosedPath} fill="url(#resolvedGradient)" />}

          {/* Chart Lines */}
          {reportedPath && <path d={reportedPath} fill="none" stroke="#3b82f6" strokeWidth={2.4} strokeLinecap="round" />}
          {resolvedPath && <path d={resolvedPath} fill="none" stroke="#22c55e" strokeWidth={2.4} strokeLinecap="round" />}

          {/* Reported Points */}
          {reportedPoints.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={3.5}
              className="fill-white stroke-blue-500"
              strokeWidth={2}
            />
          ))}

          {/* Resolved Points */}
          {resolvedPoints.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={3}
              className="fill-white stroke-green-500"
              strokeWidth={2}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
