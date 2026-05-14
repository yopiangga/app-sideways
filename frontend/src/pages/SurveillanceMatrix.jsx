import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Wifi, 
  AlertCircle, 
  LayoutGrid, 
  Tv, 
  ShieldAlert,
  Activity
} from 'lucide-react';
import Topbar from '../components/Topbar';

const SurveillanceMatrix = () => {
  const [streams, setStreams] = useState([]);
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [gridCols, setGridCols] = useState(3);
  const [regionFilter, setRegionFilter] = useState('All');

  useEffect(() => {
    fetchStreams();
  }, []);

  useEffect(() => {
    if (regionFilter === 'All') {
      setFilteredStreams(streams);
    } else {
      setFilteredStreams(streams.filter(s => s.region === regionFilter));
    }
  }, [regionFilter, streams]);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tv-streams`);
      setStreams(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching TV streams:', err);
      setError('Failed to connect to surveillance matrix backend.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = (stream) => {
    if (selectedStream?.id === stream.id) {
      setSelectedStream(null);
    } else {
      setSelectedStream(stream);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-slate-200">
      <Topbar />
      
      <main className="flex-1 p-6 flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent-primary/20 rounded-xl border border-accent-primary/40">
              <ShieldAlert className="text-accent-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Surveillance Matrix</h1>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse"></span>
                  <span>SYSTEM_ONLINE</span>
                </span>
                <span>•</span>
                <span>DEDICATED_MEDIA_LIVE_INDO</span>
                <span>•</span>
                <span>NODES: {streams.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-panel border border-border rounded-lg p-1 mr-2">
              {['All', 'Indonesia', 'International'].map((region) => (
                <button
                  key={region}
                  onClick={() => setRegionFilter(region)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    regionFilter === region ? 'bg-accent-primary/20 text-accent-primary' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="flex bg-panel border border-border rounded-lg p-1">
              {[2, 3, 4].map((cols) => (
                <button
                  key={cols}
                  onClick={() => setGridCols(cols)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    gridCols === cols ? 'bg-accent-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {cols}x{cols === 4 ? 2 : 2}
                </button>
              ))}
            </div>
            <button 
              onClick={fetchStreams}
              className="p-2.5 bg-panel border border-border rounded-lg text-slate-400 hover:text-accent-primary hover:border-accent-primary/40 transition-all"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Matrix Grid */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
              <p className="text-sm font-mono text-slate-500 animate-pulse">INITIALIZING_MATRIX_STREAM...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="glass-panel p-8 rounded-2xl border-accent-danger/20 flex flex-col items-center space-y-4 max-w-md text-center">
              <AlertCircle className="text-accent-danger w-12 h-12" />
              <h2 className="text-lg font-bold text-white">CONNECTION_ERROR</h2>
              <p className="text-slate-400 text-sm">{error}</p>
              <button 
                onClick={fetchStreams}
                className="px-6 py-2 bg-accent-danger/20 border border-accent-danger/40 text-accent-danger rounded-lg hover:bg-accent-danger/30 transition-all text-sm font-bold"
              >
                RETRY_CONNECTION
              </button>
            </div>
          </div>
        ) : (
          <div 
            className={`grid gap-4 flex-1 transition-all duration-500 ${
              gridCols === 2 ? 'grid-cols-2' : gridCols === 3 ? 'grid-cols-3' : 'grid-cols-4'
            }`}
          >
            {filteredStreams.map((stream) => (
              <motion.div
                key={stream.id}
                layoutId={stream.id}
                className="relative group glass-panel rounded-xl overflow-hidden border border-border hover:border-accent-primary/40 transition-all duration-300 neon-border"
              >
                {/* Header Info */}
                <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-accent-danger rounded text-[10px] font-bold text-white animate-pulse">
                      <Wifi size={10} />
                      <span>LIVE</span>
                    </div>
                    <div className="px-2 py-0.5 bg-panel border border-border rounded text-[10px] font-mono text-slate-400">
                      {stream.region.toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider truncate max-w-[120px]">
                      {stream.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleFullscreen(stream)}
                    className="p-1.5 bg-black/40 hover:bg-accent-primary/20 rounded transition-all text-slate-300 hover:text-white"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>

                {/* Video Content */}
                <div className="aspect-video bg-black relative">
                  <iframe
                    className="w-full h-full border-none"
                    src={stream.embedUrl}
                    title={stream.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Footer Status */}
                <div className="p-3 flex items-center justify-between bg-panel/30 border-t border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-mono leading-none mb-1">NODE_ID</span>
                      <span className="text-[10px] text-accent-primary font-mono leading-none font-bold">{stream.id.toUpperCase()}</span>
                    </div>
                    <div className="h-6 w-px bg-border/50"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-mono leading-none mb-1">BITRATE</span>
                      <span className="text-[10px] text-slate-300 font-mono leading-none">{(Math.random() * 5 + 3).toFixed(1)} Mbps</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Activity size={12} className="text-accent-secondary" />
                    <span className="text-[10px] font-mono text-slate-500">{(Math.random() * 100).toFixed(0)}ms</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen Modal Overlay */}
      <AnimatePresence>
        {selectedStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-border">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-accent-primary/20 rounded-lg flex items-center justify-center border border-accent-primary/40">
                  <Tv className="text-accent-primary w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase">{selectedStream.name}</h2>
                  <p className="text-xs font-mono text-slate-400">SURVEILLANCE_NODE_{selectedStream.id.toUpperCase()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStream(null)}
                className="p-3 bg-panel border border-border rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                <Minimize2 size={24} />
              </button>
            </div>
            
            <div className="flex-1 p-6 relative flex items-center justify-center">
              <div className="w-full h-full max-w-6xl aspect-video glass-panel rounded-2xl overflow-hidden border border-accent-primary/20 shadow-2xl shadow-accent-primary/10">
                <iframe
                  className="w-full h-full border-none"
                  src={selectedStream.embedUrl.replace('mute=1', 'mute=0')}
                  title={selectedStream.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Telemetry Panel */}
              <div className="absolute right-12 top-12 bottom-12 w-64 glass-panel border-l border-border p-6 flex flex-col space-y-6 hidden xl:flex">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-border pb-2">Stream Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono">CHANNEL_ID</p>
                      <p className="text-xs font-mono text-accent-primary">{selectedStream.channelId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono">LOCATION</p>
                      <p className="text-xs text-white">{selectedStream.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono">STATUS</p>
                      <p className="text-xs text-accent-secondary flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary"></span>
                        <span>ACTIVE_BROADCAST</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-border pb-2">Network Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono">LATENCY</p>
                      <p className="text-xs font-mono text-white">42ms</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono">PACKET_LOSS</p>
                      <p className="text-xs font-mono text-white">0.00%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-border">
                  <div className="flex items-center space-x-2 p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-lg">
                    <ShieldAlert size={16} className="text-accent-primary" />
                    <span className="text-[10px] text-accent-primary font-bold">SECURE_FEED</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Matrix Footer */}
      <div className="h-10 bg-panel border-t border-border px-8 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 text-accent-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary"></span>
            <span>MATRIX_SUBSYSTEM_ACTIVE</span>
          </span>
          <span>SRV_PORT: 5001</span>
          <span>PROTOCOL: HTTPS/WSS</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>UPTIME: 142:59:12</span>
          <span>BUFFER_SIZE: 1024KB</span>
        </div>
      </div>
    </div>
  );
};

export default SurveillanceMatrix;
