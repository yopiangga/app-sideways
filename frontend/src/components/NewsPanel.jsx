import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Terminal, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NewsPanel = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('top');

  const categories = [
    { id: 'top', label: 'Top News' },
    { id: 'politik', label: 'Politik' },
    { id: 'ekonomi', label: 'Ekonomi' },
    { id: 'militer', label: 'Militer' },
    { id: 'keamanan', label: 'Keamanan' },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news?category=${category}`);
        setNews(response.data);
      } catch (err) {
        console.error("Failed to fetch News", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [category]);

  return (
    <div className="flex flex-col bg-background/50 border border-border rounded-xl font-mono overflow-hidden">
      {/* Intelligence Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-accent-danger/10 border-b border-accent-danger/20">
        <div className="flex items-center space-x-2 text-accent-danger">
          <ShieldAlert size={16} />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Live Intelligence Log</span>
        </div>
        <div className="flex items-center space-x-2">
          <Radio size={14} className="text-accent-danger animate-pulse" />
          <span className="text-[9px] text-accent-danger/60">ENCRYPTED_STREAM</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-1 px-4 py-2 bg-black/20 border-b border-border overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded border transition-all whitespace-nowrap ${category === cat.id
              ? 'bg-accent-danger text-black border-accent-danger'
              : 'bg-transparent text-slate-500 border-slate-800 hover:border-slate-600'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/40 custom-scrollbar min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {Array(5).fill(0).map((_, idx) => (
                <div key={idx} className="space-y-2 opacity-20">
                  <div className="h-3 bg-slate-500 rounded w-1/3"></div>
                  <div className="h-10 bg-slate-500 rounded w-full"></div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
            >
              {news.length > 0 ? (
                news.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative bg-panel/40 border border-border/50 rounded-xl overflow-hidden hover:border-accent-danger/40 transition-all flex flex-col"
                  >
                    {/* Card Thumbnail */}
                    <div className="h-32 shrink-0 bg-black relative overflow-hidden">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent-danger/5">
                          <Radio size={24} className="text-accent-danger/20" />
                        </div>
                      )}

                      {/* Source Badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-accent-danger/30 rounded text-[8px] font-bold text-accent-danger uppercase tracking-tighter">
                        {item.source?.name || 'UNKNOWN'}
                      </div>

                      {/* Time Badge */}
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[8px] font-mono text-slate-400">
                        {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-slate-200 leading-relaxed group-hover:text-white transition-colors cursor-pointer line-clamp-3 mb-4"
                      >
                        {item.title}
                      </a>
                    </div>

                    {/* Animated Border Reveal on Hover */}
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-danger transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-[10px] text-slate-600 text-center py-20 uppercase tracking-widest bg-panel/20 rounded-xl border border-dashed border-border">
                  No intelligence data available for this sector
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Footer */}
      <div className="p-3 bg-black/60 border-t border-border flex items-center space-x-2 text-slate-600 text-[10px]">
        <Terminal size={12} />
        <span className="animate-pulse">_</span>
        <span className="flex-1 truncate">intercepting packets from {category.toUpperCase()}_STREAM...</span>
      </div>
    </div>
  );
};

export default NewsPanel;
