import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";
import { ControlPanel } from "@/components/ui/ControlPanel";
import { PlanetList } from "@/components/ui/PlanetList";
import { InfoPanel } from "@/components/ui/InfoPanel";

export default function SolarSystem() {
  return (
    <div className="w-full h-full relative bg-black">
      <Canvas
        camera={{
          position: [0, 80, 120],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          toneMapping: 3,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#000008"]} />
        <fog attach="fog" args={["#000008", 200, 500]} />
        
        <Suspense fallback={null}>
          <SolarSystemScene />
        </Suspense>
      </Canvas>
      
      <ControlPanel />
      <PlanetList />
      <InfoPanel />
      
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
          <p className="text-white/40 text-xs">
            Scroll to zoom • Drag to orbit • Click planets to focus
          </p>
        </div>
      </div>
    </div>
  );
}
