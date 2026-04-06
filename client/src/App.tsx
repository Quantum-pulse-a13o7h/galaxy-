import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Compare from "./pages/Compare";
import SolarSystem from "./pages/SolarSystem";
import PlanetDetail from "./pages/PlanetDetail";
import "@fontsource/inter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/explore" element={<SolarSystem />} />
        <Route path="/planet/:planetId" element={<PlanetDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
