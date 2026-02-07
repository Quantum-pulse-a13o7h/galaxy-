import * as THREE from "three";

export function getEllipticalPosition(
  angle: number,
  semiMajorAxis: number,
  eccentricity: number
): THREE.Vector3 {
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
  const x = Math.cos(angle) * semiMajorAxis;
  const z = Math.sin(angle) * semiMinorAxis;
  return new THREE.Vector3(x, 0, z);
}

export function getEllipticalOrbitPoints(
  semiMajorAxis: number,
  eccentricity: number,
  segments: number = 128
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * semiMajorAxis,
        0,
        Math.sin(angle) * semiMinorAxis
      )
    );
  }

  return points;
}

export function getOrbitalSpeed(
  baseSpeed: number,
  angle: number,
  eccentricity: number
): number {
  const r = (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
  return baseSpeed / (r * r);
}
