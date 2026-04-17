import * as THREE from 'three';

/**
 * Convert latitude/longitude to 3D position on a sphere.
 */
export function latLngTo3D(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/**
 * Calculate the target rotation to show a lat/lng on the globe.
 */
export function targetRotation(
  lat: number,
  lng: number
): { x: number; y: number } {
  return {
    x: lat * (Math.PI / 180),
    y: -(lng * (Math.PI / 180)) - Math.PI,
  };
}
