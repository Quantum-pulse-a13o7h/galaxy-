import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { simulationSpeed, isPaused, planets } = useSolarSystem();
  
  const sunData = planets.find(p => p.id === "sun");
  
  const sunMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FDB813"),
      emissive: new THREE.Color("#FF6600"),
      emissiveIntensity: 2,
      roughness: 0.8,
    });
  }, []);

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FF8C00"),
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    });
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += (sunData?.rotationSpeed || 0.001) * simulationSpeed;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.0005;
      const pulse = Math.sin(Date.now() * 0.001) * 0.1 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} material={sunMaterial}>
        <sphereGeometry args={[sunData?.radius || 5, 64, 64]} />
      </mesh>
      <mesh ref={glowRef} material={glowMaterial}>
        <sphereGeometry args={[(sunData?.radius || 5) * 1.2, 32, 32]} />
      </mesh>
      <pointLight 
        color="#FFF5E0" 
        intensity={3} 
        distance={200} 
        decay={0.5}
      />
      <pointLight 
        color="#FFD700" 
        intensity={1.5} 
        distance={150} 
        decay={1}
      />
    </group>
  );
}
