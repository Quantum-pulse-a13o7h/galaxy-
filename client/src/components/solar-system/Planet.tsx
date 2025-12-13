import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useSolarSystem, Planet as PlanetType } from "@/lib/stores/useSolarSystem";

interface PlanetProps {
  planet: PlanetType;
  onClick?: () => void;
}

export function Planet({ planet, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const { simulationSpeed, isPaused, focusedPlanet, setFocusedPlanet } = useSolarSystem();
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  
  const planetMaterial = useMemo(() => {
    const baseColor = new THREE.Color(planet.color);
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.6,
      metalness: 0.15,
      emissive: baseColor.clone().multiplyScalar(0.2),
      emissiveIntensity: 0.5,
    });
  }, [planet.color]);

  useFrame((state, delta) => {
    if (orbitRef.current && !isPaused) {
      orbitRef.current.rotation.y += planet.orbitSpeed * simulationSpeed;
    }
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += planet.rotationSpeed * simulationSpeed;
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  const isFocused = focusedPlanet?.id === planet.id;

  return (
    <group ref={orbitRef}>
      <mesh
        ref={meshRef}
        position={[planet.orbitRadius, 0, 0]}
        material={planetMaterial}
        onClick={(e) => {
          e.stopPropagation();
          setFocusedPlanet(planet);
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[planet.radius, 64, 64]} />
        {hovered && (
          <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 whitespace-nowrap">
              <span className="text-white text-sm font-medium">{planet.name}</span>
            </div>
          </Html>
        )}
      </mesh>
      {isFocused && (
        <mesh position={[planet.orbitRadius, 0, 0]}>
          <ringGeometry args={[planet.radius * 1.5, planet.radius * 1.6, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
