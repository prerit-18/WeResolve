import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Lock, Mail, User, ShieldAlert } from 'lucide-react';
import { authApi } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen', 'solver' (no admin signup)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ROLE_CONFIG = {
    citizen: {
      label: 'Citizen',
      emoji: '📣',
      accentColor: 'indigo',
      badgeBg: 'bg-indigo-600',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20',
      borderFocus: 'focus:border-indigo-500 focus:ring-indigo-500/20'
    },
    solver: {
      label: 'Solver',
      emoji: '🛠️',
      accentColor: 'purple',
      badgeBg: 'bg-purple-600',
      btnBg: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20',
      borderFocus: 'focus:border-purple-500 focus:ring-purple-500/20'
    }
  };

  const currentStyle = ROLE_CONFIG[activeTab];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Sign Up
      await authApi.signup(email, password, fullName, activeTab);
      // 2. Automatically Log In after signup
      const data = await authApi.login(email, password);
      const user = data.user;
      const token = data.access_token;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 3. Redirect to dashboard
      if (user.role === 'citizen') {
        navigate('/citizen/dashboard');
      } else if (user.role === 'solver') {
        navigate('/solver/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-between font-sans relative overflow-hidden text-slate-300">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10 border-b border-slate-900/60">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition duration-300">
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
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${currentStyle.accentColor}-500 to-transparent transition-all duration-500`}></div>

          {/* Title Header */}
          <div className="text-center mb-6">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800/50">
              Identity Registration
            </span>
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${currentStyle.badgeBg} shadow-xl shadow-${currentStyle.accentColor}-500/10 mt-4 mb-4 transition-all duration-500 transform hover:scale-105`}>
              <span className="text-2xl">{currentStyle.emoji}</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">
              Create Account
            </h2>
            <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed">
              Create a new civic identity
            </p>
          </div>

          {/* Role Tab Selection */}
          <div className="bg-[#1f2937]/60 p-1.5 rounded-2xl border border-slate-800/80 flex gap-1 mb-6">
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
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 focus:outline-none ${currentStyle.borderFocus}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder={`e.g. user@weresolve.org`}
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
              {loading ? 'Creating Account...' : `Register as ${currentStyle.label}`}
            </button>
          </form>

          {/* Login Toggle */}
          <div className="text-center pt-4 border-t border-slate-800/80 mt-5">
            <Link to="/login" className={`text-xs font-bold hover:underline text-${currentStyle.accentColor}-400`}>
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 text-center border-t border-slate-900 mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        &copy; 2026 WeResolve Civic Solutions. All rights reserved.
      </footer>
    </div>
  );
}
