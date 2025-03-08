import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function LocationInput({ start, end, setStart, setEnd, fetchCoordinates, getRoute }) {
    const [typingStart, setTypingStart] = useState("");
    const [typingEnd, setTypingEnd] = useState("");

    // Debounce API calls to prevent excessive requests
    useEffect(() => {
        const delay = setTimeout(() => {
            if (typingStart) fetchCoordinates(typingStart, "start");
        }, 500);
        return () => clearTimeout(delay);
    }, [typingStart]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (typingEnd) fetchCoordinates(typingEnd, "end");
        }, 500);
        return () => clearTimeout(delay);
    }, [typingEnd]);

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
           <input
    type="text"
    placeholder="📍 Start Location"
    className="w-full p-3 text-gray-900 bg-white border border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    value={start}
    onChange={(e) => {
        setStart(e.target.value);
        setTypingStart(e.target.value);
    }}
/>

<input
    type="text"
    placeholder="🚩 Destination"
    className="w-full p-3 text-gray-900 bg-white border border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    value={end}
    onChange={(e) => {
        setEnd(e.target.value);
        setTypingEnd(e.target.value);
    }}
/>


            {/* Get Route Button
            <button
                onClick={getRoute}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all hover:from-blue-600 hover:to-indigo-700"
            >
                🚗 Get Route
            </button> */}
        </div>
    );
}

LocationInput.propTypes = {
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    setStart: PropTypes.func.isRequired,
    setEnd: PropTypes.func.isRequired,
    fetchCoordinates: PropTypes.func.isRequired,
    getRoute: PropTypes.func.isRequired,
};
