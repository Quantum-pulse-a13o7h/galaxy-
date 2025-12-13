import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { Play, Pause, RotateCcw, Gauge } from "lucide-react";

export function ControlPanel() {
  const { 
    simulationSpeed, 
    setSimulationSpeed, 
    isPaused, 
    togglePause, 
    resetCamera 
  } = useSolarSystem();

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl min-w-[200px]">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          Controls
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-xs uppercase tracking-wider mb-2 block">
              Simulation Speed
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-white text-sm font-mono w-12 text-right">
                {simulationSpeed.toFixed(1)}x
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={togglePause}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Play</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="text-sm">Pause</span>
                </>
              )}
            </button>
            
            <button
              onClick={resetCamera}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200"
              title="Reset Camera"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
