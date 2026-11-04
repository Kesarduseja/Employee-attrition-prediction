import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  BrainCircuit,
  Activity,
  History,
  Info,
  LogOut,
  User,
  ShieldCheck,
  AlertCircle,
  Menu,
  X,
  Sparkles,
  Database
} from 'lucide-react';
import { authService, healthService } from '../services/api';

const navItems = [
  { path: '/', label: 'Main Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Employee Analytics', icon: BarChart3 },
  { path: '/predict', label: 'Attrition Prediction', icon: BrainCircuit, badge: 'ML Live' },
  { path: '/models', label: 'Model Performance', icon: Activity },
  { path: '/history', label: 'Prediction History', icon: History },
  { path: '/about', label: 'About Project', icon: Info },
];

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'healthy' | 'error' | 'checking'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const res = await healthService.checkHealth();
      if (res.status === 'healthy') {
        setBackendStatus('healthy');
      } else {
        setBackendStatus('warning');
      }
    } catch {
      setBackendStatus('error');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getCurrentTitle = () => {
    const item = navItems.find((n) => n.path === location.pathname);
    return item ? item.label : 'HR Insight';
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0B132B] text-slate-200 border-r border-slate-800 shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 bg-[#070D1E]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">HR Insight</span>
              <span className="block text-[10px] text-teal-400 font-medium uppercase tracking-wider">
                DMBI Intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Analytics & Decision Suite
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* System & DB Status Card */}
        <div className="p-3 mx-3 mb-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-slate-300 font-medium">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>SQLite & ML Engine</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === 'healthy'
                    ? 'bg-teal-400 animate-pulse'
                    : backendStatus === 'checking'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
              />
              <span
                className={`text-[10px] font-semibold uppercase ${
                  backendStatus === 'healthy'
                    ? 'text-teal-400'
                    : backendStatus === 'checking'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {backendStatus === 'healthy' ? 'Active' : backendStatus === 'checking' ? 'Connecting' : 'Offline'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            1,470 IBM HR records loaded. Random Forest & Decision Tree ready.
          </p>
        </div>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-slate-800 bg-[#070D1E] flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0 font-semibold text-xs">
              {user?.username ? user.username[0].toUpperCase() : 'H'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'HR Analyst'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.role || 'People Operations'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out of HR session"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between z-10 sticky top-0 shadow-xs">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">{getCurrentTitle()}</h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Predictive Workforce Retention & Data-Driven HR Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Academic Decision Support System</span>
            </div>
            <button
              onClick={() => navigate('/predict')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs shadow-sm shadow-sky-600/30 transition"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Predict Attrition</span>
            </button>
          </div>
        </header>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B132B] text-slate-200 border-b border-slate-800 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${
                      isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
