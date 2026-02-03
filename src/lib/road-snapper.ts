export interface SnappedLocation {
  lat: number;
  lng: number;
  roadName?: string;
  distance: number;
}

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const SEARCH_RADIUS_METERS = 200;

export async function snapToNearestRoad(
  lat: number,
  lng: number,
  radiusMeters: number = SEARCH_RADIUS_METERS
): Promise<SnappedLocation> {
  try {
    const radiusDegrees = radiusMeters / 111000;

    const query = `
      [bbox:${lat - radiusDegrees},${lng - radiusDegrees},${lat + radiusDegrees},${lng + radiusDegrees}];
      (
        way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|living_street|unclassified|service|walkway|path|footway|track)$"];
        way["footway"];
        way["pedestrian"];
      );
      out center;
    `;

    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'application/osm3s' },
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      return { lat, lng, distance: 0, roadName: 'No roads found' };
    }

    let closestPoint = { lat, lng, distance: Infinity, roadName: undefined as string | undefined };

    for (const element of data.elements) {
      if (element.center) {
        const dist = calculateDistance(lat, lng, element.center.lat, element.center.lon);
        if (dist < closestPoint.distance) {
          closestPoint = {
            lat: element.center.lat,
            lng: element.center.lon,
            distance: dist,
            roadName: element.tags?.name,
          };
        }
      }
    }

    return closestPoint;
  } catch (error) {
    console.warn('Road snapping failed, using original coordinates:', error);
    return { lat, lng, distance: 0 };
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
