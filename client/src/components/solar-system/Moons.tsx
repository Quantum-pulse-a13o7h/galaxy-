import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useMoonTexture } from "@/lib/usePlanetTextures";


interface MoonData {
  name: string;
  orbitRadius: number;
  radius: number;
  color: string;
  orbitSpeed: number;
  orbitTilt: number;
}

interface PlanetMoonsConfig {
  parentId: string;
  moons: MoonData[];
}

const PLANET_MOONS: PlanetMoonsConfig[] = [
  {
    parentId: "jupiter",
    moons: [
      { name: "Metis", orbitRadius: 2.8, radius: 0.06, color: "#C9C1B0", orbitSpeed: 0.09, orbitTilt: 0.02 },
      { name: "Adrastea", orbitRadius: 3.2, radius: 0.06, color: "#BFAF98", orbitSpeed: 0.08, orbitTilt: 0.02 },
      { name: "Amalthea", orbitRadius: 3.6, radius: 0.1, color: "#D1A77A", orbitSpeed: 0.075, orbitTilt: 0.03 },
      { name: "Thebe", orbitRadius: 4.0, radius: 0.08, color: "#C89A6B", orbitSpeed: 0.065, orbitTilt: 0.03 },
      { name: "Io", orbitRadius: 4.5, radius: 0.18, color: "#E6C84D", orbitSpeed: 0.05, orbitTilt: 0.04 },
      { name: "Europa", orbitRadius: 5.5, radius: 0.15, color: "#C9B896", orbitSpeed: 0.035, orbitTilt: 0.02 },
      { name: "Ganymede", orbitRadius: 6.8, radius: 0.25, color: "#8B7D6B", orbitSpeed: 0.02, orbitTilt: 0.03 },
      { name: "Callisto", orbitRadius: 8.0, radius: 0.22, color: "#6B5B4E", orbitSpeed: 0.012, orbitTilt: 0.05 },
    ],
  },
  {
    parentId: "saturn",
    moons: [
      { name: "Mimas", orbitRadius: 3.0, radius: 0.07, color: "#B9B9B9", orbitSpeed: 0.07, orbitTilt: 0.02 },
      { name: "Titan", orbitRadius: 5.5, radius: 0.25, color: "#D4A84E", orbitSpeed: 0.025, orbitTilt: 0.05 },
      { name: "Tethys", orbitRadius: 4.6, radius: 0.11, color: "#DADADA", orbitSpeed: 0.045, orbitTilt: 0.02 },
      { name: "Rhea", orbitRadius: 6.5, radius: 0.12, color: "#C0C0C0", orbitSpeed: 0.035, orbitTilt: 0.02 },
      { name: "Enceladus", orbitRadius: 4.0, radius: 0.08, color: "#F0F0FF", orbitSpeed: 0.06, orbitTilt: 0.01 },
      { name: "Dione", orbitRadius: 5.0, radius: 0.1, color: "#D8D8D8", orbitSpeed: 0.04, orbitTilt: 0.03 },
      { name: "Hyperion", orbitRadius: 7.8, radius: 0.09, color: "#A88F73", orbitSpeed: 0.02, orbitTilt: 0.04 },
      { name: "Iapetus", orbitRadius: 9.5, radius: 0.13, color: "#C9B59A", orbitSpeed: 0.012, orbitTilt: 0.08 },
    ],
  },
  {
    parentId: "uranus",
    moons: [
      { name: "Ariel", orbitRadius: 3.6, radius: 0.1, color: "#C7C7D5", orbitSpeed: 0.04, orbitTilt: 0.07 },
      { name: "Umbriel", orbitRadius: 4.4, radius: 0.1, color: "#8E8EA0", orbitSpeed: 0.03, orbitTilt: 0.06 },
      { name: "Titania", orbitRadius: 4.0, radius: 0.14, color: "#A0A0B0", orbitSpeed: 0.03, orbitTilt: 0.08 },
      { name: "Oberon", orbitRadius: 5.0, radius: 0.13, color: "#8B8B90", orbitSpeed: 0.02, orbitTilt: 0.06 },
      { name: "Miranda", orbitRadius: 3.0, radius: 0.07, color: "#B0B0C0", orbitSpeed: 0.05, orbitTilt: 0.1 },
    ],
  },
  {
    parentId: "neptune",
    moons: [
      { name: "Triton", orbitRadius: 4.0, radius: 0.18, color: "#B8C8D8", orbitSpeed: -0.03, orbitTilt: 0.15 },
      { name: "Proteus", orbitRadius: 3.0, radius: 0.09, color: "#8D8D8D", orbitSpeed: 0.05, orbitTilt: 0.06 },
      { name: "Nereid", orbitRadius: 6.5, radius: 0.08, color: "#B0B8C0", orbitSpeed: 0.015, orbitTilt: 0.1 },
    ],
  },
];

interface PlanetMoonSystemProps {
  parentId: string;
  moons: MoonData[];
}

function PlanetMoonSystem({ parentId, moons }: PlanetMoonSystemProps) {
  const parentGroupRef = useRef<THREE.Group>(null);
  const parentObjectRef = useRef<THREE.Object3D | null>(null);
  const parentPosition = useRef(new THREE.Vector3());
  const moonOrbitRefs = useRef<(THREE.Group | null)[]>(moons.map(() => null));
  const moonMeshRefs = useRef<(THREE.Mesh | null)[]>(moons.map(() => null));
  const { simulationSpeed, isPaused } = useSolarSystem();
  const moonTexture = useMoonTexture();
  const { scene } = useThree();


  const materials = useMemo(() => {
  return moons.map((moon) => {
    return new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 1,
      metalness: 0,
      color: new THREE.Color(moon.color),
    });
  });
}, [moons, moonTexture]);


  useFrame(() => {
    if (parentGroupRef.current) {
      if (!parentObjectRef.current) {
        parentObjectRef.current = scene.getObjectByName(`planet-${parentId}`) ?? null;
      }
      if (parentObjectRef.current) {
        parentObjectRef.current.getWorldPosition(parentPosition.current);
        parentGroupRef.current.position.copy(parentPosition.current);
      }
    }

    if (isPaused) return;

    moons.forEach((moon, i) => {
      const orbitGroup = moonOrbitRefs.current[i];
      const meshRef = moonMeshRefs.current[i];
      if (orbitGroup) {
        orbitGroup.rotation.y += moon.orbitSpeed * simulationSpeed;
      }
      if (meshRef) {
        meshRef.rotation.y += 0.01 * simulationSpeed;
      }
    });
  });

  return (
    <group ref={parentGroupRef}>
      {moons.map((moon, i) => (
        <group
          key={moon.name}
          ref={(el) => { moonOrbitRefs.current[i] = el; }}
          rotation={[moon.orbitTilt, 0, 0]}
        >
          <mesh
            ref={(el) => { moonMeshRefs.current[i] = el; }}
            position={[moon.orbitRadius, 0, 0]}
            material={materials[i]}
          >
            <sphereGeometry args={[moon.radius, 24, 24]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Moons() {
  const { planets } = useSolarSystem();

  return (
    <>
      {PLANET_MOONS.map((config) => {
        const parent = planets.find((p) => p.id === config.parentId);
        if (!parent) return null;
        return (
          <PlanetMoonSystem
            key={config.parentId}
            parentId={config.parentId}
            moons={config.moons}
          />
        );
      })}
    </>
  );
}
