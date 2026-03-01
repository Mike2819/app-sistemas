// frontend/src/utils/geofence.ts

export interface Coordinate {
  lat: number;
  lng: number;
}

// Coordenadas reales del perímetro de la UPA (GeoJSON)
export const CAMPUS_POLYGON: Coordinate[] = [
  { lat: 21.808823505192663, lng: -102.29783134398149 },
  { lat: 21.804248097562677, lng: -102.29794139949267 },
  { lat: 21.80587164603537,  lng: -102.29380820363279 },
  { lat: 21.80838073019811,  lng: -102.29482316001274 },
];

/**
 * Algoritmo Ray Casting para determinar si un punto está dentro de un polígono.
 */
export const isLocationInsideCampus = (point: Coordinate, polygon: Coordinate[]): boolean => {
  let isInside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;

    // Condición matemática de intersección
    const intersect = ((yi > point.lng) !== (yj > point.lng)) &&
      (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
      
    if (intersect) {
      isInside = !isInside;
    }
  }
  
  return isInside;
};