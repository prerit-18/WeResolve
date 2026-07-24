import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Lock, Mail, ShieldAlert, Shield } from 'lucide-react';
import { authApi } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen', 'solver', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ROLE_CONFIG = {
    citizen: {
      label: 'Citizen',
      emoji: '📣',
      accentColor: 'secondary',
      badgeBg: 'bg-secondary',
      btnBg: 'bg-secondary hover:bg-secondaryDark shadow-secondary/20',
      borderFocus: 'focus:border-secondary focus:ring-secondary/20'
    },
    solver: {
      label: 'Solver',
      emoji: '🛠️',
      accentColor: 'primary',
      badgeBg: 'bg-primary',
      btnBg: 'bg-primary hover:bg-primaryDark shadow-primary/20',
      borderFocus: 'focus:border-primary focus:ring-primary/20'
    },
    admin: {
      label: 'Admin',
      emoji: '🏛️',
      accentColor: 'secondary',
      badgeBg: 'bg-secondary',
      btnBg: 'bg-secondary hover:bg-secondaryDark shadow-secondary/20',
      borderFocus: 'focus:border-secondary focus:ring-secondary/20'
    }
  };

  const currentStyle = ROLE_CONFIG[activeTab];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      const user = data.user;
      const token = data.access_token;

      // Restrict login to selected tab role
      if (user.role !== activeTab) {
        const expectedLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
        const actualLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        throw new Error(`Access denied: ${actualLabel} accounts cannot log in on the ${expectedLabel} tab.`);
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect depending on user role
      if (user.role === 'citizen') {
        navigate('/citizen/dashboard');
      } else if (user.role === 'solver') {
        navigate('/solver/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#0b0f19] bg-cover bg-center bg-no-repeat flex flex-col justify-between font-sans relative overflow-hidden text-slate-300"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10 border-b border-slate-900/60">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-105 transition duration-300">
            <HeartPulse className="h-5 w-5 text-white" strokeWidth={2.4} />
          </div>
          <span className="text-base font-black tracking-tight text-white group-hover:text-slate-100 transition duration-300">WeResolve</span>
        </Link>
        <div className="text-[10px] text-slate-500 font-black tracking-wider uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          Gateway STATUS: <span className="text-green-500">ONLINE</span>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-md mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center z-10">
        <div className="bg-[#111827]/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top Accent Line */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${currentStyle.accentColor} to-transparent transition-all duration-500`}></div>

          {/* Title Header */}
          <div className="text-center mb-6">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800/50">
              Authentication Gate
            </span>
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${currentStyle.badgeBg} shadow-xl shadow-${currentStyle.accentColor}/10 mt-4 mb-4 transition-all duration-500 transform hover:scale-105`}>
              <span className="text-2xl">{currentStyle.emoji}</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">
              WeResolve Portal
            </h2>
            <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed">
              Log in to access your civic dashboard
            </p>
          </div>

          {/* Role Tab Selection */}
          <div className="bg-[#1f2937]/60 p-1.5 rounded-2xl border border-slate-800/80 flex gap-1 mb-6">
            {Object.keys(ROLE_CONFIG).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => { setActiveTab(role); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  activeTab === role
                    ? `${ROLE_CONFIG[role].badgeBg} text-white shadow-lg shadow-${ROLE_CONFIG[role].accentColor}/15`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f2937]/40'
                }`}
              >
                {ROLE_CONFIG[role].emoji} {ROLE_CONFIG[role].label}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 text-xs text-red-400 font-bold mb-6 animate-headShake">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder={`e.g. ${activeTab}@weresolve.org`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 focus:outline-none ${currentStyle.borderFocus}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 focus:outline-none ${currentStyle.borderFocus}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-white rounded-xl font-bold transition duration-300 disabled:opacity-50 text-sm flex items-center justify-center gap-2 shadow-lg ${currentStyle.btnBg}`}
            >
              {loading ? 'Authenticating...' : `Sign In as ${currentStyle.label}`}
            </button>
          </form>

          {/* Signup Toggle */}
          {activeTab !== 'admin' && (
            <div className="text-center pt-4 border-t border-slate-800/80 mt-5">
              <Link to="/register" className={`text-xs font-bold hover:underline text-${currentStyle.accentColor}`}>
                Don't have an account? Sign Up
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 text-center border-t border-slate-900 mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        &copy; 2026 WeResolve Civic Solutions. All rights reserved.
      </footer>
    </div>
  );
}
