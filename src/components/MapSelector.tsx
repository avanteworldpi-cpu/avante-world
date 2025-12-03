interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export function MapSelector({ onLocationSelect }: MapSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500"
        onClick={() => onLocationSelect(0, 0)}
      >
        Start at Default Location
      </button>
    </div>
  );
}
