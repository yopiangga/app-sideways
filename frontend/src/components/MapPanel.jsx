import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { Ship, Plane, Eye, EyeOff } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapPanel = () => {
  const [ships, setShips] = useState([]);
  const [showAIS, setShowAIS] = useState(true);
  const [loading, setLoading] = useState(true);

  const center = [-6.2088, 106.8456]; // Jakarta

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ais`);
        setShips(response.data);
      } catch (err) {
        console.error("Failed to fetch map data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const createIcon = (IconComponent, color) => {
    const iconMarkup = renderToStaticMarkup(
      <div style={{ color, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
        <IconComponent size={24} strokeWidth={2.5} />
      </div>
    );
    return L.divIcon({
      html: iconMarkup,
      className: 'custom-map-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden border border-border relative">
      {/* Map Control Overlay */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        <div className="bg-panel/90 backdrop-blur-md p-3 rounded-xl border border-border shadow-2xl flex flex-col space-y-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Radar Filters</div>
          
          <button 
            onClick={() => setShowAIS(!showAIS)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
              showAIS ? 'bg-accent-primary/20 text-accent-primary' : 'bg-white/5 text-slate-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Ship size={16} />
              <span className="text-xs font-bold uppercase">AIS RADAR</span>
            </div>
            {showAIS ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
      </div>

      <MapContainer center={center} zoom={10} scrollWheelZoom={true} className="flex-1">
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {showAIS && ships.map((ship, idx) => (
          <Marker 
            key={`ship-${idx}`} 
            position={[ship.lat, ship.lng]}
            icon={createIcon(Ship, '#3b82f6')}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-bold border-b border-border pb-1 mb-1">{ship.name}</p>
                <p>MMSI: {ship.mmsi}</p>
                <p>Type: {ship.type}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Flights disabled */}
      </MapContainer>
    </div>
  );
};

export default MapPanel;
