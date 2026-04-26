import React from 'react';
import {
  LayoutDashboard,
  Video,
  Newspaper,
  Ship,
  Plane,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: Video, label: 'CCTV Feeds' },
    { icon: Newspaper, label: 'Intelligence' },
    { icon: Ship, label: 'Maritime' },
    { icon: Plane, label: 'Aviation' },
    { icon: Settings, label: 'System' },
  ];

  return (
    <div className="w-64 bg-panel border-r border-border flex flex-col h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-wider">MONITOR</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${item.active
                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-accent-danger hover:bg-accent-danger/5 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
