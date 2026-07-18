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

export default function Sidebar({ className = '', activeTab, setActiveTab, onLogout }) {
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
        {navItems.map(({ label, icon: Icon, badge }) => {
          const isActive = activeTab === label;
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
              {badge ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">
                  {badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      {/* Impact card */}
      <div className="m-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-5 text-white">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <Sparkles className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <p className="text-sm font-semibold">Your Impact</p>
        <p className="mt-1 text-[13px] leading-snug text-brand-50/90">
          You&apos;ve reported issues and helped your city!
        </p>
        <button className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-white/15 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/25">
          View Impact
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </aside>
  )
}
