import { ChevronRight, Plus, Minus, MapPin } from 'lucide-react'
import { heatmapPins, heatmapMarkers } from '../../citizen/data'

const levelStyles = {
  high: 'bg-rose-500 ring-rose-100',
  medium: 'bg-amber-500 ring-amber-100',
  low: 'bg-emerald-500 ring-emerald-100',
}

const areaLabels = [
  { name: 'Koramangala 8th Block', top: '18%', left: '38%' },
  { name: 'Koramangala 4th Block', top: '42%', left: '58%' },
  { name: 'HSR Layout', top: '26%', left: '90%' },
  { name: 'BTM Layout', top: '78%', left: '14%' },
  { name: 'Agara Lake', top: '58%', left: '84%', italic: true },
]

export default function IssueHeatmap() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Issue Heatmap</h2>
        <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300">
          View All
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative mt-4 min-h-[320px] flex-1 overflow-hidden rounded-xl bg-[#efe9df]">
        {/* Illustrative road network */}
        <svg
          viewBox="0 0 600 340"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <rect width="600" height="340" fill="#efe9df" />
          <path d="M0 60 L600 140" stroke="#ffffff" strokeWidth="10" />
          <path d="M0 220 L600 60" stroke="#ffffff" strokeWidth="10" />
          <path d="M60 0 L340 340" stroke="#ffffff" strokeWidth="7" />
          <path d="M420 0 L520 340" stroke="#ffffff" strokeWidth="7" />
          <path d="M0 150 L600 250" stroke="#ffffff" strokeWidth="5" />
          <path d="M150 0 L60 340" stroke="#ffffff" strokeWidth="4" />
          {/* park */}
          <ellipse cx="105" cy="205" rx="55" ry="34" fill="#d9e6c9" />
          {/* lake */}
          <path
            d="M430 210 Q470 190 520 215 Q560 235 540 270 Q500 300 460 280 Q425 260 430 210 Z"
            fill="#bcdcea"
          />
        </svg>

        {/* Area labels */}
        {areaLabels.map((a) => (
          <span
            key={a.name}
            className={`absolute -translate-x-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-500 ${a.italic ? 'italic text-slate-400' : ''}`}
            style={{ top: a.top, left: a.left }}
          >
            {a.name}
          </span>
        ))}

        {/* Small unlabeled markers */}
        {heatmapMarkers.map((m) => (
          <MapPin
            key={m.id}
            className="absolute h-5 w-5 -translate-x-1/2 -translate-y-full text-brand-500 drop-shadow"
            style={{ top: m.top, left: m.left }}
            fill="currentColor"
            strokeWidth={1}
          />
        ))}

        {/* Count bubbles */}
        {heatmapPins.map((p) => (
          <div
            key={p.id}
            className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold text-white shadow ring-4 ${levelStyles[p.level]}`}
            style={{ top: p.top, left: p.left }}
          >
            {p.count}
          </div>
        ))}

        {/* Zoom controls */}
        <div className="absolute bottom-4 left-4 flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <button className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-slate-50">
            <Plus className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <div className="h-px bg-slate-200" />
          <button className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-slate-50">
            <Minus className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
          <div className="flex items-center gap-1.5 py-0.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600">High</span>
          </div>
          <div className="flex items-center gap-1.5 py-0.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Medium</span>
          </div>
          <div className="flex items-center gap-1.5 py-0.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Low</span>
          </div>
        </div>
      </div>
    </div>
  )
}
