import { AlertCircle, ShieldAlert, CheckCircle, BellRing, Bell } from 'lucide-react';

const alertIcons = {
  alert: { Icon: ShieldAlert, color: 'text-red-500 bg-red-50 border-red-100' },
  warning: { Icon: AlertCircle, color: 'text-amber-500 bg-amber-50 border-amber-100' },
  success: { Icon: CheckCircle, color: 'text-green-500 bg-green-50 border-green-100' },
  info: { Icon: BellRing, color: 'text-blue-500 bg-secondary/10 border-secondary/20' },
  default: { Icon: Bell, color: 'text-slate-500 bg-slate-50 border-slate-100' },
};

export default function RecentAlerts({ alerts = [] }) {
  const chartAlerts = alerts.length > 0 ? alerts : [
    { text: "High priority issue reported in HSR Layout, Sector 2", type: "alert", time_ago: "10 mins ago" },
    { text: "New issue reported in Koramangala 7th Block", type: "warning", time_ago: "25 mins ago" },
    { text: "Solver submitted verification for issue #UP-1245", type: "success", time_ago: "45 mins ago" },
    { text: "Issue #UP-1220 marked as resolved", type: "success", time_ago: "1 hour ago" },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-slate-900">Recent Alerts</h3>
        <span className="text-[10px] font-black uppercase text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-md">Live</span>
      </div>

      <div className="space-y-3.5">
        {chartAlerts.map((alert, idx) => {
          const style = alertIcons[alert.type] || alertIcons.default;
          return (
            <div key={idx} className="flex gap-3 items-start group">
              {/* Icon Container */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${style.color}`}>
                <style.Icon className="w-4 h-4" />
              </div>

              {/* Alert Content */}
              <div className="min-w-0 flex-1 leading-snug">
                <p className="text-xs font-bold text-slate-800 break-words group-hover:text-slate-950 transition">
                  {alert.text}
                </p>
                <span className="text-[10px] text-slate-400 font-bold block mt-1">
                  {alert.time_ago || 'Recent'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
