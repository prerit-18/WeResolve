import { Star } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, change, color, textColor, hasIcon }) {
  const isRating = label === 'Rating';
  const isGreenTrend = label === 'Social Credits' || label === 'Tasks Completed';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1">
      <div className="flex flex-col">
        {/* Icon Box */}
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-3.5`}>
          <Icon className={`w-5 h-5 ${textColor}`} strokeWidth={2.2} />
        </div>

        {/* Label */}
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>

        {/* Value and Inline Rating Icon */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
          {isRating && (
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
          )}
        </div>

        {/* Change / Subtext Trend */}
        <div className="mt-1">
          {isGreenTrend ? (
            <p className="text-[11px] font-bold text-green-600 tracking-wide">
              {change}
            </p>
          ) : (
            <p className="text-[11px] font-bold text-slate-400 tracking-wide hover:text-slate-600 transition cursor-pointer">
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}