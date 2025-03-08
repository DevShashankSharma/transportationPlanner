import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "5b3ce3597851110001cf624870e7ba6c0ea64b49af744abb980f67da"; // Replace with your actual OpenRouteService API key

export default function RouteInfo({ startCoords, endCoords }) {
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (startCoords && endCoords) {
            getRouteInfo();
        }
    }, [startCoords, endCoords]);

    const getRouteInfo = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `https://api.openrouteservice.org/v2/directions/driving-car`,
                {
                    coordinates: [[startCoords[1], startCoords[0]], [endCoords[1], endCoords[0]]], // Ensure proper lat/lon order
                },
                {
                    headers: { Authorization: `Bearer ${API_KEY}` },
                }
            );

            const route = response.data.routes[0];
            setDistance((route.summary.distance / 1000).toFixed(2) + " km"); // Convert to km
            setDuration((route.summary.duration / 60).toFixed(2) + " mins"); // Convert to minutes
        } catch (error) {
            console.error("Error fetching route info:", error);
            setDistance(null);
            setDuration(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-4 w-full text-gray-900 w-full">
            <h2 className="text-xl font-semibold text-blue-600 mb-3">🚗 Route Information</h2>
            {loading ? (
                <p className="text-gray-600">🔄 Calculating...</p>
            ) : distance && duration ? (
                <>
                    <p className="text-lg"><strong>📏 Distance:</strong> {distance}</p>
                    <p className="text-lg"><strong>⏳ Estimated Duration:</strong> {duration}</p>
                </>
            ) : (
                <p className="text-gray-500">📍 Enter locations to calculate distance and time.</p>
            )}
        </div>
    );
}

RouteInfo.propTypes = {
    startCoords: PropTypes.arrayOf(PropTypes.number),
    endCoords: PropTypes.arrayOf(PropTypes.number),
};
