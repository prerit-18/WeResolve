import { useState, useEffect } from 'react';
import { authApi } from './api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const fetchUser = async () => {
    try {
      const u = await authApi.getMe();
      if (u.role !== 'solver') {
        throw new Error('Access denied. Solver role required.');
      }
      setUser(u);
    } catch (err) {
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
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshTrigger]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">
        Loading WeResolve Solver Portal...
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={fetchUser} />;
  }

  return (
    <Dashboard 
      user={user} 
      onLogout={handleLogout} 
      refreshTrigger={refreshTrigger}
      triggerRefresh={triggerRefresh}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
}

export default App;
