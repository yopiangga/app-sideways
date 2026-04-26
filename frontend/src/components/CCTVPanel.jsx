import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Maximize2, Filter, Grid } from 'lucide-react';

const CCTVPanel = () => {
  const [cameras, setCameras] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArea, setActiveArea] = useState('All');
  const [areas, setAreas] = useState(['All']);

  useEffect(() => {
    const fetchCCTV = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/cctv');
        setCameras(response.data);
        setFilteredCameras(response.data);
        
        // Extract unique areas
        const uniqueAreas = ['All', ...new Set(response.data.map(cam => cam.area).filter(Boolean))];
        setAreas(uniqueAreas);
      } catch (err) {
        console.error("Failed to fetch CCTV", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCCTV();
  }, []);

  const filterByArea = (area) => {
    setActiveArea(area);
    if (area === 'All') {
      setFilteredCameras(cameras);
    } else {
      setFilteredCameras(cameras.filter(cam => cam.area === area));
    }
  };

  return (
    <div className="flex flex-col glass-panel rounded-xl overflow-hidden border border-border">
      {/* CCTV Header with Filter */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-border shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-accent-primary">
            <Grid size={18} />
            <span className="text-sm font-bold uppercase tracking-widest text-slate-200">Surveillance Matrix</span>
          </div>
          
          <div className="h-6 w-[1px] bg-border mx-2"></div>
          
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {areas.map(area => (
              <button
                key={area}
                onClick={() => filterByArea(area)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                  activeArea === area 
                    ? 'bg-accent-primary text-white' 
                    : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
          <span className="animate-pulse w-2 h-2 rounded-full bg-accent-secondary"></span>
          <span>{filteredCameras.length} STREAMS FILTERED</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="aspect-video bg-white/5 animate-pulse rounded-xl border border-border"></div>
            ))
          ) : (
            filteredCameras.map(cam => (
              <div key={cam.id} className="group relative flex flex-col bg-background rounded-xl overflow-hidden border border-border hover:border-accent-primary/40 transition-all shadow-lg">
                <div className="aspect-video relative overflow-hidden bg-black">
                  <iframe
                    src={`${cam.url}${cam.url.includes('?') ? '&' : '?'}autoplay=1&mute=1`}
                    className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  
                  {/* Overlay Info */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <div className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[8px] font-mono text-white">
                      CH_{cam.id.toString().padStart(3, '0')}
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      cam.area === 'Maritime' ? 'bg-blue-500/20 text-blue-400' :
                      cam.area === 'Aviation' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {cam.area}
                    </div>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white uppercase">{cam.name}</span>
                        <Maximize2 size={12} className="text-white/60 hover:text-accent-primary cursor-pointer" />
                     </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 flex items-center justify-between bg-panel/30">
                  <span className="text-[10px] text-slate-400 font-medium truncate">{cam.location}</span>
                  <span className="text-[9px] text-slate-500 font-mono">LIVE_FEED</span>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredCameras.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 py-20">
            <Filter size={48} className="opacity-20" />
            <p className="text-sm font-medium">No cameras found in this area</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CCTVPanel;
