import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { usePlanetTextures } from "@/lib/usePlanetTextures";

function createRadialTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255, 245, 220, 1)");
  g.addColorStop(0.4, "rgba(255, 170, 60, 0.6)");
  g.addColorStop(1, "rgba(255, 120, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Sprite>(null);
  const { simulationSpeed, isPaused, planets } = useSolarSystem();

  const sunData = planets.find((p) => p.id === "sun");
  const sunRadius = sunData?.radius || 5;

  const textures = usePlanetTextures("sun");

  const sunMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: textures.map,
      emissive: new THREE.Color("#ff8a00"),
      emissiveIntensity: 1.8,
      roughness: 1,
      metalness: 0,
    });
  }, [textures]);

  const coronaMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ff9a00"),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);

  const flareTexture = useMemo(() => createRadialTexture(), []);
  const flareMaterial = useMemo(() => {
    return new THREE.SpriteMaterial({
      map: flareTexture,
      color: new THREE.Color("#ffd7a0"),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [flareTexture]);

  useFrame((state) => {
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += (sunData?.rotationSpeed || 0.001) * simulationSpeed;
    }
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.06 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
    if (flareRef.current) {
      const mat = flareRef.current.material as THREE.SpriteMaterial;
      mat.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} material={sunMaterial}>
        <sphereGeometry args={[sunRadius, 128, 128]} />
      </mesh>
      <mesh ref={glowRef} material={coronaMaterial}>
        <sphereGeometry args={[sunRadius * 1.2, 64, 64]} />
      </mesh>
      <sprite ref={flareRef} material={flareMaterial} scale={[sunRadius * 6, sunRadius * 6, 1]} />
      <sprite material={flareMaterial} scale={[sunRadius * 3.5, sunRadius * 3.5, 1]} />
      <pointLight color="#FFF5E0" intensity={4} distance={200} decay={0.5} />
      <pointLight color="#FFD700" intensity={2} distance={150} decay={1} />
    </group>
  );
}
