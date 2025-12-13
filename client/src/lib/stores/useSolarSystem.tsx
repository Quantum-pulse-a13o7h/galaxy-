import { create } from "zustand";
import planetsData from "@/data/planets.json";

export interface Planet {
  id: string;
  name: string;
  type: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  hasAtmosphere?: boolean;
  hasClouds?: boolean;
  hasMoon?: boolean;
  hasRings?: boolean;
  mass: string;
  gravity: string;
  diameter: string;
  dayLength: string;
  yearLength: string;
  temperature: string;
  description: string;
  funFacts: string[];
}

interface SolarSystemState {
  planets: Planet[];
  selectedPlanet: Planet | null;
  focusedPlanet: Planet | null;
  simulationSpeed: number;
  isPaused: boolean;
  showDetailView: boolean;
  
  setSelectedPlanet: (planet: Planet | null) => void;
  setFocusedPlanet: (planet: Planet | null) => void;
  setSimulationSpeed: (speed: number) => void;
  togglePause: () => void;
  setShowDetailView: (show: boolean) => void;
  resetCamera: () => void;
  cameraResetTrigger: number;
}

export const useSolarSystem = create<SolarSystemState>((set) => ({
  planets: planetsData.planets as Planet[],
  selectedPlanet: null,
  focusedPlanet: null,
  simulationSpeed: 1,
  isPaused: false,
  showDetailView: false,
  cameraResetTrigger: 0,
  
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  setFocusedPlanet: (planet) => set({ focusedPlanet: planet, selectedPlanet: planet }),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setShowDetailView: (show) => set({ showDetailView: show }),
  resetCamera: () => set((state) => ({ 
    focusedPlanet: null, 
    selectedPlanet: null,
    cameraResetTrigger: state.cameraResetTrigger + 1
  })),
}));
