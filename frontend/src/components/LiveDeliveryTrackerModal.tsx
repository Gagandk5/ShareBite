import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
  X,
  Truck,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  Zap,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { useToast } from '../contexts/ToastContext';

// Custom Leaflet Markers
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const courierIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -40],
  shadowSize: [45, 45]
});

export interface TelemetryData {
  deliveryId: string;
  donorLat: number;
  donorLng: number;
  recipientLat: number;
  recipientLng: number;
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  etaMinutes: number;
  updatedAt: string;
  status: string;
  volunteerName: string;
}

interface LiveDeliveryTrackerModalProps {
  deliveryId: string;
  donationName?: string;
  onClose: () => void;
}

export const LiveDeliveryTrackerModal: React.FC<LiveDeliveryTrackerModalProps> = ({
  deliveryId,
  donationName = 'Food Donation Parcel',
  onClose
}) => {
  const { showToast } = useToast();
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulatedProgress, setSimulatedProgress] = useState(0.2); // 0 (Donor) to 1 (Recipient)
  const [mapType, setMapType] = useState<'m' | 'y'>('m'); // m = Google Roadmap, y = Google Satellite

  // Polling backend live-track endpoint
  const fetchTelemetry = async () => {
    try {
      const data = await apiFetch<TelemetryData>(`/deliveries/${deliveryId}/live-track`);
      setTelemetry(data);
    } catch (err) {
      console.error('Failed to fetch live delivery telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000); // 3 sec live polling
    return () => clearInterval(interval);
  }, [deliveryId]);

  // Smooth local GPS tick simulation for Blinkit/Flipkart Minutes style real-time movement
  useEffect(() => {
    const simInterval = setInterval(() => {
      setSimulatedProgress((prev) => {
        const next = prev + 0.012;
        return next > 0.95 ? 0.95 : next;
      });
    }, 1500);

    return () => clearInterval(simInterval);
  }, []);

  if (loading && !telemetry) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-3xl text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Connecting to Live GPS Stream...</p>
        </div>
      </div>
    );
  }

  const donorLat = telemetry?.donorLat || 28.6139;
  const donorLng = telemetry?.donorLng || 77.209;
  const recipientLat = telemetry?.recipientLat || donorLat + 0.025;
  const recipientLng = telemetry?.recipientLng || donorLng + 0.025;

  // Calculate simulated courier position along path
  const courierLat = donorLat + (recipientLat - donorLat) * simulatedProgress;
  const courierLng = donorLng + (recipientLng - donorLng) * simulatedProgress;

  const centerLat = (donorLat + recipientLat) / 2;
  const centerLng = (donorLng + recipientLng) / 2;

  const etaMinutes = Math.max(2, Math.round((1 - simulatedProgress) * 15));
  const distanceRemaining = Math.max(0.2, Math.round((1 - simulatedProgress) * 4.5 * 10) / 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-inner">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">{donationName}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-emerald-400" /> Live GPS Active
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Blinkit / Minutes Express Tracking</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Map View */}
        <div className="relative w-full h-[320px] sm:h-[400px] bg-slate-100">
          
          {/* Google Maps Layer Mode Switcher */}
          <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-1 text-[11px] font-bold">
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
            center={[centerLat, centerLng]}
            zoom={13}
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

            {/* Donor / Pickup Point */}
            <Marker position={[donorLat, donorLng]} icon={pickupIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <span className="font-extrabold text-emerald-700 block">🟢 Donor Pickup Location</span>
                  <span className="text-slate-600">Surplus Food Ready</span>
                </div>
              </Popup>
            </Marker>

            {/* Recipient / Dropoff Point */}
            <Marker position={[recipientLat, recipientLng]} icon={dropoffIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <span className="font-extrabold text-rose-700 block">🔴 Recipient Destination</span>
                  <span className="text-slate-600">Shelter / Community Center</span>
                </div>
              </Popup>
            </Marker>

            {/* Live Volunteer Rider */}
            <Marker position={[courierLat, courierLng]} icon={courierIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <span className="font-extrabold text-purple-700 block">🛵 {telemetry?.volunteerName || 'Volunteer Courier'}</span>
                  <span className="text-slate-600">On the move (~{telemetry?.speedKmH || 24} km/h)</span>
                </div>
              </Popup>
            </Marker>

            {/* Route Polyline Path */}
            <Polyline
              positions={[
                [donorLat, donorLng],
                [courierLat, courierLng],
                [recipientLat, recipientLng]
              ]}
              color="#059669"
              weight={4}
              dashArray="6, 8"
            />
          </MapContainer>

          {/* Floating ETA Badge */}
          <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              {etaMinutes}m
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">ESTIMATED ARRIVAL</span>
              <span className="text-xs font-bold text-emerald-300">Arriving in ~{etaMinutes} mins ({distanceRemaining} km)</span>
            </div>
          </div>
        </div>

        {/* Telemetry Dashboard Footer Card */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
          
          {/* Status Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Navigation className="w-3.5 h-3.5 animate-spin" />
                <span>Status: {simulatedProgress < 0.4 ? 'Heading to Pickup Point' : simulatedProgress < 0.85 ? 'Food Collected — En Route to Dropoff' : 'Arriving at Destination'}</span>
              </span>
              <span className="text-slate-500 font-medium">{Math.round(simulatedProgress * 100)}% Complete</span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 rounded-full"
                style={{ width: `${Math.round(simulatedProgress * 100)}%` }}
              />
            </div>
          </div>

          {/* Courier Telemetry Info & Contact Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                {telemetry?.volunteerName.charAt(0) || 'V'}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{telemetry?.volunteerName || 'Volunteer Courier'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Verified ShareBite Delivery Partner • 24 km/h</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Calling courier...', 'info')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Courier</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
