import { useState } from "react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { Globe, ChevronLeft, ChevronRight } from "lucide-react";

const planetEmojis: Record<string, string> = {
  sun: "☀️",
  mercury: "🪨",
  venus: "🌕",
  earth: "🌍",
  mars: "🔴",
  jupiter: "🟤",
  saturn: "🪐",
  uranus: "🔵",
  neptune: "💙",
};

export function PlanetList() {
  const { planets, focusedPlanet, setFocusedPlanet } = useSolarSystem();
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm shadow-2xl"
        title="Show planets"
      >
        <Globe className="w-4 h-4" />
        Planets
        <ChevronLeft className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl min-w-[180px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Planets
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="Hide planets"
          >
            <ChevronRight className="w-4 h-4 text-white/70" />
          </button>
        </div>
        
        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {planets.map((planet) => (
            <button
              key={planet.id}
              onClick={() => setFocusedPlanet(planet)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                focusedPlanet?.id === planet.id
                  ? "bg-blue-500/30 border border-blue-400/50"
                  : "bg-white/5 hover:bg-white/10 border border-transparent"
              }`}
            >
              <span className="text-lg">{planetEmojis[planet.id] || "🌐"}</span>
              <span className="text-white text-sm font-medium">{planet.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
