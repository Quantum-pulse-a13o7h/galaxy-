import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useSolarSystem, Planet as PlanetType } from "@/lib/stores/useSolarSystem";
import { getEllipticalPosition, getOrbitalSpeed } from "@/lib/orbitUtils";

interface EarthProps {
  planet: PlanetType;
}

export function Earth({ planet }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const moonOrbitRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const orbitAngle = useRef(Math.random() * Math.PI * 2);
  const { simulationSpeed, isPaused, focusedPlanet, setFocusedPlanet } = useSolarSystem();
  const [hovered, setHovered] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0.3);
  
  const earthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#4A90D9"),
      roughness: 0.6,
      metalness: 0.1,
      emissive: new THREE.Color("#1a4a7a"),
      emissiveIntensity: 0.2,
    });
  }, []);

  const landMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#3D8B37"),
      roughness: 0.8,
      metalness: 0,
    });
  }, []);

  const cloudMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFFFFF"),
      transparent: true,
      opacity: 0.4,
      roughness: 1,
    });
  }, []);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#87CEEB"),
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
  }, []);

  const moonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E8E8E8"),
      roughness: 0.9,
      metalness: 0,
      emissive: new THREE.Color("#FFFFFF"),
      emissiveIntensity: 0.3,
    });
  }, []);

  useFrame((state, delta) => {
    if (!isPaused) {
      const speed = getOrbitalSpeed(planet.orbitSpeed, orbitAngle.current, planet.eccentricity);
      orbitAngle.current += speed * simulationSpeed;

      if (meshRef.current) {
        meshRef.current.rotation.y += planet.rotationSpeed * simulationSpeed;
      }
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += planet.rotationSpeed * simulationSpeed * 1.2;
      }
      if (moonOrbitRef.current) {
        moonOrbitRef.current.rotation.y += 0.02 * simulationSpeed;
      }
      if (moonRef.current) {
        moonRef.current.rotation.y += 0.005 * simulationSpeed;
      }
    }

    if (groupRef.current) {
      const pos = getEllipticalPosition(orbitAngle.current, planet.orbitRadius, planet.eccentricity);
      groupRef.current.position.copy(pos);
    }
    
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.3;
    setGlowIntensity(pulse);
    
    if (atmosphereRef.current) {
      (atmosphereRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05;
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
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        material={earthMaterial}
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
              <span className="text-white text-sm font-medium">🌍 {planet.name}</span>
            </div>
          </Html>
        )}
      </mesh>

      <mesh ref={cloudsRef} material={cloudMaterial}>
        <sphereGeometry args={[planet.radius * 1.02, 48, 48]} />
      </mesh>

      <mesh ref={atmosphereRef} material={atmosphereMaterial}>
        <sphereGeometry args={[planet.radius * 1.15, 32, 32]} />
      </mesh>

      <pointLight 
        color="#87CEEB" 
        intensity={glowIntensity} 
        distance={5} 
        decay={2}
      />

      <group ref={moonOrbitRef}>
        <mesh ref={moonRef} position={[2.5, 0.3, 0]} material={moonMaterial}>
          <sphereGeometry args={[0.27, 32, 32]} />
        </mesh>
        <pointLight 
          position={[2.5, 0.3, 0]}
          color="#FFFFEE" 
          intensity={0.5} 
          distance={3} 
          decay={2}
        />
      </group>

      {isFocused && (
        <mesh>
          <ringGeometry args={[planet.radius * 1.5, planet.radius * 1.6, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
