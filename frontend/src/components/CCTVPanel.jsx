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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cctv-dki`);
        const data = response.data.map(cam => ({
          id: cam.id,
          name: cam.cctv_name,
          location: cam.site_name,
          url: cam.link_embed,
          area: cam.group || 'Umum',
          kota: cam.kota_name
        }));
        
        setCameras(data);
        
        // Extract unique areas
        const uniqueAreas = [...new Set(data.map(cam => cam.area))];
        setAreas(uniqueAreas);
        
        if (uniqueAreas.length > 0) {
          const defaultArea = uniqueAreas[0];
          setActiveArea(defaultArea);
          setFilteredCameras(data.filter(cam => cam.area === defaultArea).slice(0, 50)); // Limit to 50 for performance
        }
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
    setFilteredCameras(cameras.filter(cam => cam.area === area).slice(0, 50));
  };

  return (
    <div className="flex flex-col glass-panel rounded-xl overflow-hidden border border-border">
      {/* CCTV Header with Filter */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-border shrink-0">
        <div className="flex items-center space-x-4 max-w-full overflow-hidden">
          <div className="flex items-center space-x-2 text-accent-primary shrink-0">
            <Grid size={18} />
            <span className="text-sm font-bold uppercase tracking-widest text-slate-200">Jakarta Surveillance</span>
          </div>
          
          <div className="h-6 w-[1px] bg-border mx-2 shrink-0"></div>
          
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {areas.map(area => (
              <button
                key={area}
                onClick={() => filterByArea(area)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
                  activeArea === area 
                    ? 'bg-accent-primary text-white border-accent-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                    : 'bg-white/5 text-slate-500 border-border/50 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 shrink-0 ml-4">
          <span className="animate-pulse w-2 h-2 rounded-full bg-accent-secondary"></span>
          <span>{filteredCameras.length} CHANNELS LIVE</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {loading ? (
            Array(8).fill(0).map((_, idx) => (
              <div key={idx} className="aspect-video bg-white/5 animate-pulse rounded-xl border border-border"></div>
            ))
          ) : (
            filteredCameras.map(cam => (
              <div key={cam.id} className="group relative flex flex-col bg-background rounded-xl overflow-hidden border border-border hover:border-accent-primary/40 transition-all shadow-lg">
                <div className="aspect-video relative overflow-hidden bg-black">
                  <iframe
                    src={cam.url}
                    className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={cam.name}
                  ></iframe>
                  
                  {/* Overlay Info */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <div className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[8px] font-mono text-white">
                      {cam.kota?.toUpperCase()}
                    </div>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col space-y-1">
                        <span className="text-[11px] font-bold text-white uppercase line-clamp-1">{cam.name}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-mono">{cam.location}</span>
                          <Maximize2 size={12} className="text-white/60 hover:text-accent-primary cursor-pointer" />
                        </div>
                      </div>
                  </div>
                </div>
                
                <div className="px-4 py-2.5 flex items-center justify-between bg-panel/40">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse"></div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter">Live Stream Signal</span>
                  </div>
                  <span className="text-[8px] text-slate-600 font-mono">SECURE_LINK</span>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredCameras.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 py-20">
            <Filter size={48} className="opacity-20" />
            <p className="text-sm font-medium uppercase tracking-widest">No active feeds in this sector</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CCTVPanel;
