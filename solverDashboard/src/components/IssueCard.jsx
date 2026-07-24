import { useState } from 'react';
import { MapPin, MoreVertical, Loader2 } from 'lucide-react';
import { tasksApi } from '../api';

export default function IssueCard({
  id,
  title,
  location,
  category,
  priority,
  distance,
  credits,
  image_url,
  onAcceptSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const priorityColors = {
    High: 'bg-red-50 text-red-600 border-red-100',
    Medium: 'bg-orange-50 text-orange-600 border-orange-100',
    Low: 'bg-green-50 text-green-600 border-green-100',
  };

  const handleAccept = async () => {
    setLoading(false);
    setError('');
    setLoading(true);
    try {
      await tasksApi.accept(id);
      if (onAcceptSuccess) {
        onAcceptSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to accept task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 p-4 border border-slate-100 rounded-2xl hover:shadow-md hover:border-slate-200 transition-all duration-200 bg-white items-start sm:items-center">
      {/* Issue Image */}
      <img
        src={image_url}
        alt={title}
        className="w-full sm:w-24 h-40 sm:h-24 rounded-xl object-cover shrink-0 shadow-sm border border-slate-100"
      />

      {/* Info Area */}
      <div className="flex-1 min-w-0 w-full">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 border rounded-md text-[10px] font-black tracking-wide uppercase ${priorityColors[priority]}`}>
              {priority} Priority
            </span>
            {error && (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">{error}</span>
            )}
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition p-1">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-extrabold text-slate-900 leading-snug tracking-tight mb-2">
          {title}
        </h3>

        {/* Details Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-500 mb-3">
          <div className="flex items-center gap-1 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[200px]">{location}</span>
          </div>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold text-[10px]">
            {category}
          </span>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50 sm:border-t-0">
          <span className="text-[11px] text-slate-400 font-bold">{distance || 'Nearby'}</span>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-green-600 font-black text-xs">50 Credits</span>
            <button
              onClick={handleAccept}
              disabled={loading}
              className="bg-primary hover:bg-primaryDark disabled:opacity-60 text-white text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl transition duration-150 shadow-sm hover:shadow-md flex items-center gap-1"
            >
              {loading && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>{loading ? 'Accepting...' : 'Accept Task'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}