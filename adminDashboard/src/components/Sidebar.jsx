import { useState } from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  CheckCircle,
  Users,
  Award,
  BarChart2,
  Brain,
  Gift,
  Handshake,
  Settings,
  History,
  LogOut,
  HeartPulse,
  ChevronDown,
  ChevronRight,
  Shield,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: AlertTriangle, label: 'Issues', hasSubmenu: true },
    { icon: CheckCircle, label: 'Verifications' },
    { icon: Users, label: 'Users', hasSubmenu: true, isDropdownTrigger: true },
    { icon: BarChart2, label: 'Reports & Analytics' },
    { icon: Brain, label: 'AI Insights' },
    { icon: Gift, label: 'Credits & Rewards' },
    { icon: Handshake, label: 'Sponsors' },
    { icon: Settings, label: 'Settings' },
    { icon: History, label: 'Activity Logs' },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-slate-400 p-5 flex flex-col shrink-0 h-full border-r border-slate-800 overflow-y-auto">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
          <HeartPulse className="h-6 w-6 text-white" strokeWidth={2.4} />
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-black text-white leading-none">WeResolve</h1>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-1 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const isActive = activeTab === item.label;
          
          if (item.isDropdownTrigger) {
            const isUserActive = activeTab === 'Solvers' || activeTab === 'Citizens';
            return (
              <div key={idx} className="space-y-1">
                {/* Expandable Users Item */}
                <div
                  onClick={() => setShowUsersDropdown(!showUsersDropdown)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl cursor-pointer transition duration-150 ${
                    isUserActive
                      ? 'bg-blue-600/10 text-blue-400 font-extrabold border border-blue-600/20'
                      : 'hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <item.icon className="w-5 h-5" strokeWidth={2} />
                  <span className="flex-1 text-sm">{item.label}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showUsersDropdown ? 'rotate-180' : ''}`} />
                </div>

                {/* Submenu Dropdown */}
                {showUsersDropdown && (
                  <div className="pl-6 space-y-1 mt-1 transition-all duration-200">
                    <div
                      onClick={() => setActiveTab('Solvers')}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-lg cursor-pointer text-xs font-bold transition duration-150 ${
                        activeTab === 'Solvers'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Solvers</span>
                    </div>
                    <div
                      onClick={() => setActiveTab('Citizens')}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-lg cursor-pointer text-xs font-bold transition duration-150 ${
                        activeTab === 'Citizens'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Citizens</span>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={idx}
              onClick={() => {
                if (setActiveTab) setActiveTab(item.label);
              }}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl cursor-pointer transition duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-600/10'
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={2} />
              <span className="flex-1 text-sm">{item.label}</span>
              {item.hasSubmenu && (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile Box */}
      <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/25">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-xs font-bold text-white truncate">Administrator</p>
            <p className="text-[10px] text-blue-400 font-bold mt-0.5">Super Admin</p>
          </div>
        </div>

        {/* Logout Action */}
        <div 
          onClick={onLogout}
          className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl cursor-pointer text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition duration-150"
        >
          <LogOut className="w-5 h-5 text-slate-400 hover:text-red-400" />
          <span className="text-sm font-semibold">Logout</span>
        </div>
      </div>
    </div>
  );
}
