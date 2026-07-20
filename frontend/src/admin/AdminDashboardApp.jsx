import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { authApi, adminApi, issuesApi, notificationsApi } from '../api';
import Sidebar from '../components/admin/AdminSidebar';
import Header from '../components/admin/AdminHeader';
import StatsCards from '../components/admin/StatsCards';
import IssuesOverTime from '../components/admin/IssuesOverTime';
import CategoryDistribution from '../components/admin/CategoryDistribution';
import PriorityDistribution from '../components/admin/PriorityDistribution';
import RecentIssuesTable from '../components/admin/RecentIssuesTable';
import RecentAlerts from '../components/admin/RecentAlerts';
import PendingVerifications from '../components/admin/PendingVerifications';
import { Shield, Settings, History, HelpCircle, BarChart3, AlertOctagon } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  // States for dashboard datasets
  const [stats, setStats] = useState(null);
  const [issuesOverTime, setIssuesOverTime] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [issues, setIssues] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [verifications, setVerifications] = useState([]);
  
  // Users directory list
  const [userDirectory, setUserDirectory] = useState([]);
  const [dirLoading, setDirLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Admin Profile
      const u = await authApi.getMe();
      if (u.role !== 'admin') {
        throw new Error('Access denied. Admin role required.');
      }
      setUser(u);

      // 2. Fetch Metrics Stats
      const statData = await adminApi.getStats();
      setStats(statData);

      // 3. Fetch Charts Data
      const overTimeData = await adminApi.getIssuesOverTime();
      setIssuesOverTime(overTimeData);

      const catData = await adminApi.getCategories();
      setCategories(catData);

      const prioData = await adminApi.getPriorities();
      setPriorities(prioData);

      // 4. Fetch Recent Issues
      const allIssues = await issuesApi.list();
      setIssues(allIssues);

      // 5. Fetch Pending Verifications
      const pendingVer = await adminApi.getVerifications();
      setVerifications(pendingVer);

      // 6. Fetch Alerts Feed
      const alertData = await adminApi.getAlerts();
      setAlerts(alertData);
    } catch (err) {
      console.error(err);
      handleLogout();
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    const token = urlToken || localStorage.getItem('token');
    if (token) {
      fetchDashboardData().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshTrigger]);

  useEffect(() => {
    if (user) {
      notificationsApi.list().then(setNotifications).catch(console.error);
      const interval = setInterval(() => {
        adminApi.getAlerts().then(setAlerts).catch(console.error);
        notificationsApi.list().then(setNotifications).catch(console.error);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length || alerts.length;

  // Handle Fetch Users Directory dynamically
  useEffect(() => {
    if (activeTab === 'Solvers') {
      setDirLoading(true);
      adminApi.getUsers('solver')
        .then(data => {
          setUserDirectory(data);
          setDirLoading(false);
        })
        .catch(err => {
          console.error(err);
          setDirLoading(false);
        });
    } else if (activeTab === 'Citizens') {
      setDirLoading(true);
      adminApi.getUsers('citizen')
        .then(data => {
          setUserDirectory(data);
          setDirLoading(false);
        })
        .catch(err => {
          console.error(err);
          setDirLoading(false);
        });
    }
  }, [activeTab, refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center font-bold text-slate-500">
        Loading WeResolve Admin Portal...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Left 2/3 Area */}
            <div className="col-span-1 xl:col-span-2 space-y-6">
              {/* Charts Subgrid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IssuesOverTime data={issuesOverTime} />
                <CategoryDistribution data={categories} />
              </div>

              {/* Issues Database Table */}
              <RecentIssuesTable issues={issues} />
            </div>

            {/* Right 1/3 Area */}
            <div className="space-y-6">
              {/* Priority Chart */}
              <PriorityDistribution data={priorities} />

              {/* Feed Alerts */}
              <RecentAlerts alerts={alerts} />

              {/* Verifications comparison panel */}
              <PendingVerifications verifications={verifications} onVerifySuccess={triggerRefresh} />
            </div>
          </div>
        );
      case 'Issues':
        return (
          <div className="max-w-5xl mx-auto">
            <RecentIssuesTable issues={issues} />
          </div>
        );
      case 'Verifications':
        return (
          <div className="max-w-2xl mx-auto">
            <PendingVerifications verifications={verifications} onVerifySuccess={triggerRefresh} />
          </div>
        );
      case 'Solvers':
        return (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Registered Solvers</h3>
            <p className="text-xs text-slate-400 font-semibold mb-6">List of active solvers in the city database.</p>
            {dirLoading ? (
              <p className="text-xs text-slate-400 font-bold">Loading solvers...</p>
            ) : userDirectory.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold">No solvers found.</p>
            ) : (
              <div className="space-y-3">
                {userDirectory.map(usr => (
                  <div key={usr.id} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <img src={usr.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Solver'} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-extrabold text-slate-950">{usr.full_name}</p>
                        <p className="text-slate-400 mt-0.5">{usr.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-green-600 font-black">{usr.credits} Credits</span>
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-extrabold rounded-lg border border-purple-100">Level {usr.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'Citizens':
        return (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Registered Citizens</h3>
            <p className="text-xs text-slate-400 font-semibold mb-6">List of citizens reporting local issues.</p>
            {dirLoading ? (
              <p className="text-xs text-slate-400 font-bold">Loading citizens...</p>
            ) : userDirectory.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold">No citizens found.</p>
            ) : (
              <div className="space-y-3">
                {userDirectory.map(usr => (
                  <div key={usr.id} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <img src={usr.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citizen'} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-extrabold text-slate-950">{usr.full_name}</p>
                        <p className="text-slate-400 mt-0.5">{usr.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-green-600 font-black">{usr.credits} Credits</span>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-extrabold rounded-lg border border-blue-100">Citizen</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'Reports & Analytics':
        return (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <IssuesOverTime data={issuesOverTime} />
              <CategoryDistribution data={categories} />
            </div>
            <div className="max-w-md">
              <PriorityDistribution data={priorities} />
            </div>
          </div>
        );
      case 'AI Insights':
        return (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-blue-600" />
              <span>AI Civic Dispatch Analysis</span>
            </h3>
            <p className="text-xs text-slate-400 font-semibold mb-6">Automated hot-spot profiling and recommendations.</p>
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <h4 className="font-bold text-blue-900">Garbage Accumulation Clustering</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Reports indicate a 24% surge in garbage issues in Koramangala 7th block. Highly recommend establishing a daily municipal vehicle route along 4th Main Road.
                </p>
              </div>
            </div>
          </div>
        );
      case 'Credits & Rewards':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Global Credit Issuance</h3>
            <div className="p-4 bg-slate-50 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Awarded Credits:</span>
                <span className="text-green-600 font-black">2,450 Credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Redeemed Goods:</span>
                <span className="text-slate-700 font-bold">142 community rewards</span>
              </div>
            </div>
          </div>
        );
      case 'Sponsors':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Corporate Sponsors</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-center">
              <div className="p-4 border rounded-xl">TATA Civic Foundation</div>
              <div className="p-4 border rounded-xl">Infosys Community Grant</div>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" />
              <span>Dashboard Configurations</span>
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Municipal Contact Email</label>
                <input type="text" className="w-full p-2 border rounded-xl font-semibold outline-none" defaultValue="contact@weresolve.gov" />
              </div>
            </div>
          </div>
        );
      case 'Activity Logs':
        return (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              <span>Activity Logs</span>
            </h3>
            <div className="space-y-3.5 text-xs text-slate-600">
              <p>• Admin verified proof for Task #1245 at 5:10 PM</p>
              <p>• Citizen reported issue UP-1250 at 3:12 PM</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-svh overflow-hidden bg-slate-50/50 relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); if (window.innerWidth < 1024) setSidebarOpen(false); }}
          onLogout={handleLogout}
          unreadCount={unreadCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <Header
          user={user}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(o => !o)}
          onNotificationClick={() => setActiveTab('Activity Logs')}
          unreadCount={unreadCount}
        />

        {/* Stats Summary Row */}
        <StatsCards stats={stats} />

        {/* Dash Grid */}
        <main className="px-4 sm:px-6 md:px-8 pb-8">
          <div className="mt-4">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
