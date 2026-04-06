import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { createXRStore, XR, XROrigin } from "@react-three/xr";
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";
import { ControlPanel } from "@/components/ui/ControlPanel";
import { PlanetList } from "@/components/ui/PlanetList";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { SearchBar } from "@/components/ui/SearchBar";
import { VRButton } from "@/components/ui/VRButton";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";

const xrStore = createXRStore({});

export default function SolarSystem() {
  const handleEnterVR = () => {
    xrStore.enterVR();
  };

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
        <XR store={xrStore}>
          <color attach="background" args={["#000008"]} />
          <fog attach="fog" args={["#000008", 200, 500]} />
          
          <XROrigin position={[0, 0, 0]} />
          
          <Suspense fallback={null}>
            <SolarSystemScene />
          </Suspense>
        </XR>
      </Canvas>
      
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs hover:bg-white/20 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Landing
        </Link>
        <Link
          to="/compare"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs hover:bg-white/20 transition"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Compare
        </Link>
      </div>

      <ControlPanel />
      <PlanetList />
      <InfoPanel />
      <SearchBar />
      <VRButton onEnterVR={handleEnterVR} />
      
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
          <p className="text-white/40 text-xs">
            Scroll to zoom • Drag to orbit • Click planets to focus • Ctrl+K to search
          </p>
        </div>
      </div>
    </div>
  );
}
