import { useMemo } from "react";
import * as THREE from "three";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { getEllipticalOrbitPoints } from "@/lib/orbitUtils";

export function OrbitLines() {
  const { planets } = useSolarSystem();
  
  const orbits = useMemo(() => {
    return planets
      .filter(p => p.type === "planet")
      .map(planet => {
        const points = getEllipticalOrbitPoints(planet.orbitRadius, planet.eccentricity, 128);
        return { id: planet.id, points };
      });
  }, [planets]);

  return (
    <group>
      {orbits.map(orbit => (
        <line key={orbit.id}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={orbit.points.length}
              array={new Float32Array(orbit.points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </line>
      ))}
    </group>
  );
}
