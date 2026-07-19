import { useState, useEffect } from 'react'
import { authApi, issuesApi } from './api'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ReportNewIssue from './components/ReportNewIssue'
import IssueHeatmap from './components/IssueHeatmap'
import StatsRow from './components/StatsRow'
import MyReports from './components/MyReports'
import NearbyIssues from './components/NearbyIssues'
import { Bell, Gift, HelpCircle, User as UserIcon } from 'lucide-react'

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [nearby, setNearby] = useState([])
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [location, setLocation] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Request location permission on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location permission denied or unavailable.", error);
        }
      );
    }
  }, []);

  const fetchUserDataAndReports = async (currentLoc) => {
    try {
      const u = await authApi.getMe()
      setUser(u)
      
      // Fetch issues reported by me
      const myReports = await issuesApi.listMyReports()
      setReports(myReports)

      // Fetch all reported issues for Nearby Issues
      const allIssues = await issuesApi.list()
      const filtered = allIssues.filter(i => i.citizen_id !== u.id)
      
      const loc = currentLoc || location;
      if (loc) {
        const withDistance = filtered.map(i => ({
          ...i,
          distance: getDistance(loc.latitude, loc.longitude, i.latitude, i.longitude)
        })).filter(i => i.distance <= 100).sort((a, b) => a.distance - b.distance);
        setNearby(withDistance);
      } else {
        setNearby(filtered);
      }
    } catch (err) {
      handleLogout()
    }
  }

  // Update nearby list when location becomes available
  useEffect(() => {
    if (user && location && nearby.length > 0) {
      const withDistance = nearby.map(i => ({
        ...i,
        distance: getDistance(location.latitude, location.longitude, i.latitude, i.longitude)
      })).filter(i => i.distance <= 100).sort((a, b) => a.distance - b.distance);
      setNearby(withDistance);
    }
  }, [location, user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    const token = urlToken || localStorage.getItem('token');
    if (token) {
      fetchUserDataAndReports().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const handleNewReport = async () => {
    // Refresh issue list
    const myReports = await issuesApi.listMyReports()
    setReports(myReports)
    
    // Refresh user details
    const u = await authApi.getMe()
    setUser(u)
    
    // Go to reports view
    setActiveTab('My Reports')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">
        Loading WeResolve Citizen Portal...
      </div>
    )
  }

  if (!user) {
    return <Login onLoginSuccess={() => {
      setLoading(true)
      fetchUserDataAndReports().finally(() => setLoading(false))
    }} />
  }

  // Render main content panel dynamically based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
              <div className="xl:col-span-2">
                <ReportNewIssue location={location} onReportSubmitted={handleNewReport} />
              </div>
              <div className="xl:col-span-3">
                <IssueHeatmap issues={reports} />
              </div>
            </div>

            <StatsRow reports={reports} user={user} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <MyReports reports={reports} onViewAll={() => setActiveTab('My Reports')} />
              <NearbyIssues issues={nearby} onViewAll={() => setActiveTab('Nearby Issues')} />
            </div>
          </>
        )
      case 'Report Issue':
        return (
          <div className="max-w-2xl mx-auto">
            <ReportNewIssue location={location} onReportSubmitted={handleNewReport} />
          </div>
        )
      case 'My Reports':
        return (
          <div className="max-w-4xl mx-auto">
            <MyReports reports={reports} />
          </div>
        )
      case 'Nearby Issues':
        return (
          <div className="max-w-4xl mx-auto">
            <NearbyIssues issues={nearby} />
          </div>
        )
      case 'Notifications':
        return (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-card">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-500" />
              <span>Notifications Feed</span>
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-xs font-bold text-slate-800">New high-priority issue verified</p>
                <p className="text-[11px] text-slate-400 mt-1">10 mins ago • Municipal Team started work on pothole</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-xs font-bold text-slate-800">Verification submitted for issue UP-1245</p>
                <p className="text-[11px] text-slate-400 mt-1">45 mins ago • Solver uploaded resolution image</p>
              </div>
            </div>
          </div>
        )
      case 'Rewards & Credits':
        return (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-card">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Gift className="w-5 h-5 text-brand-500" />
              <span>Civic Rewards Catalog</span>
            </h2>
            <p className="text-xs text-slate-400 font-semibold mb-6">Redeem your social credits for community gifts and benefits.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-100 p-4 rounded-xl shadow-sm text-center">
                <span className="text-2xl">🚌</span>
                <h3 className="text-sm font-bold mt-2">Bus Pass Discount</h3>
                <p className="text-xs text-slate-500 mt-1">Get 20% off BMTC monthly passes</p>
                <button className="mt-4 px-3 py-1.5 bg-brand-500 text-white rounded-lg text-xs font-bold w-full hover:bg-brand-600 transition">
                  Redeem (100 Credits)
                </button>
              </div>
              <div className="border border-slate-100 p-4 rounded-xl shadow-sm text-center">
                <span className="text-2xl">🌳</span>
                <h3 className="text-sm font-bold mt-2">Public Park Pass</h3>
                <p className="text-xs text-slate-500 mt-1">Free entry to premium botanical gardens</p>
                <button className="mt-4 px-3 py-1.5 bg-brand-500 text-white rounded-lg text-xs font-bold w-full hover:bg-brand-600 transition">
                  Redeem (50 Credits)
                </button>
              </div>
              <div className="border border-slate-100 p-4 rounded-xl shadow-sm text-center">
                <span className="text-2xl">🎫</span>
                <h3 className="text-sm font-bold mt-2">Civic Event Ticket</h3>
                <p className="text-xs text-slate-500 mt-1">Get free tickets to Independence Day parade</p>
                <button className="mt-4 px-3 py-1.5 bg-brand-500 text-white rounded-lg text-xs font-bold w-full hover:bg-brand-600 transition">
                  Redeem (150 Credits)
                </button>
              </div>
            </div>
          </div>
        )
      case 'Help & Support':
        return (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-card">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-500" />
              <span>Help & Support Center</span>
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800">How do I earn social credits?</h3>
                <p className="text-[11px] text-slate-500 mt-1">Report civic issues that get resolved by solvers. Once verified, you and the solver both receive credits.</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">What is verification proof?</h3>
                <p className="text-[11px] text-slate-500 mt-1">Before resolving a problem, solvers take a "Before" picture. Once fixed, they submit an "After" picture which is verified by admins.</p>
              </div>
            </div>
          </div>
        )
      case 'Profile':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-card text-center">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citizen'}
              alt={user?.full_name}
              className="w-20 h-20 rounded-full mx-auto object-cover border border-slate-100 shadow-sm mb-4"
            />
            <h2 className="text-lg font-bold text-slate-900">{user?.full_name}</h2>
            <p className="text-xs text-brand-600 font-bold uppercase mt-1">{user?.role} ACCOUNT</p>
            <div className="mt-6 border-t border-slate-100 pt-4 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Email:</span>
                <span className="text-slate-800 font-bold">{user?.email}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Credits Balance:</span>
                <span className="text-green-600 font-black">{user?.credits} Credits</span>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'
        }`}
      >
        <Sidebar
          className="flex"
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); if (window.innerWidth < 1024) setSidebarOpen(false); }}
          onLogout={handleLogout}
        />
      </div>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <Header
            user={user}
            location={location}
            onLogout={handleLogout}
            onMenuClick={() => setSidebarOpen(o => !o)}
            onNotificationClick={() => setActiveTab('Notifications')}
          />
          
          <div className="space-y-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
