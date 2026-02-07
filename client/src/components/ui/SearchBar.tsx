import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

const MOON_NAMES = [
  "Io", "Europa", "Ganymede", "Callisto",
  "Titan", "Rhea", "Enceladus", "Dione",
  "Titania", "Oberon", "Miranda",
  "Triton",
];

const MOON_PARENTS: Record<string, string> = {
  "Io": "jupiter", "Europa": "jupiter", "Ganymede": "jupiter", "Callisto": "jupiter",
  "Titan": "saturn", "Rhea": "saturn", "Enceladus": "saturn", "Dione": "saturn",
  "Titania": "uranus", "Oberon": "uranus", "Miranda": "uranus",
  "Triton": "neptune",
};

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { planets, setFocusedPlanet } = useSolarSystem();

  const allBodies = useMemo(() => {
    const bodies: { name: string; type: string; planetId?: string }[] = planets.map(p => ({
      name: p.name,
      type: p.type,
      planetId: p.id,
    }));
    MOON_NAMES.forEach(moon => {
      bodies.push({
        name: moon,
        type: "moon",
        planetId: MOON_PARENTS[moon],
      });
    });
    bodies.push({ name: "Asteroid Belt", type: "feature" });
    return bodies;
  }, [planets]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allBodies.filter(b => b.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, allBodies]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSelect = (body: { name: string; type: string; planetId?: string }) => {
    if (body.type === "moon" && body.planetId) {
      const parent = planets.find(p => p.id === body.planetId);
      if (parent) setFocusedPlanet(parent);
    } else if (body.planetId) {
      const planet = planets.find(p => p.id === body.planetId);
      if (planet) setFocusedPlanet(planet);
    }
    setIsOpen(false);
    setQuery("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "star": return "☀️";
      case "planet": return "🪐";
      case "moon": return "🌙";
      case "feature": return "🪨";
      default: return "🌐";
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white/60 hover:text-white hover:bg-white/15 transition-all duration-200"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search celestial bodies...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/10 rounded text-xs text-white/40 border border-white/10">
          Ctrl+K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setQuery(""); }}
          />
          <div className="relative w-full max-w-lg mx-4 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="w-5 h-5 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search planets, moons, or features..."
                className="flex-1 bg-transparent text-white text-lg outline-none placeholder-white/30"
              />
              <button onClick={() => { setIsOpen(false); setQuery(""); }} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>

            {results.length > 0 && (
              <div className="max-h-[300px] overflow-y-auto p-2">
                {results.map((body, i) => (
                  <button
                    key={`${body.name}-${i}`}
                    onClick={() => handleSelect(body)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <span className="text-xl">{getIcon(body.type)}</span>
                    <div>
                      <span className="text-white font-medium">{body.name}</span>
                      <span className="text-white/40 text-sm ml-2 capitalize">{body.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <div className="px-4 py-8 text-center text-white/40">
                No celestial bodies found matching "{query}"
              </div>
            )}

            {!query.trim() && (
              <div className="px-4 py-4 text-white/30 text-sm">
                Type to search for planets, moons, and more...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
