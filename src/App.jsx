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
    <div className="min-h-screen w-[98.7vw] flex flex-col items-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 p-6">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-8">🚀 Smart Route Finder</h1>

      {/* Main Container */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 grid grid-cols-1 gap-6">
          {/* Location Input Section */}
          <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg backdrop-blur-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📍 Enter Locations</h2>
            <LocationInput
              start={start}
              end={end}
              setStart={setStart}
              setEnd={setEnd}
              fetchCoordinates={fetchCoordinates}
            />
            <button className="w-full mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-700">
              Find Route
            </button>
          </div>



          {/* Route Info Section */}
          <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg backdrop-blur-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Route Details</h2>
            <RouteInfo startCoords={startCoords} endCoords={endCoords} />
          </div>
        </div>
        {/* Map Display Section */}
        <div className="col-span-2 bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg backdrop-blur-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🗺️ Route Map</h2>
          <div className="h-80 rounded-lg overflow-hidden shadow-md">
            <MapDisplay startCoords={startCoords} endCoords={endCoords} route={route} />
          </div>
        </div>
      </div>
    </div>

  );
}
