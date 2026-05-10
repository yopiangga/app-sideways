import React from 'react';
import Topbar from '../components/Topbar';
import MapPanel from '../components/MapPanel';
import CCTVPanel from '../components/CCTVPanel';
import NewsPanel from '../components/NewsPanel';
import TrendsPanel from '../components/TrendsPanel';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-slate-200 overflow-y-auto">
      {/* No Sidebar - Full width content */}
      <Topbar />
      
      <main className="flex-1 p-6 flex flex-col space-y-6">
        {/* Top Section: Map */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-[500px] shrink-0"
        >
          <MapPanel />
        </motion.div>

        {/* Intelligence Insights: Trends & Regional (Vertical Flow) */}
        <div className="flex flex-col space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <TrendsPanel />
          </motion.div>
        </div>

        {/* News Section (Below Insights) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <NewsPanel />
        </motion.div>

        {/* CCTV Section (Bottom) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <CCTVPanel />
        </motion.div>
      </main>

      {/* System Footer Bar */}
      <div className="h-8 bg-panel border-t border-border px-6 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse"></span>
            <span>SECURE_LINK_ESTABLISHED</span>
          </span>
          <span>SRV_5001_ACTIVE</span>
          <span>GPS_LOCK: TRUE</span>
        </div>
        <div>SESSION_TOKEN: {localStorage.getItem('token')?.substring(0, 12)}...</div>
      </div>
    </div>
  );
};

export default Dashboard;
