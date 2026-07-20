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
  Gift
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: ClipboardList, label: 'Available Issues' },
    { icon: ShieldCheck, label: 'My Tasks' },
    { icon: Gift, label: 'Rewards & Credits' },
    { icon: Users, label: 'Leaderboard' },
    { icon: Bell, label: 'Notifications', badge: '3' },
    { icon: User, label: 'Profile' },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: LogOut, label: 'Logout' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 p-5 flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 shadow-md">
          <HeartPulse className="h-6 w-6 text-white" strokeWidth={2.4} />
        </div>
        <div className="leading-tight">
          <h1 className="text-xl font-bold text-gray-900 leading-none">WeResolve</h1>
          <p className="text-[11px] text-gray-500 font-semibold tracking-wider mt-1">Solve. Earn. Impact.</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 px-1 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const isActive = activeTab === item.label;
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
                  ? 'bg-purple-50 text-purple-600 font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} strokeWidth={2} />
              <span className="flex-1 text-sm">{item.label}</span>
              {item.badge && (
                <span className="bg-purple-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  );
}