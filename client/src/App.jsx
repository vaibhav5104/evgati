import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Registration";
import StationsList from "./pages/Stations/StationsList";
import StationDetails from "./pages/Stations/StationDetails";
import MapView from "./pages/Stations/MapView";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/signup" element={<Register />} />

        {/* Stations */}
        <Route path="/stations" element={<StationsList />} />
        <Route path="/stations/:id" element={<StationDetails />} />
        <Route path="/stations/map" element={<MapView />} />
      </Routes>
    </BrowserRouter>
  );
};
