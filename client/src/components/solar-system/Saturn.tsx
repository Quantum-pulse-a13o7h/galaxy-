import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useSolarSystem, Planet as PlanetType } from "@/lib/stores/useSolarSystem";
import { getEllipticalPosition, getOrbitalSpeed } from "@/lib/orbitUtils";
import { usePlanetTextures } from "@/lib/usePlanetTextures";

interface SaturnProps {
  planet: PlanetType;
}

export function Saturn({ planet }: SaturnProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const orbitAngle = useRef(Math.random() * Math.PI * 2);
  const { simulationSpeed, isPaused, focusedPlanet, setFocusedPlanet } = useSolarSystem();
  const [hovered, setHovered] = useState(false);
  const textures = usePlanetTextures(planet.id);

  
  const saturnMaterial = useMemo(() => {
  return new THREE.MeshStandardMaterial({
    map: textures.map,
    roughness: 1,
    metalness: 0,
  });
}, [textures]);

   const ringsMaterial = useMemo(() => {
  return new THREE.MeshStandardMaterial({
    map: textures.ringsMap,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
    roughness: 0.8,
    metalness: 0,
    alphaTest: 0.15,
    depthWrite: false,
  });
}, [textures]);


 

  useFrame((state, delta) => {
    if (!isPaused) {
      const speed = getOrbitalSpeed(planet.orbitSpeed, orbitAngle.current, planet.eccentricity);
      orbitAngle.current += speed * simulationSpeed;

      if (meshRef.current) {
        meshRef.current.rotation.y += planet.rotationSpeed * simulationSpeed;
      }
    }

    if (groupRef.current) {
      const pos = getEllipticalPosition(orbitAngle.current, planet.orbitRadius, planet.eccentricity);
      groupRef.current.position.copy(pos);
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
    <group ref={groupRef} name={`planet-${planet.id}`}>

      <mesh
        ref={meshRef}
        material={saturnMaterial}
        onClick={(e) => {
          e.stopPropagation();
          setFocusedPlanet(planet);
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
              <span className="text-white text-sm font-medium">🪐 {planet.name}</span>
            </div>
          </Html>
        )}
      </mesh>

     <group ref={ringsRef} rotation={[Math.PI * 0.4, 0, 0]}>
  <mesh rotation={[Math.PI / 2, 0, 0]} material={ringsMaterial}>
    <ringGeometry args={[planet.radius * 1.4, planet.radius * 2.8, 256]} />
  </mesh>
</group>


      {isFocused && (
        <mesh>
          <ringGeometry args={[planet.radius * 2.8, planet.radius * 2.9, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
