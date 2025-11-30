import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ChevronRight } from 'lucide-react';

const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapSelector({ onLocationSelect }: MapSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation[0], selectedLocation[1]);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        {selectedLocation && (
          <Marker position={selectedLocation} icon={defaultIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold mb-1">Selected Location</p>
                <p>Lat: {selectedLocation[0].toFixed(4)}</p>
                <p>Lng: {selectedLocation[1].toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-400 rounded-full opacity-50"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none">
        <h2 className="text-white text-2xl font-bold">Select Starting Location</h2>
        <p className="text-gray-300 text-sm mt-2">Click on the map to choose where to begin</p>
      </div>

      {selectedLocation && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent p-6 pointer-events-auto">
          <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
            <p className="text-gray-300 text-sm mb-2">Selected Coordinates:</p>
            <p className="text-white font-mono text-lg">
              {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
            </p>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Continue to Game
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
