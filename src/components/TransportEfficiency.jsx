import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { FaRoute } from "react-icons/fa";

export default function TransportEfficiency() {
    const [start, setStart] = useState([37.7749, -122.4194]); // Default: San Francisco
    const [end, setEnd] = useState([34.0522, -118.2437]); // Default: Los Angeles
    const [route, setRoute] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRoute = async () => {
        setLoading(true);
        const apiKey = "5b3ce3597851110001cf624870e7ba6c0ea64b49af744abb980f67da"; // Replace with your API key
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;

        try {
            const response = await axios.get(url);
            const coordinates = response.data.routes[0].geometry.coordinates;
            setRoute(coordinates.map(([lon, lat]) => [lat, lon]));
        } catch (error) {
            console.error("Error fetching route:", error);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600 flex items-center justify-center">
                <FaRoute className="mr-2" /> Smart Route Finder
            </h1>

            {/* Input Fields */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Start Latitude, Longitude"
                    className="border p-3 w-full rounded-lg focus:ring focus:ring-blue-300"
                    onChange={(e) => setStart(e.target.value.split(",").map(Number))}
                />
                <input
                    type="text"
                    placeholder="End Latitude, Longitude"
                    className="border p-3 w-full rounded-lg focus:ring focus:ring-blue-300"
                    onChange={(e) => setEnd(e.target.value.split(",").map(Number))}
                />
            </div>

            {/* Find Route Button */}
            <button
                onClick={fetchRoute}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition duration-200 flex items-center justify-center"
            >
                {loading ? "Finding Route..." : "Find Best Route"}
            </button>

            {/* Map Display */}
            <MapContainer center={start} zoom={6} className="mt-6 rounded-lg shadow-xl" style={{ height: "500px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={start}></Marker>
                <Marker position={end}></Marker>
                {route.length > 0 && <Polyline positions={route} color="blue" weight={5} />}
            </MapContainer>
        </div>
    );
}
