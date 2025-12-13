import { useMemo } from "react";
import * as THREE from "three";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

export function OrbitLines() {
  const { planets } = useSolarSystem();
  
  const orbits = useMemo(() => {
    return planets
      .filter(p => p.type === "planet")
      .map(planet => {
        const points = [];
        for (let i = 0; i <= 64; i++) {
          const angle = (i / 64) * Math.PI * 2;
          points.push(new THREE.Vector3(
            Math.cos(angle) * planet.orbitRadius,
            0,
            Math.sin(angle) * planet.orbitRadius
          ));
        }
        return { id: planet.id, points, radius: planet.orbitRadius };
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
