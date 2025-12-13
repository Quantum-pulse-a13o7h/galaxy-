import { useState, useEffect } from "react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { Info, Ruler, Weight, Thermometer, Clock, ArrowRight, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchWikipediaExtract } from "@/lib/wikipedia";

export function InfoPanel() {
  const { selectedPlanet, focusedPlanet, setFocusedPlanet, setShowDetailView } = useSolarSystem();
  const navigate = useNavigate();
  const [wikiDescription, setWikiDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const planet = focusedPlanet || selectedPlanet;
  
  useEffect(() => {
    if (planet) {
      setIsLoading(true);
      setWikiDescription(null);
      
      fetchWikipediaExtract(planet.name)
        .then((data) => {
          if (data?.extract) {
            setWikiDescription(data.extract);
          } else {
            setWikiDescription(planet.description);
          }
        })
        .catch(() => {
          setWikiDescription(planet.description);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [planet?.id, planet?.description]);
  
  if (!planet) return null;

  const handleViewDetails = () => {
    navigate(`/planet/${planet.id}`);
  };

  const handleClose = () => {
    setFocusedPlanet(null);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[calc(100%-2rem)]">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                 style={{ backgroundColor: planet.color + "40" }}>
              {planet.type === "star" ? "☀️" : "🌍"}
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{planet.name}</h2>
              <p className="text-white/60 text-sm capitalize">{planet.type}</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        <div className="text-white/80 text-sm mb-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-white/50">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading from Wikipedia...</span>
            </div>
          ) : (
            <p className="line-clamp-2">{wikiDescription || planet.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
              <Ruler className="w-3 h-3" />
              Diameter
            </div>
            <p className="text-white text-sm font-medium">{planet.diameter}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
              <Weight className="w-3 h-3" />
              Gravity
            </div>
            <p className="text-white text-sm font-medium">{planet.gravity}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
              <Thermometer className="w-3 h-3" />
              Temperature
            </div>
            <p className="text-white text-sm font-medium truncate">{planet.temperature}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
              <Clock className="w-3 h-3" />
              Day Length
            </div>
            <p className="text-white text-sm font-medium">{planet.dayLength}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <Info className="w-3 h-3" />
            Click for more details
          </div>
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-all duration-200"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
