import {
  Home,
  ClipboardList,
  ShieldCheck,
  Trash2,
  Users,
  Bell,
  User,
  HelpCircle,
  LogOut,
  HeartPulse,
  Gift,
  LayoutDashboard
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, unreadCount = 0 }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: ClipboardList, label: 'Available Issues' },
    { icon: ShieldCheck, label: 'My Tasks' },
    { icon: Gift, label: 'Rewards & Credits' },
    { icon: Users, label: 'Leaderboard' },
    { icon: Bell, label: 'Notifications' },
    { icon: User, label: 'Profile' },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: LogOut, label: 'Logout' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 p-5 flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
          <HeartPulse className="h-6 w-6 text-white" strokeWidth={2.4} />
        </div>
        <div className="leading-tight">
          <h2 className="font-extrabold text-slate-900 text-base leading-tight">WeResolve</h2>
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Solver Hub</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 px-1 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const isActive = activeTab === item.label;
          const badgeCount = item.label === 'Notifications' ? unreadCount : 0;
          return (
            <div
              key={idx}
              onClick={() => {
                if (item.label === 'Logout') {
                  if (onLogout) onLogout();
                } else if (setActiveTab) {
                  setActiveTab(item.label);
                }
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
                isActive
                  ? 'bg-section text-primary font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} strokeWidth={2} />
              <span className="flex-1 text-sm">{item.label}</span>
              {badgeCount > 0 && (
                <span className="bg-primary text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {badgeCount}
                </span>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  );
}