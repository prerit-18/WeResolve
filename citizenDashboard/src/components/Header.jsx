import { useState } from 'react'
import { Menu, MapPin, ChevronDown, Bell, LogOut } from 'lucide-react'

export default function Header({ user, location, onMenuClick, onNotificationClick, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const name = user?.full_name || 'Citizen'
  const avatar = user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citizen'

  const displayLocation = location 
    ? (Math.hypot(location.latitude - 12.9348, location.longitude - 77.6208) > 0.5 && 
       Math.hypot(location.latitude - 12.9116, location.longitude - 77.6388) > 0.5)
      ? `Location (${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)})`
      : Math.hypot(location.latitude - 12.9116, location.longitude - 77.6388) < Math.hypot(location.latitude - 12.9348, location.longitude - 77.6208)
        ? "HSR Layout, Bengaluru"
        : "Koramangala, Bengaluru"
    : "Location";

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Menu className="hidden h-5 w-5 text-slate-400 lg:block" strokeWidth={2} />
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Welcome, {name.split(' ')[0]} <span aria-hidden>👋</span>
          </h1>
          <p className="text-sm text-slate-400">Let&apos;s make our city better together.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm hover:border-slate-300">
          <MapPin className="h-4 w-4 text-brand-500" strokeWidth={2.2} />
          <span className="font-medium">{displayLocation}</span>
          <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={2.2} />
        </button>

        <button
          onClick={onNotificationClick}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-slate-300"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={2.1} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white ring-2 ring-white">
            3
          </span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-100 cursor-pointer"
            title="Profile Options"
          >
            <img
              src={avatar}
              alt={name}
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="hidden text-sm font-medium text-slate-700 sm:block">{name}</span>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" strokeWidth={2.2} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg py-2 z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  if (onLogout) onLogout()
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
