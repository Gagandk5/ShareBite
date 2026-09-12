import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Donation } from '../types';
import { Link } from 'react-router-dom';
import { MapPin, Users, Clock } from 'lucide-react';

const foodIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LeafletMapProps {
  donations: Donation[];
  center?: [number, number];
  zoom?: number;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  donations,
  center = [12.9716, 77.5946], // Default center set to Bengaluru, India
  zoom = 12
}) => {
  const [mapType, setMapType] = useState<'m' | 's' | 'y'>('m'); // m = Roadmap, s = Satellite, y = Hybrid

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
      
      {/* Google Maps Layer Controls */}
      <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-1 text-[11px] font-bold">
        <span className="text-slate-500 mr-1 text-[10px] uppercase tracking-wider">Google Maps:</span>
        <button
          onClick={() => setMapType('m')}
          className={`px-2 py-0.5 rounded-md transition ${mapType === 'm' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          Map
        </button>
        <button
          onClick={() => setMapType('y')}
          className={`px-2 py-0.5 rounded-md transition ${mapType === 'y' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          Satellite
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          key={mapType}
          attribution="&copy; Google Maps"
          url={`https://{s}.google.com/vt/lyrs=${mapType}&x={x}&y={y}&z={z}`}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />
        {donations.map((d) => (
          <Marker
            key={d.id}
            position={[d.latitude, d.longitude]}
            icon={foodIcon}
          >
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-1 space-y-2 max-w-xs">
                <img
                  src={d.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                  alt={d.foodName}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{d.foodName}</h4>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Users className="w-3 h-3" /> {d.servings} Servings
                  </span>
                  {d.distance !== undefined && (
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <MapPin className="w-3 h-3 text-rose-500" /> {d.distance} km away
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>Expiry: {new Date(d.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <Link
                  to={`/donations/${d.id}`}
                  className="block w-full text-center py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
                >
                  View Details & Request
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
