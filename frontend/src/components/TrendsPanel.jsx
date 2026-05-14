import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Loader2, RefreshCw, AlertCircle, Info } from 'lucide-react';

const TrendsPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news-trends`);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching news trends:', err);
      setError('Failed to fetch intelligence insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="glass-panel rounded-2xl border border-border overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between bg-panel/30">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-accent-primary/20 rounded-lg">
            <TrendingUp size={16} className="text-accent-primary" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Intelligence Insights</h3>
        </div>
        <button 
          onClick={fetchTrends}
          className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-3 py-12">
            <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
            <p className="text-xs font-mono text-slate-500 animate-pulse uppercase">Analyzing_Global_Trends...</p>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center space-y-3 py-12 text-center">
            <AlertCircle className="w-8 h-8 text-accent-danger" />
            <p className="text-xs text-slate-400 px-4">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Top Trending Topics */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-background/50 px-2 py-1 rounded border border-border">Trending Topics</span>
                <div className="h-px flex-1 bg-border/50"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-3">
                {data.trends?.slice(0, 5).map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="group bg-panel/40 border border-border/30 rounded-xl p-4 hover:border-accent-primary/30 transition-all hover:bg-panel/60"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded bg-accent-primary/20 flex items-center justify-center text-[10px] font-bold text-accent-primary border border-accent-primary/20">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white uppercase tracking-tight">{item.topic}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic border-l-2 border-accent-primary/20 pl-3 ml-2">
                      {item.insight}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Regional Breakdown */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-background/50 px-2 py-1 rounded border border-border">Regional Intelligence</span>
                <div className="h-px flex-1 bg-border/50"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.regionalInsights?.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    key={idx}
                    className="flex flex-col space-y-2 p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/10 hover:border-accent-primary/30 transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-accent-secondary" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight">{item.region}</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {item.insight}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <div className="p-3 bg-panel/50 border-t border-border flex items-center justify-center">
        <div className="flex items-center space-x-2 text-[9px] font-mono text-slate-500 uppercase">
          <Info size={10} />
          <span>AI_GENERATED_INTELLIGENCE_LAYER</span>
        </div>
      </div>
    </div>
  );
};

export default TrendsPanel;
