import { useState, useEffect } from 'react';
import { authApi } from '../api';
import { HeartPulse, Lock, Mail, User, ShieldAlert } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen', 'solver', 'admin'
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill or map role ports
  const ROLE_PORT_MAP = {
    admin: '5173',
    citizen: '5174',
    solver: '5175'
  };

  // Determine current dashboard's expected role based on the port
  const currentPort = window.location.port;
  let currentDashboardRole = 'citizen';
  if (currentPort === '5173') {
    currentDashboardRole = 'admin';
  } else if (currentPort === '5175') {
    currentDashboardRole = 'solver';
  }

  // Sync tab with current dashboard role on load
  useEffect(() => {
    setActiveTab(currentDashboardRole);
  }, [currentDashboardRole]);

  // Seed tips data
  const seedInfo = {
    admin: {
      email: 'admin@weresolve.gov',
      pass: 'admin123',
      label: 'Admin',
      color: 'text-blue-500 hover:text-blue-600',
      badgeBg: 'bg-blue-600'
    },
    citizen: {
      email: 'citizen@weresolve.org',
      pass: 'citizen123',
      label: 'Citizen',
      color: 'text-indigo-500 hover:text-indigo-600',
      badgeBg: 'bg-indigo-600'
    },
    solver: {
      email: 'arjun@weresolve.org',
      pass: 'solver123',
      label: 'Solver',
      color: 'text-purple-500 hover:text-purple-600',
      badgeBg: 'bg-purple-600'
    }
  };

  const handleQuickSeed = (role) => {
    setEmail(seedInfo[role].email);
    setPassword(seedInfo[role].pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const data = await authApi.login(email, password);
        const user = data.user;
        const token = data.access_token;

        // Perform cross-port redirection if the logged-in role doesn't match the current dashboard
        if (user.role !== currentDashboardRole) {
          const targetPort = ROLE_PORT_MAP[user.role];
          if (targetPort) {
            window.location.href = `${window.location.protocol}//${window.location.hostname}:${targetPort}/?token=${token}`;
            return;
          }
        }

        // Local login success
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else {
        // Sign Up (Citizen / Solver only)
        const user = await authApi.signup(email, password, fullName, activeTab);
        // Automatically login
        const data = await authApi.login(email, password);
        const token = data.access_token;

        if (activeTab !== currentDashboardRole) {
          const targetPort = ROLE_PORT_MAP[activeTab];
          if (targetPort) {
            window.location.href = `${window.location.protocol}//${window.location.hostname}:${targetPort}/?token=${token}`;
            return;
          }
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Color config based on selected tab
  const tabStyles = {
    citizen: {
      accent: 'indigo',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20',
      borderFocus: 'focus:border-indigo-600 focus:ring-indigo-600/20',
      textAccent: 'text-indigo-400',
      badgeBg: 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20',
      gradient: 'from-indigo-600/20 to-transparent'
    },
    solver: {
      accent: 'purple',
      btnBg: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20',
      borderFocus: 'focus:border-purple-600 focus:ring-purple-600/20',
      textAccent: 'text-purple-400',
      badgeBg: 'bg-purple-600/10 text-purple-400 border-purple-500/20',
      gradient: 'from-purple-600/20 to-transparent'
    },
    admin: {
      accent: 'blue',
      btnBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
      borderFocus: 'focus:border-blue-600 focus:ring-blue-600/20',
      textAccent: 'text-blue-400',
      badgeBg: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
      gradient: 'from-blue-600/20 to-transparent'
    }
  };

  const currentStyle = tabStyles[activeTab];

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 font-sans">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse duration-500"></div>

      <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-[#111827]/80 backdrop-blur-xl p-5 sm:p-8 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Subtle top role-specific gradient border glow */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent ${activeTab === 'citizen' ? 'via-indigo-500' : activeTab === 'solver' ? 'via-purple-500' : 'via-blue-500'} to-transparent`}></div>
        
        {/* Brand Header */}
        <div className="text-center relative">
          <div className="flex justify-center gap-3 mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
              Civic Portal
            </span>
          </div>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/10 mb-4 transform hover:scale-105 transition-all duration-300">
            <HeartPulse className="h-8 w-8 text-white animate-pulse" strokeWidth={2.4} />
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tight leading-none">
            WeResolve
          </h2>
          <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed">
            {isLogin ? 'Single sign-on access to municipal systems' : 'Create a new civic identity'}
          </p>
        </div>

        {/* Tab Selection */}
        {isLogin && (
          <div className="bg-[#1f2937]/60 p-1.5 rounded-2xl border border-slate-800/80 flex flex-wrap sm:flex-nowrap gap-1">
            <button
              type="button"
              onClick={() => { setActiveTab('citizen'); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeTab === 'citizen'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f2937]/40'
              }`}
            >
              📣 Citizen
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('solver'); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeTab === 'solver'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f2937]/40'
              }`}
            >
              🛠️ Solver
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f2937]/40'
              }`}
            >
              🏛️ Admin
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 text-xs text-red-400 font-bold animate-headShake">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Arjun Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 ${currentStyle.borderFocus}`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder={seedInfo[activeTab].email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 ${currentStyle.borderFocus}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
              Secret Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 ${currentStyle.borderFocus}`}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                Register As
              </label>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className={`w-full px-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-bold text-white outline-none transition-all duration-300 focus:border-${activeTab}-600`}
              >
                <option value="citizen" className="bg-[#111827] text-white">Citizen (Report problems)</option>
                <option value="solver" className="bg-[#111827] text-white">Solver (Earn credits by fixing issues)</option>
              </select>
            </div>
          )}

          {/* Quick Seeds */}
          {isLogin && (
            <div className="bg-[#1f2937]/30 border border-slate-800/80 rounded-2xl p-4 text-[11px] text-slate-400 leading-normal">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-300">💡 Quick Seed Autocomplete:</span>
              </div>
              <p className="mt-1 flex flex-wrap gap-1.5 items-center">
                Fill as:{' '}
                <button
                  type="button"
                  onClick={() => handleQuickSeed('citizen')}
                  className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-extrabold border border-indigo-500/20 hover:bg-indigo-500/20 transition"
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSeed('solver')}
                  className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-extrabold border border-purple-500/20 hover:bg-purple-500/20 transition"
                >
                  Solver
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSeed('admin')}
                  className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-extrabold border border-blue-500/20 hover:bg-blue-500/20 transition"
                >
                  Admin
                </button>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 text-white rounded-xl font-bold transition duration-300 disabled:opacity-50 text-sm flex items-center justify-center gap-2 shadow-lg ${currentStyle.btnBg}`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {isLogin ? `Sign In as ${seedInfo[activeTab].label}` : `Create ${seedInfo[activeTab].label} Account`}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Signup Toggle */}
        {activeTab !== 'admin' && (
          <div className="text-center pt-4 border-t border-slate-800/80">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className={`text-xs font-bold hover:underline ${currentStyle.textAccent}`}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
