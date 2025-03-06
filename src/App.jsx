import { useState, useEffect } from "react";
import LocationInput from "./components/LocationInput";
import MapDisplay from "./components/MapDisplay";
import RouteInfo from "./components/RouteInfo";

export default function App() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [route, setRoute] = useState([]);

  // Function to Fetch Coordinates (Move this from MapDisplay.jsx to App.jsx)
  const fetchCoordinates = async (location, type) => {
    if (!location) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();
      console.log(data)
      if (data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        if (type === "start") {
          setStartCoords(coords);
        } else {
          setEndCoords(coords);
        }
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    console.log("Start:", startCoords);
    console.log("End:", endCoords);
  }
  , [startCoords, endCoords]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Smart Route Finder</h1>
      <LocationInput
        start={start}
        end={end}
        setStart={setStart}
        setEnd={setEnd}
        fetchCoordinates={fetchCoordinates} // Pass function as a prop
      />
      <MapDisplay startCoords={startCoords} endCoords={endCoords} route={route} />
      <RouteInfo startCoords={startCoords} endCoords={endCoords} />
    </div>
  );
}
