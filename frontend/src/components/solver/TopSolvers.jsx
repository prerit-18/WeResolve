import { Crown, ChevronRight } from 'lucide-react';

export default function TopSolvers({ onViewAll }) {
  const solvers = [
    {
      rank: 1,
      name: 'Rohit Sharma',
      credits: '520 Credits',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80',
      crownColor: 'text-amber-500 fill-amber-500/20',
    },
    {
      rank: 2,
      name: 'Sneha Reddy',
      credits: '410 Credits',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80',
      crownColor: 'text-slate-400 fill-slate-400/20',
    },
    {
      rank: 3,
      name: 'Arjun Kumar (You)',
      credits: '125 Credits',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80',
      crownColor: 'text-amber-700 fill-amber-700/20',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[17px] font-bold text-slate-900">Top Solvers</h3>
        <select className="text-xs bg-slate-50 border border-slate-100 rounded-lg text-slate-600 font-bold px-2 py-1 outline-none cursor-pointer">
          <option>This Month</option>
        </select>
      </div>

      <div className="space-y-3.5">
        {solvers.map((solver) => (
          <div key={solver.rank} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition duration-150">
            <div className="text-sm font-black text-slate-400 w-5 text-center">{solver.rank}</div>
            <img
              src={solver.image}
              alt={solver.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold text-slate-900 truncate ${solver.name.includes('(You)') ? 'text-primary' : ''}`}>
                {solver.name}
              </p>
              <p className="text-[12px] text-slate-500 font-medium mt-0.5">{solver.credits}</p>
            </div>
            <Crown className={`w-5 h-5 ${solver.crownColor}`} strokeWidth={2.2} />
          </div>
        ))}
      </div>

      <button 
        onClick={onViewAll}
        className="w-full mt-5 bg-section hover:bg-[#E0F2F1] text-primary font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1"
      >
        <span>View Full Leaderboard</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}