import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatCard from './StatCard';
import ImpactWallet from './ImpactWallet';
import IssueCard from './IssueCard';
import MyTasks from './MyTasks';
import TopSolvers from './TopSolvers';
import { Gift, Award, Star, Shield, Filter, ChevronDown, Bell, User as UserIcon, HelpCircle } from 'lucide-react';
import { issuesApi, tasksApi } from '../api';

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

export default function Dashboard({ user, onLogout, refreshTrigger, triggerRefresh, activeTab, setActiveTab }) {
  const [issues, setIssues] = useState([]);
  const [tasksCount, setTasksCount] = useState(0);
  const [location, setLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Any Category');
  const [selectedSort, setSelectedSort] = useState('Nearest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [selectedPriorities, setSelectedPriorities] = useState(['High', 'Medium', 'Low']);

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

  useEffect(() => {
    const getIssueLocationName = (lat, lon) => {
      if (!lat || !lon) return "Koramangala, Bengaluru";
      const dKora = Math.hypot(lat - 12.9348, lon - 77.6208);
      const dHsr = Math.hypot(lat - 12.9116, lon - 77.6388);
      if (dKora > 0.05 && dHsr > 0.05) {
        return `Location (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
      }
      return dHsr < dKora ? "HSR Layout" : "Koramangala, Bengaluru";
    };

    // Fetch available issues
    issuesApi.listAvailable()
      .then(data => {
        const mapped = data.map(i => {
          const locName = getIssueLocationName(i.latitude, i.longitude);
          if (location) {
            const d = getDistance(location.latitude, location.longitude, i.latitude, i.longitude);
            return {
              ...i,
              location: locName,
              distance: d < 1 ? `${Math.round(d * 1000)} m away` : `${d.toFixed(1)} km away`,
              rawDistance: d
            };
          }
          return {
            ...i,
            location: locName,
            distance: 'Nearby',
            rawDistance: 0
          };
        });
        
        if (location) {
          mapped.sort((a, b) => a.rawDistance - b.rawDistance);
        }
        setIssues(mapped);
      })
      .catch(err => console.error(err));

    // Fetch solver tasks count
    tasksApi.listMyTasks()
      .then(tasks => {
        const completedCount = tasks.filter(t => t.status === 'Completed' || t.status === 'Approved').length;
        setTasksCount(completedCount);
      })
      .catch(err => console.error(err));
  }, [refreshTrigger, location]);

  const ratingValue = tasksCount === 0 ? 'N/A' : '4.8';
  const ratingChange = tasksCount === 0 ? 'No reviews' : '(32 reviews)';
  const badgesValue = tasksCount === 0 ? '0' : '7';
  const badgesChange = tasksCount === 0 ? 'No badges' : 'View all';
  const creditsChange = user?.credits === 0 ? 'No change' : '+40 this week';
  const tasksChange = tasksCount === 0 ? 'No tasks' : '+3 this week';

  const stats = [
    { icon: Gift, label: 'Social Credits', value: String(user?.credits !== undefined ? user.credits : 0), change: creditsChange, color: 'bg-green-50', textColor: 'text-green-600' },
    { icon: Award, label: 'Tasks Completed', value: String(tasksCount), change: tasksChange, color: 'bg-purple-50', textColor: 'text-purple-600' },
    { icon: Star, label: 'Rating', value: ratingValue, change: ratingChange, color: 'bg-orange-50', textColor: 'text-orange-600' },
    { icon: Shield, label: 'Badges Earned', value: badgesValue, change: badgesChange, color: 'bg-blue-50', textColor: 'text-blue-600' },
  ];

  const renderMainContent = () => {
    const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const filteredIssues = issues.filter(issue => {
      const matchesCategory = selectedCategory === 'Any Category' || issue.category === selectedCategory;
      const matchesPriority = selectedPriorities.includes(issue.priority);
      const matchesProximity = !location || issue.rawDistance <= 100;
      return matchesCategory && matchesPriority && matchesProximity;
    });

    const sortedIssues = [...filteredIssues].sort((a, b) => {
      if (selectedSort === 'Nearest') {
        return a.rawDistance - b.rawDistance;
      } else if (selectedSort === 'Newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (selectedSort === 'Priority') {
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }
      return 0;
    });

    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Left Content Area */}
            <div className="col-span-1 xl:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-[17px] font-bold text-slate-900 leading-tight">Available Issues</h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">Choose an issue nearby and start making a difference.</p>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3.5 mb-6">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold bg-white cursor-pointer hover:border-slate-300 outline-none"
                >
                  <option value="Any Category">Any Category</option>
                  <option value="Road Damage">Road Damage</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Street Light">Street Light</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Drainage">Drainage</option>
                  <option value="Others">Others</option>
                </select>

                <select 
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold bg-white cursor-pointer hover:border-slate-300 outline-none"
                >
                  <option value="Nearest">Sort by: Nearest</option>
                  <option value="Newest">Sort by: Newest</option>
                  <option value="Priority">Sort by: Priority (High to Low)</option>
                </select>

                <button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-4 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${showAdvancedFilters ? 'bg-purple-600 border-purple-600 text-white' : 'bg-purple-50/70 border-purple-100 hover:bg-purple-100/70 text-purple-600'}`}
                >
                  <Filter className="w-3.5 h-3.5" strokeWidth={2.2} />
                  <span>Filters</span>
                </button>
              </div>

              {/* Advanced Filters Panel */}
              {showAdvancedFilters && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Priority:</span>
                  {['High', 'Medium', 'Low'].map(prio => {
                    const isSelected = selectedPriorities.includes(prio);
                    return (
                      <button
                        key={prio}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedPriorities(selectedPriorities.filter(p => p !== prio));
                          } else {
                            setSelectedPriorities([...selectedPriorities, prio]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg border transition ${isSelected ? 'bg-white border-slate-200 text-purple-600 shadow-sm' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                        {prio}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Issues List */}
              {sortedIssues.length === 0 ? (
                <div className="text-center p-12 text-slate-400 font-bold border border-dashed border-slate-100 rounded-2xl">
                  No issues available at the moment. All clean!
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedIssues.map((issue) => (
                    <IssueCard 
                      key={issue.id} 
                      {...issue} 
                      onAcceptSuccess={triggerRefresh} 
                    />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              <div className="flex justify-center mt-6">
                <button className="text-purple-600 hover:text-purple-700 text-xs font-bold flex items-center gap-1 bg-purple-50 hover:bg-purple-100/70 px-4 py-2.5 rounded-xl transition">
                  <span>Load more issues</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Sidebar Area */}
            <div className="space-y-6">
              {/* Impact Wallet */}
              <ImpactWallet user={user} />
              
              {/* Solver Tasks List */}
              <MyTasks refreshTrigger={refreshTrigger} triggerRefresh={triggerRefresh} onViewAll={() => setActiveTab('My Tasks')} />
              
              {/* Leaderboard */}
              <TopSolvers onViewAll={() => setActiveTab('Leaderboard')} />
            </div>
          </div>
        );
      case 'Available Issues':
        return (
          <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm">
            <h2 className="text-[17px] font-bold text-slate-900 mb-4">Available Issues Feed</h2>
            
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3.5 mb-6">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold bg-white cursor-pointer hover:border-slate-300 outline-none"
              >
                <option value="Any Category">Any Category</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Garbage">Garbage</option>
                <option value="Street Light">Street Light</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Drainage">Drainage</option>
                <option value="Others">Others</option>
              </select>

              <select 
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold bg-white cursor-pointer hover:border-slate-300 outline-none"
              >
                <option value="Nearest">Sort by: Nearest</option>
                <option value="Newest">Sort by: Newest</option>
                <option value="Priority">Sort by: Priority (High to Low)</option>
              </select>

              <button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${showAdvancedFilters ? 'bg-purple-600 border-purple-600 text-white' : 'bg-purple-50/70 border-purple-100 hover:bg-purple-100/70 text-purple-600'}`}
              >
                <Filter className="w-3.5 h-3.5" strokeWidth={2.2} />
                <span>Filters</span>
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Priority:</span>
                {['High', 'Medium', 'Low'].map(prio => {
                  const isSelected = selectedPriorities.includes(prio);
                  return (
                    <button
                      key={prio}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPriorities(selectedPriorities.filter(p => p !== prio));
                        } else {
                          setSelectedPriorities([...selectedPriorities, prio]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg border transition ${isSelected ? 'bg-white border-slate-200 text-purple-600 shadow-sm' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      {prio}
                    </button>
                  );
                })}
              </div>
            )}

            {sortedIssues.length === 0 ? (
              <div className="text-center p-12 text-slate-400 font-bold border border-dashed border-slate-100 rounded-2xl">
                No issues match your current filters.
              </div>
            ) : (
              <div className="space-y-4">
                {sortedIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    {...issue} 
                    onAcceptSuccess={triggerRefresh} 
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'My Tasks':
      case 'Completed Tasks':
        return (
          <div className="max-w-xl mx-auto">
            <MyTasks refreshTrigger={refreshTrigger} triggerRefresh={triggerRefresh} />
          </div>
        );
      case 'Rewards & Credits':
        return (
          <div className="max-w-xl mx-auto">
            <ImpactWallet user={user} />
          </div>
        );
      case 'Leaderboard':
        return (
          <div className="max-w-xl mx-auto">
            <TopSolvers />
          </div>
        );
      case 'Notifications':
        return (
          <div className="max-w-xl mx-auto bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              <span>Solver Alerts</span>
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-800">Verification complete for issue UP-1220</p>
                <p className="text-[10px] text-slate-500 mt-1">1 hour ago • You earned 30 credits and 50 XP!</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-800">Task accepted successfully</p>
                <p className="text-[10px] text-slate-500 mt-1">2 hours ago • You are working on "Large pothole on 5th Main Road"</p>
              </div>
            </div>
          </div>
        );
      case 'Profile':
        return (
          <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-center">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'}
              alt={user?.full_name}
              className="w-20 h-20 rounded-full mx-auto object-cover border shadow-sm mb-3"
            />
            <h3 className="text-base font-bold text-slate-900">{user?.full_name}</h3>
            <p className="text-xs text-purple-600 font-bold uppercase mt-0.5">LEVEL {user?.level || 2} SOLVER</p>
            <div className="mt-6 border-t border-slate-100 pt-4 text-left space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-800">{user?.email}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">XP Progress:</span>
                <span className="text-purple-600">{user?.xp} / {user?.level * 100} XP</span>
              </div>
            </div>
          </div>
        );
      case 'Help & Support':
        return (
          <div className="max-w-xl mx-auto bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <span>Solver FAQ</span>
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800">When do I receive credits?</h4>
                <p className="text-[11px] text-slate-500 mt-1">Credits are awarded after an administrator approves your resolution proof. High priority pays 50 credits, Medium pays 30, and Low pays 20.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">What happens if my proof is rejected?</h4>
                <p className="text-[11px] text-slate-500 mt-1">If rejected, the task returns to "In Progress" in your list. You can re-visit the location, fix any issues, and submit a new After photo proof.</p>
              </div>
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

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); if (window.innerWidth < 1024) setSidebarOpen(false); }}
          onLogout={onLogout}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <Header
          user={user}
          location={location}
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(o => !o)}
          onNotificationClick={() => setActiveTab('Notifications')}
        />
        
        <main className="px-4 sm:px-6 md:px-8 pb-8 space-y-6">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          {/* Render Active View */}
          <div className="mt-6">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
}