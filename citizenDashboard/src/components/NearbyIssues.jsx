import { MapPin, Construction, Trash2, Lightbulb, Map, ChevronRight, HelpCircle } from 'lucide-react'

const iconMap = {
  pothole: { Icon: Construction, bg: 'bg-rose-50', color: 'text-rose-500' },
  garbage: { Icon: Trash2, bg: 'bg-amber-50', color: 'text-amber-500' },
  light: { Icon: Lightbulb, bg: 'bg-secondary/10', color: 'text-secondary' },
  default: { Icon: HelpCircle, bg: 'bg-slate-50', color: 'text-slate-500' },
}

const severityStyles = {
  High: 'bg-rose-50 text-rose-600 border border-rose-100',
  Medium: 'bg-amber-50 text-amber-600 border border-amber-100',
  Low: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
}

export default function NearbyIssues({ issues = [], onViewAll }) {
  const getIconType = (category) => {
    if (category === 'Road Damage') return 'pothole';
    if (category === 'Street Light') return 'light';
    if (category === 'Garbage') return 'garbage';
    return 'default';
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">Nearby Issues</h2>
        <button 
          onClick={onViewAll}
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300"
        >
          View All
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {issues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
          <Map className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-xs font-bold">No nearby issues</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Everything is clean in your surroundings!</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-y-auto max-h-[300px] pr-1">
          {issues.map((issue) => {
            const iconType = getIconType(issue.category)
            const { Icon, bg, color } = iconMap[iconType]
            
            const getIssueLocationName = (lat, lon) => {
              if (!lat || !lon) return "Koramangala, Bengaluru";
              const dKora = Math.hypot(lat - 12.9348, lon - 77.6208);
              const dHsr = Math.hypot(lat - 12.9116, lon - 77.6388);
              if (dKora > 0.05 && dHsr > 0.05) {
                return `Location (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
              }
              return dHsr < dKora ? "HSR Layout, Bengaluru" : "Koramangala, Bengaluru";
            };
            const issueLoc = getIssueLocationName(issue.latitude, issue.longitude);

            return (
              <li key={issue.id} className="flex items-center gap-3 py-3.5 first:pt-2">
                {issue.image_url ? (
                  <img
                    src={issue.image_url}
                    alt={issue.title}
                    className="h-11 w-11 shrink-0 rounded-xl object-cover border border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} strokeWidth={2} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 leading-snug">{issue.title}</p>
                  <span className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                    {issueLoc}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs text-slate-400 font-bold">
                    {issue.distance !== undefined
                      ? issue.distance < 1
                        ? `${Math.round(issue.distance * 1000)} m away`
                        : `${issue.distance.toFixed(1)} km away`
                      : 'Nearby'}
                  </p>
                  <span
                    className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${severityStyles[issue.priority] || 'bg-slate-50 text-slate-600'}`}
                  >
                    {issue.priority}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <button 
        onClick={onViewAll}
        className="mt-auto flex w-full items-center gap-2 rounded-xl border-t border-slate-100 pt-4 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        <Map className="h-4 w-4" strokeWidth={2.2} />
        Explore all issues on map
        <ChevronRight className="ml-auto h-4 w-4" strokeWidth={2.2} />
      </button>
    </div>
  )
}
