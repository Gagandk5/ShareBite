import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Donation } from '../types';
import { Link } from 'react-router-dom';
import { MapPin, Users, Clock } from 'lucide-react';

// Custom Leaflet marker icons
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
  center = [40.73061, -73.935242],
  zoom = 12
}) => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
