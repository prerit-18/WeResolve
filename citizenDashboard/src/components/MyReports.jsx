import { MapPin, Calendar, ChevronRight, ImageOff } from 'lucide-react'

const statusStyles = {
  'In Progress': 'bg-secondary/10 text-secondary border border-secondary/20',
  Resolved: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  Pending: 'bg-brand-50 text-brand-600 border border-brand-100',
  Completed: 'bg-amber-50 text-amber-600 border border-amber-100',
}

export default function MyReports({ reports = [], onViewAll }) {
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (_) {
      return 'Recent';
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">My Reports</h2>
        <button 
          onClick={onViewAll}
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300"
        >
          View All
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
          <ImageOff className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-xs font-bold">No reports yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Report an Issue" to start</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-y-auto max-h-[300px] pr-1">
          {reports.map((r) => {
            const getIssueLocationName = (lat, lon) => {
              if (!lat || !lon) return "Koramangala, Bengaluru";
              const dKora = Math.hypot(lat - 12.9348, lon - 77.6208);
              const dHsr = Math.hypot(lat - 12.9116, lon - 77.6388);
              if (dKora > 0.05 && dHsr > 0.05) {
                return `Location (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
              }
              return dHsr < dKora ? "HSR Layout, Bengaluru" : "Koramangala, Bengaluru";
            };
            const issueLoc = getIssueLocationName(r.latitude, r.longitude);
            return (
              <li key={r.id} className="flex items-center gap-3 py-3.5 first:pt-2">
                {r.image_url ? (
                  <img
                    src={r.image_url}
                    alt={r.title}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover border border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                    <ImageOff className="h-5 w-5 text-slate-300" strokeWidth={1.8} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 leading-snug">{r.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                      {issueLoc}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[r.status] || 'bg-slate-50 text-slate-600'}`}
                >
                  {r.status}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  )
}
