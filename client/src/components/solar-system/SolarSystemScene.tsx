import { Suspense } from "react";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { Earth } from "./Earth";
import { Saturn } from "./Saturn";
import { OrbitLines } from "./OrbitLines";
import { Starfield } from "./Starfield";
import { CameraController } from "./CameraController";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

export function SolarSystemScene() {
  const { planets } = useSolarSystem();
  
  return (
    <>
      <CameraController />
      
      <ambientLight intensity={0.15} color="#404060" />
      
      <directionalLight
        position={[50, 50, 50]}
        intensity={0.3}
        color="#ffffff"
      />
      <directionalLight
        position={[-50, 30, -50]}
        intensity={0.1}
        color="#4477ff"
      />
      
      <Suspense fallback={null}>
        <Starfield />
        <OrbitLines />
        
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
      </Suspense>
    </>
  );
}
