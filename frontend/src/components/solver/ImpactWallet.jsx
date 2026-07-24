import { useState, useEffect } from 'react';
import { HelpCircle, Star, ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { tasksApi } from '../../api';

export default function ImpactWallet({ user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const credits = user?.credits !== undefined ? user.credits : 0;
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const maxXp = level * 100;
  const xpPercentage = Math.min(100, Math.max(0, (xp / maxXp) * 100));

  useEffect(() => {
    if (modalOpen) {
      setLoading(true);
      tasksApi.listMyTasks()
        .then(tasks => {
          // Filter tasks that are Approved (solved)
          const approvedTasks = tasks.filter(t => t.status === 'Approved');
          setHistory(approvedTasks);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [modalOpen]);

  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-secondary via-secondaryDark to-primary rounded-2xl p-6 text-white shadow-md flex items-stretch justify-between gap-4">
        {/* Left Section */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-white/90 mb-4">
              <span>Your Impact Wallet</span>
              <HelpCircle className="w-4 h-4 text-white/70 cursor-pointer" />
            </h3>

            <div className="flex items-center gap-3">
              {/* Gold Coin Icon */}
              <div className="w-12 h-12 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full flex items-center justify-center border-2 border-white shadow-inner font-extrabold text-2xl text-white select-none">
                $
              </div>
              <div>
                <p className="text-3xl font-black tracking-tight leading-none">{credits}</p>
                <p className="text-xs text-white/80 font-semibold mt-1">Social Credits</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold bg-black/15 hover:bg-black/25 text-white/90 px-3.5 py-2 rounded-xl transition-all duration-200 w-max mt-6 border border-white/5 cursor-pointer"
          >
            <span>View Credit History</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Right Section (Level Card) */}
        <div className="w-40 bg-black/15 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center shrink-0">
          <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-md mb-2">
            <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <p className="text-xs text-white/80 font-medium">Level {level}</p>
          <p className="text-[14px] font-extrabold text-white leading-tight">Solver</p>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-green-400 h-full rounded-full transition-all duration-300" style={{ width: `${xpPercentage}%` }}></div>
          </div>
          <p className="text-[10px] text-white/70 font-bold mt-1.5">{xp} / {maxXp} XP</p>
        </div>
      </div>

      {/* Credit History Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh] text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Credit Transaction History</span>
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 transition text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loading ? (
                <div className="text-center py-8 text-xs font-bold text-slate-400">
                  Retrieving credit history...
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <span className="text-3xl">🪙</span>
                  <p className="text-xs font-bold text-slate-800">Your wallet is clean</p>
                  <p className="text-[11px] text-slate-400 px-4 leading-normal">
                    No transactions recorded. Earn credits by resolving reported issues and getting them verified.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((task) => {
                    const formattedDate = new Date(task.completed_at || task.accepted_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    return (
                      <div key={task.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs transition hover:bg-slate-100/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 leading-snug">{task.issue?.title || 'Civic Issue Solved'}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{formattedDate}</p>
                          </div>
                        </div>
                        <span className="text-green-600 font-black shrink-0 text-[13px]">+50 Credits</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end">
              <button 
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}