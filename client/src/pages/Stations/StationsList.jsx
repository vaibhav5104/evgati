import React, { useEffect, useState } from "react";
import { stationService } from "../../services/stationService";
import StationCard from "../../components/StationCard";

const StationsList = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      const data = await stationService.getAllStations();
      setStations(Array.isArray(data) ? data : []);
    };
    fetchStations();
  }, []);

  return (
    <div className="grid gap-4 p-4">
      {stations.map((station) => (
        <StationCard key={station._id} station={station} />
      ))}
    </div>
  );
};

export default StationsList;
