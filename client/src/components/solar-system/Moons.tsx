import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { getEllipticalPosition, getOrbitalSpeed } from "@/lib/orbitUtils";

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
      { name: "Io", orbitRadius: 4.5, radius: 0.18, color: "#E6C84D", orbitSpeed: 0.05, orbitTilt: 0.04 },
      { name: "Europa", orbitRadius: 5.5, radius: 0.15, color: "#C9B896", orbitSpeed: 0.035, orbitTilt: 0.02 },
      { name: "Ganymede", orbitRadius: 6.8, radius: 0.25, color: "#8B7D6B", orbitSpeed: 0.02, orbitTilt: 0.03 },
      { name: "Callisto", orbitRadius: 8.0, radius: 0.22, color: "#6B5B4E", orbitSpeed: 0.012, orbitTilt: 0.05 },
    ],
  },
  {
    parentId: "saturn",
    moons: [
      { name: "Titan", orbitRadius: 5.5, radius: 0.25, color: "#D4A84E", orbitSpeed: 0.025, orbitTilt: 0.05 },
      { name: "Rhea", orbitRadius: 6.5, radius: 0.12, color: "#C0C0C0", orbitSpeed: 0.035, orbitTilt: 0.02 },
      { name: "Enceladus", orbitRadius: 4.0, radius: 0.08, color: "#F0F0FF", orbitSpeed: 0.06, orbitTilt: 0.01 },
      { name: "Dione", orbitRadius: 5.0, radius: 0.1, color: "#D8D8D8", orbitSpeed: 0.04, orbitTilt: 0.03 },
    ],
  },
  {
    parentId: "uranus",
    moons: [
      { name: "Titania", orbitRadius: 4.0, radius: 0.14, color: "#A0A0B0", orbitSpeed: 0.03, orbitTilt: 0.08 },
      { name: "Oberon", orbitRadius: 5.0, radius: 0.13, color: "#8B8B90", orbitSpeed: 0.02, orbitTilt: 0.06 },
      { name: "Miranda", orbitRadius: 3.0, radius: 0.07, color: "#B0B0C0", orbitSpeed: 0.05, orbitTilt: 0.1 },
    ],
  },
  {
    parentId: "neptune",
    moons: [
      { name: "Triton", orbitRadius: 4.0, radius: 0.18, color: "#B8C8D8", orbitSpeed: -0.03, orbitTilt: 0.15 },
    ],
  },
];

interface PlanetMoonSystemProps {
  parentId: string;
  parentOrbitRadius: number;
  parentOrbitSpeed: number;
  parentEccentricity: number;
  moons: MoonData[];
}

function PlanetMoonSystem({ parentId, parentOrbitRadius, parentOrbitSpeed, parentEccentricity, moons }: PlanetMoonSystemProps) {
  const parentGroupRef = useRef<THREE.Group>(null);
  const parentAngle = useRef(Math.random() * Math.PI * 2);
  const moonOrbitRefs = useRef<(THREE.Group | null)[]>(moons.map(() => null));
  const moonMeshRefs = useRef<(THREE.Mesh | null)[]>(moons.map(() => null));
  const { simulationSpeed, isPaused } = useSolarSystem();

  const materials = useMemo(() => {
    return moons.map((moon) => {
      const color = new THREE.Color(moon.color);
      return new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.1,
        emissive: color.clone().multiplyScalar(0.15),
        emissiveIntensity: 0.3,
      });
    });
  }, [moons]);

  useFrame(() => {
    if (isPaused) return;

    const speed = getOrbitalSpeed(parentOrbitSpeed, parentAngle.current, parentEccentricity);
    parentAngle.current += speed * simulationSpeed;

    if (parentGroupRef.current) {
      const pos = getEllipticalPosition(parentAngle.current, parentOrbitRadius, parentEccentricity);
      parentGroupRef.current.position.copy(pos);
    }

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
            parentOrbitRadius={parent.orbitRadius}
            parentOrbitSpeed={parent.orbitSpeed}
            parentEccentricity={parent.eccentricity}
            moons={config.moons}
          />
        );
      })}
    </>
  );
}
