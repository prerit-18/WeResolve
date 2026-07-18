import { ClipboardList, CheckCircle2, Clock, Star } from 'lucide-react'

export default function StatsRow({ reports = [], user }) {
  const reportedCount = reports.length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;
  const inProgressCount = reports.filter(r => r.status === 'In Progress' || r.status === 'Completed').length;
  const creditBalance = user?.credits || 0;

  const stats = [
    {
      icon: ClipboardList,
      value: String(reportedCount),
      label: 'Issues Reported',
      sub: 'By You',
      iconBg: 'bg-brand-50',
      iconColor: 'text-brand-500',
    },
    {
      icon: CheckCircle2,
      value: String(resolvedCount),
      label: 'Resolved',
      sub: 'Issues',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Clock,
      value: String(inProgressCount),
      label: 'In Progress',
      sub: 'Issues',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      icon: Star,
      value: String(creditBalance),
      label: 'Social Credits',
      sub: 'Earned',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ icon: Icon, value, label, sub, iconBg, iconColor }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card sm:p-5"
        >
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <p className="text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
            <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
            <p className="text-xs text-slate-400 sm:text-sm">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
