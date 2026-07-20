import {
  HeartPulse,
  LayoutDashboard,
  FileEdit,
  ClipboardList,
  MapPin,
  Bell,
  Gift,
  HelpCircle,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Report Issue', icon: FileEdit },
  { label: 'My Reports', icon: ClipboardList },
  { label: 'Nearby Issues', icon: MapPin },
  { label: 'Notifications', icon: Bell, badge: 3 },
  { label: 'Rewards & Credits', icon: Gift },
  { label: 'Help & Support', icon: HelpCircle },
  { label: 'Profile', icon: User },
  { label: 'Logout', icon: LogOut },
]

export default function Sidebar({ className = '', activeTab, setActiveTab, onLogout, unreadCount = 0 }) {
  return (
    <aside
      className={`flex h-full w-64 shrink-0 flex-col bg-white border-r border-slate-100 ${className}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
          <HeartPulse className="h-5 w-5 text-brand-600" strokeWidth={2.4} />
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-bold text-slate-900">WeResolve</p>
          <p className="text-[11px] text-slate-400">Better City, Together</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {navItems.map(({ label, icon: Icon }) => {
          const isActive = activeTab === label;
          const badgeCount = label === 'Notifications' ? unreadCount : 0;
          return (
            <button
              key={label}
              onClick={() => {
                if (label === 'Logout') {
                  if (onLogout) onLogout();
                } else if (setActiveTab) {
                  setActiveTab(label);
                }
              }}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-brand-50 font-semibold text-brand-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${isActive ? 'text-brand-600' : 'text-slate-400'}`}
                strokeWidth={2}
              />
              <span className="flex-1 text-left">{label}</span>
              {badgeCount > 0 ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">
                  {badgeCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
