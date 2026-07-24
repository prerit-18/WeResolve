import { Link } from 'react-router-dom';
import { HeartPulse, ArrowRight, Shield, Award, Users, MapPin, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-between font-sans relative overflow-hidden text-slate-300">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-secondary/20">
            <HeartPulse className="h-5 w-5 text-white animate-pulse" strokeWidth={2.4} />
          </div>
          <span className="text-base font-black tracking-tight text-white">WeResolve</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-white transition">
            Sign In
          </Link>
          <Link to="/register" className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primaryDark text-xs font-bold text-white shadow-lg shadow-primary/10 transition">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-20 flex-1 flex flex-col items-center justify-center text-center z-10 relative">
        <span className="text-[10px] text-primary font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3 h-3 text-primary" /> Shaping Smart Cities
        </span>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-3xl">
          Empowering Communities to <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Resolve Civic Issues</span> Together
        </h1>
        
        <p className="mt-6 text-sm sm:text-base text-slate-400 font-medium max-w-xl leading-relaxed">
          WeResolve bridges the gap between citizens, skilled solvers, and municipal authorities to fast-track issue reporting, verification, and crowdsourced resolutions.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-secondary to-primary hover:from-secondaryDark hover:to-primaryDark text-xs font-black text-white tracking-wide shadow-xl shadow-secondary/25 transition duration-300 flex items-center gap-2 group"
          >
            Access Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition duration-300" />
          </Link>
          <Link
            to="/register"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-black text-slate-200 border border-slate-800 transition duration-300"
          >
            Create Civic Identity
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="bg-[#111827]/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-secondary/30 transition duration-300">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Report Instantly</h3>
            <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed">
              Pinpoint public utility complaints, attach photographic proof, and track status transparency updates in real-time.
            </p>
          </div>

          <div className="bg-[#111827]/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-primary/30 transition duration-300">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Crowdsourced Solvers</h3>
            <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed">
              Earn impact points, gain badges, and upgrade levels by choosing nearby tickets and executing verified repair services.
            </p>
          </div>

          <div className="bg-[#111827]/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-secondary/30 transition duration-300">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Verified Oversight</h3>
            <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed">
               Administrators review proof submittals, authorize resolutions, trigger payouts, and monitor town-wide utility metrics.
            </p>
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
