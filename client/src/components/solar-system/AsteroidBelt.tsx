import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

const ASTEROID_COUNT = 2000;
const INNER_RADIUS = 30;
const OUTER_RADIUS = 43;

export function AsteroidBelt() {
  const pointsRef = useRef<THREE.Points>(null);
  const { simulationSpeed, isPaused } = useSolarSystem();

  const [positions, sizes, speeds] = useMemo(() => {
    const positions = new Float32Array(ASTEROID_COUNT * 3);
    const sizes = new Float32Array(ASTEROID_COUNT);
    const speeds = new Float32Array(ASTEROID_COUNT);

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS);
      const heightVariation = (Math.random() - 0.5) * 2.5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = heightVariation;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      sizes[i] = 0.05 + Math.random() * 0.2;
      speeds[i] = 0.0003 + Math.random() * 0.0005;
    }

    return [positions, sizes, speeds];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current && !isPaused) {
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < ASTEROID_COUNT; i++) {
        const x = posArray[i * 3];
        const z = posArray[i * 3 + 2];
        const angle = Math.atan2(z, x) + speeds[i] * simulationSpeed;
        const radius = Math.sqrt(x * x + z * z);

        posArray[i * 3] = Math.cos(angle) * radius;
        posArray[i * 3 + 2] = Math.sin(angle) * radius;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={ASTEROID_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={ASTEROID_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#8B7D6B"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}
