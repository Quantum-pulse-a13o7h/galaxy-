import { Suspense } from "react";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { Earth } from "./Earth";
import { Saturn } from "./Saturn";
import { OrbitLines } from "./OrbitLines";
import { Starfield } from "./Starfield";
import { CameraController } from "./CameraController";
import { AsteroidBelt } from "./AsteroidBelt";
import { Moons } from "./Moons";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { MilkyWay } from "./MilkyWay";

export function SolarSystemScene() {
  const { planets } = useSolarSystem();
  
  return (
    <>
      <CameraController />
      
      <ambientLight intensity={0.4} color="#667799" />
      
      <directionalLight
        position={[100, 50, 50]}
        intensity={0.8}
        color="#ffffff"
      />
      <directionalLight
        position={[-80, 30, -80]}
        intensity={0.4}
        color="#6699ff"
      />
      <directionalLight
        position={[0, 100, 0]}
        intensity={0.3}
        color="#ffffff"
      />
      
      <hemisphereLight
        color="#ffffff"
        groundColor="#444466"
        intensity={0.5}
      />
      
     <Suspense fallback={null}>
  <MilkyWay />
  <Starfield />
  <OrbitLines />
  <AsteroidBelt />

  <Sun />

  {planets.filter(p => p.type === "planet").map((planet) => {
    if (planet.id === "earth") {
      return <Earth key={planet.id} planet={planet} />;
    }
    if (planet.id === "saturn") {
      return <Saturn key={planet.id} planet={planet} />;
    }
    return <Planet key={planet.id} planet={planet} />;
  })}

  <Moons />
</Suspense>

    </>
  );
}
