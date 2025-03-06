import { useState } from "react";
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
      <RouteInfo distance="10" duration="20" />
    </div>
  );
}
