import { useState } from 'react';
import { Calendar, Bell, ChevronDown, LogOut, Menu } from 'lucide-react';

export default function Header({ user, onNotificationClick, onMenuClick, onLogout, unreadCount = 0 }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const name = user?.full_name || 'Admin';
  const avatar = user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100';

  return (
    <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6">
      <div className="flex items-center justify-between gap-3">
        {/* Left Titles */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition shrink-0 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-none truncate">Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1 text-xs hidden sm:block">Overview of city issues and platform activity</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Date Picker */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 transition duration-150">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700 font-bold text-xs">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>

          {/* Notifications */}
          <div 
            onClick={onNotificationClick}
            className="relative p-2.5 bg-white border border-slate-200/80 rounded-full shadow-sm cursor-pointer hover:bg-slate-50 transition duration-150"
          >
            <Bell className="w-5 h-5 text-slate-600 hover:text-slate-900" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Profile Card */}
          <div className="relative">
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 md:gap-3 pl-3 md:pl-5 border-l border-slate-200 cursor-pointer hover:opacity-85 transition"
              title="Profile Options"
            >
              <img
                src={avatar}
                alt={name}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-slate-200 shadow-sm"
              />
              <div className="leading-tight hidden md:flex items-center gap-1">
                <div>
                  <p className="font-bold text-slate-950 text-sm truncate max-w-[100px]">{name}</p>
                  <p className="text-[10px] text-blue-600 font-black tracking-wide mt-0.5">Super Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onLogout) onLogout();
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
      </div>
    </div>
  );
}
