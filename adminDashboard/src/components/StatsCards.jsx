import { FileText, Clock, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total Issues',
      value: stats ? String(stats.total_issues) : '1,248',
      trend: stats ? stats.total_issues_change.split(' ')[0] : '12.5%',
      isTrendUp: true,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      label: 'In Progress',
      value: stats ? String(stats.in_progress) : '342',
      trend: stats ? stats.in_progress_change.split(' ')[0] : '8.3%',
      isTrendUp: true,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      label: 'Resolved',
      value: stats ? String(stats.resolved) : '742',
      trend: stats ? stats.resolved_change.split(' ')[0] : '15.7%',
      isTrendUp: true,
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600 border-green-100',
    },
    {
      label: 'High Priority',
      value: stats ? String(stats.high_priority) : '156',
      trend: stats ? stats.high_priority_change.split(' ')[0] : '3.2%',
      isTrendUp: false,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600 border-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 px-4 sm:px-6 md:px-8 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 md:gap-4 hover:shadow-md transition duration-200">
          {/* Icon container */}
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border ${card.color}`}>
            <card.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.2} />
          </div>

          {/* Details */}
          <div>
            <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-wider">{card.label}</p>
            <p className="text-xl md:text-2xl font-black text-slate-900 mt-1 leading-none tracking-tight">{card.value}</p>
            
            {/* Trend info */}
            <div className="flex items-center gap-1 mt-1.5 text-[10px] md:text-[11px] font-bold">
              {card.isTrendUp ? (
                <>
                  <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-600" />
                  <span className="text-green-600">{card.trend}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-600" />
                  <span className="text-red-600">{card.trend}</span>
                </>
              )}
              <span className="text-slate-400 hidden sm:inline">from last week</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
