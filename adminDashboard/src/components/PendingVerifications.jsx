import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { adminApi } from '../api';

export default function PendingVerifications({ verifications = [], onVerifySuccess, onViewAll }) {
  const [processingId, setProcessingId] = useState(null);
  const [errorId, setErrorId] = useState(null);

  const priorityColors = {
    High: 'bg-red-50 text-red-600 border-red-100',
    Medium: 'bg-amber-50 text-amber-600 border-amber-100',
    Low: 'bg-green-50 text-green-600 border-green-100',
  };

  const handleVerify = async (taskId, action) => {
    setProcessingId(taskId);
    setErrorId(null);
    try {
      await adminApi.verify(taskId, action);
      if (onVerifySuccess) {
        onVerifySuccess();
      }
    } catch (err) {
      console.error(err);
      setErrorId(taskId);
    } finally {
      setProcessingId(null);
    }
  };

  const chartVerifications = verifications.length > 0 ? verifications : [];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-slate-900">Pending Verifications</h3>
        <span className="text-[10px] font-black uppercase text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-md">
          {chartVerifications.length} Request{chartVerifications.length !== 1 ? 's' : ''}
        </span>
      </div>

      {chartVerifications.length === 0 ? (
        <div className="text-center p-8 text-slate-400 text-xs font-bold border border-dashed border-slate-100 rounded-2xl">
          No pending verification reviews.
        </div>
      ) : (
        <div className="space-y-6">
          {chartVerifications.map((item) => {
            const issue = item.issue || {};
            const solver = item.solver || {};
            const isProcessing = processingId === item.id;
            const hasError = errorId === item.id;

            return (
              <div key={item.id} className="border-b border-slate-50 last:border-b-0 pb-5 last:pb-0">
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">UP-{issue.id || item.id}</span>
                    <span className={`px-2 py-0.5 border rounded-md text-[9px] font-black uppercase tracking-wide ${priorityColors[issue.priority] || 'bg-slate-50 text-slate-600'}`}>
                      {issue.priority || 'Medium'}
                    </span>
                    {hasError && (
                      <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">Error</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <h4 className="text-xs font-extrabold text-slate-950 truncate leading-snug">{issue.title || 'Civic Issue'}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Submitted by: <span className="text-slate-600 font-extrabold">{solver.full_name || 'Solver'}</span></p>

                {/* Before / After Images */}
                <div className="grid grid-cols-2 gap-3.5 mt-3.5">
                  {/* Before */}
                  <div className="flex flex-col items-center">
                    <img
                      src={item.before_image || '/issue1.png'}
                      alt="Before"
                      className="w-full h-20 rounded-xl object-cover border border-slate-100 shadow-sm"
                    />
                    <span className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Before</span>
                  </div>

                  {/* After */}
                  <div className="flex flex-col items-center">
                    <img
                      src={item.after_image || '/issue1.png'}
                      alt="After"
                      className="w-full h-20 rounded-xl object-cover border border-slate-100 shadow-sm"
                    />
                    <span className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">After</span>
                  </div>
                </div>

                {/* Approve / Reject Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleVerify(item.id, 'approve')}
                    className="py-2 border border-green-200 bg-green-50 hover:bg-green-100 disabled:opacity-50 text-green-700 text-xs font-bold rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-1"
                  >
                    {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
                    <span>Approve</span>
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleVerify(item.id, 'reject')}
                    className="py-2 border border-red-200 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-700 text-xs font-bold rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-1"
                  >
                    {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button 
        onClick={onViewAll}
        className="w-full mt-6 bg-secondary/10 hover:bg-blue-100 text-secondary font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
      >
        <span>View All Verifications</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
