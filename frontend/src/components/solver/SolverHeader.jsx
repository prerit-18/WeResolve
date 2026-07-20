import { useState } from 'react';
import { MapPin, Bell, ChevronDown, LogOut, Menu } from 'lucide-react';

export default function Header({ user, location, onNotificationClick, onMenuClick, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const name = user?.full_name || 'Arjun Kumar';
  const avatar = user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100';

  const displayLocation = location 
    ? (Math.hypot(location.latitude - 12.9348, location.longitude - 77.6208) > 0.5 && 
       Math.hypot(location.latitude - 12.9116, location.longitude - 77.6388) > 0.5)
      ? `Location (${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)})`
      : Math.hypot(location.latitude - 12.9116, location.longitude - 77.6388) < Math.hypot(location.latitude - 12.9348, location.longitude - 77.6208)
        ? "HSR Layout, Bengaluru"
        : "Koramangala, Bengaluru"
    : "Location";

  return (
    <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition shrink-0 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 truncate">
              Welcome, {name.split(' ')[0]} <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-xs hidden sm:block">Let's solve more issues and create impact.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          {/* Location Selector */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer shadow-sm transition-all duration-200">
            <MapPin className="w-5 h-5 text-purple-600" />
            <select className="bg-transparent text-slate-700 font-bold text-sm outline-none border-none cursor-pointer pr-1">
              <option>{displayLocation}</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <div 
            onClick={onNotificationClick}
            className="relative p-2 bg-white rounded-full border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-all duration-200"
          >
            <Bell className="w-5 h-5 text-slate-600 hover:text-slate-900" />
            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              3
            </span>
          </div>

          {/* Profile Section */}
          <div className="relative">
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 md:gap-3 pl-3 md:pl-6 border-l border-slate-200 cursor-pointer hover:opacity-85 transition"
              title="Profile Options"
            >
              <img
                src={avatar}
                alt={name}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-slate-100 shadow-sm"
              />
              <div className="leading-tight hidden md:flex items-center gap-1">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{name}</p>
                  <p className="text-[11px] text-green-600 font-bold mt-0.5">Solver Level {user?.level || 2}</p>
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