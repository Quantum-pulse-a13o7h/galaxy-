import { BrowserRouter, Routes, Route } from "react-router-dom";
import SolarSystem from "./pages/SolarSystem";
import PlanetDetail from "./pages/PlanetDetail";
import "@fontsource/inter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SolarSystem />} />
        <Route path="/planet/:planetId" element={<PlanetDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
