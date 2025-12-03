import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export function MapSelector({ onLocationSelect }: MapSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([40.7128, -74.006], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([40.7128, -74.006], {
      icon: L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIGZpbGw9IiMzQjgyRjYiIHJ4PSI0Ii8+PGNpcmNsZSBjeD0iMTYiIGN5PSIxMiIgcj0iNiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMTYgMjBDMTMuNzkgMjAgMTIgMjEuNzkgMTIgMjRDMTIgMjcuMzEgMTYgMzIgMTYgMzJDMTYgMzIgMjAgMjcuMzEgMjAgMjRDMjAgMjEuNzkgMTguMjEgMjAgMTYgMjBaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
        iconSize: [32, 48],
        iconAnchor: [16, 48],
        popupAnchor: [0, -48],
      }),
    })
      .addTo(map)
      .bindPopup('Starting Location');

    markerRef.current = marker;
    mapRef.current = map;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, []);

  const handleStart = () => {
    if (markerRef.current) {
      const latLng = markerRef.current.getLatLng();
      onLocationSelect(latLng.lat, latLng.lng);
    }
  };

  return (
    <div className="w-full h-screen relative">
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute top-6 left-6 z-50 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">Select Starting Location</h2>
            <p className="text-sm text-gray-600 mb-3">Click on the map to set your starting position</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="absolute bottom-6 right-6 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
      >
        Start Adventure
      </button>
    </div>
  );
}
