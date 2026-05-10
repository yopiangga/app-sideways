import React, { useState, useEffect } from 'react';
import { Bell, Search, Globe, User, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Topbar = () => {
  const [time, setTime] = useState(new Date());
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Admin';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 border-b border-border bg-panel/50 backdrop-blur-md flex items-center justify-between px-8 z-20">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 mr-4">
          <Link 
            to="/dashboard"
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-tight ${
              location.pathname === '/dashboard' 
                ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/surveillance"
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-tight ${
              location.pathname === '/surveillance' 
                ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Matrix</span>
          </Link>
          <a 
            href="https://www.worldmonitor.app/?lat=20.0000&lon=0.0000&zoom=1.00&view=global&timeRange=7d&layers=conflicts%2Cbases%2Chotspots%2Cnuclear%2Csanctions%2Cweather%2Ceconomic%2Cwaterways%2Coutages%2Cmilitary%2Cnatural%2CiranAttacks"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-tight text-slate-500 hover:text-accent-secondary hover:bg-accent-secondary/10 border border-transparent hover:border-accent-secondary/20"
          >
            <Globe size={14} />
            <span>World Monitor</span>
          </a>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-background px-3 py-1.5 rounded-full border border-border hidden xl:block">
          GPS: 0.7892° S, 113.9213° E
        </div>
        <div className="text-xs font-mono text-accent-primary animate-pulse-soft hidden md:block">
          SYSTEM STATUS: OPTIMAL
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right mr-4 hidden md:block">
          <div className="text-sm font-bold text-white uppercase tracking-tight">
            {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {time.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>

        <div className="flex items-center space-x-2 border-l border-border pl-6">
          <div className="flex flex-col items-end mr-3">
            <span className="text-xs font-bold text-white uppercase">{username}</span>
            <span className="text-[10px] text-accent-secondary">SYSTEM OPERATOR</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center overflow-hidden">
            <User size={20} className="text-accent-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
