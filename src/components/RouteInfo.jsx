import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "5b3ce3597851110001cf624870e7ba6c0ea64b49af744abb980f67da"; // Replace with your actual OpenRouteService API key

export default function RouteInfo({ startCoords, endCoords }) {
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);

    useEffect(() => {
        if (startCoords && endCoords) {
            getRouteInfo();
        }
    }, [startCoords, endCoords]);

    const getRouteInfo = async () => {
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
        }
    };

    return (
        <div className="bg-white p-4 rounded-md shadow-md mt-4">
            <h2 className="text-lg font-semibold text-gray-700">Route Information</h2>
            {distance && duration ? (
                <>
                    <p><strong>Distance:</strong> {distance}</p>
                    <p><strong>Estimated Duration:</strong> {duration}</p>
                </>
            ) : (
                <p className="text-gray-500">Enter locations to calculate distance and time.</p>
            )}
        </div>
    );
}

RouteInfo.propTypes = {
    startCoords: PropTypes.arrayOf(PropTypes.number),
    endCoords: PropTypes.arrayOf(PropTypes.number),
};
